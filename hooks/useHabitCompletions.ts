import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./useSupabase";

/**
 * Toggle a habit completion for a specific date
 * If completed, it will uncomplete. If not completed, it will complete.
 */
export const useToggleHabitCompletion = () => {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      habitId,
      userId,
      date,
      isCompleted,
      completionId,
    }: {
      habitId: string;
      userId: string;
      date: string;
      isCompleted: boolean;
      completionId?: string;
    }) => {
      if (isCompleted) {
        // Uncomplete: Delete the completion
        if (!completionId) throw new Error("Completion ID required");

        const { error } = await supabase
          .from("habit_completions")
          .delete()
          .eq("id", completionId);

        if (error) throw error;
        return { action: "uncompleted" };
      } else {
        // Complete: Insert a new completion
        const { data, error } = await supabase
          .from("habit_completions")
          .insert({
            habit_id: habitId,
            user_id: userId,
            completed_date: date,
          })
          .select()
          .single();

        if (error) throw error;
        return { action: "completed", data };
      }
    },
    onMutate: async ({ habitId, userId, date, isCompleted }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["habits", userId, date] });

      // Snapshot previous value
      const previousHabits = queryClient.getQueryData(["habits", userId, date]);

      // Optimistically update to the new value
      queryClient.setQueryData(["habits", userId, date], (old: any) => {
        if (!old) return old;

        return old.map((habit: any) => {
          if (habit.id === habitId) {
            return {
              ...habit,
              is_completed: !isCompleted,
            };
          }
          return habit;
        });
      });

      // Return context with previous data
      return { previousHabits };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousHabits) {
        queryClient.setQueryData(
          ["habits", variables.userId, variables.date],
          context.previousHabits
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch to ensure we're in sync with server
      queryClient.invalidateQueries({
        queryKey: ["habits", variables.userId, variables.date],
      });
      queryClient.invalidateQueries({
        queryKey: ["daily-progress", variables.userId, variables.date],
      });
    },
  });
};

/**
 * Batch complete multiple habits at once
 */
export const useCompleteMultipleHabits = () => {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      completions,
    }: {
      completions: Array<{
        habit_id: string;
        user_id: string;
        completed_date: string;
      }>;
    }) => {
      const { data, error } = await supabase
        .from("habit_completions")
        .insert(completions)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["daily-progress"] });
    },
  });
};
