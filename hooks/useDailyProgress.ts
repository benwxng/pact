import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "./useSupabase";
import { getToday } from "@/utils/date-helpers";

interface DailyProgress {
  date: string;
  totalHabits: number;
  completedHabits: number;
  percentage: number;
}

/**
 * Calculate daily progress percentage for a user on a specific date
 * Only counts social habits as complete if ALL participants completed it
 */
export const useDailyProgress = (userId: string, date: string = getToday()) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["daily-progress", userId, date],
    queryFn: async (): Promise<DailyProgress> => {
      // 1. Get all habits the user participates in
      const { data: habitParticipants, error: participantsError } =
        await supabase
          .from("habit_participants")
          .select(
            `
          habit_id,
          habits!inner (
            id,
            is_social,
            archived_at
          )
        `
          )
          .eq("user_id", userId)
          .is("habits.archived_at", null);

      if (participantsError) throw participantsError;

      const totalHabits = habitParticipants?.length || 0;

      if (totalHabits === 0) {
        return {
          date,
          totalHabits: 0,
          completedHabits: 0,
          percentage: 0,
        };
      }

      const habitIds =
        habitParticipants?.map((hp) => hp.habit_id).filter(Boolean) || [];

      // 2. Get user's completions for this date
      const { data: userCompletions, error: completionsError } = await supabase
        .from("habit_completions")
        .select("habit_id")
        .eq("user_id", userId)
        .eq("completed_date", date)
        .in("habit_id", habitIds);

      if (completionsError) throw completionsError;

      const userCompletedHabitIds = new Set(
        userCompletions?.map((c) => c.habit_id) || []
      );

      // 3. For social habits, check if ALL participants completed
      const socialHabitIds =
        habitParticipants
          ?.filter(
            (hp) =>
              (hp.habits as any)?.is_social &&
              userCompletedHabitIds.has(hp.habit_id)
          )
          .map((hp) => hp.habit_id) || [];

      let socialHabitsFullyCompleted = 0;

      if (socialHabitIds.length > 0) {
        // Get all participants for social habits
        const { data: allParticipants, error: allParticipantsError } =
          await supabase
            .from("habit_participants")
            .select("habit_id, user_id")
            .in("habit_id", socialHabitIds);

        if (allParticipantsError) throw allParticipantsError;

        // Get all completions for social habits on this date
        const { data: allCompletions, error: allCompletionsError } =
          await supabase
            .from("habit_completions")
            .select("habit_id, user_id")
            .in("habit_id", socialHabitIds)
            .eq("completed_date", date);

        if (allCompletionsError) throw allCompletionsError;

        // Count which social habits are fully completed
        socialHabitIds.forEach((habitId) => {
          const totalParticipants =
            allParticipants?.filter((p) => p.habit_id === habitId).length || 0;
          const completedParticipants =
            allCompletions?.filter((c) => c.habit_id === habitId).length || 0;

          if (totalParticipants === completedParticipants) {
            socialHabitsFullyCompleted++;
          }
        });
      }

      // 4. Calculate completed habits
      const personalHabitsCompleted =
        userCompletions?.filter((c) => !socialHabitIds.includes(c.habit_id))
          .length || 0;

      const completedHabits =
        personalHabitsCompleted + socialHabitsFullyCompleted;

      return {
        date,
        totalHabits,
        completedHabits,
        percentage: Math.round((completedHabits / totalHabits) * 100),
      };
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes (progress changes frequently)
  });
};

/**
 * Get progress for multiple dates (for weekly/monthly views)
 */
export const useDateRangeProgress = (
  userId: string,
  startDate: string,
  endDate: string
) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["date-range-progress", userId, startDate, endDate],
    queryFn: async (): Promise<DailyProgress[]> => {
      // This is a more complex query - we'll implement it when needed for Progress tab
      // For now, return empty array
      return [];
    },
    enabled: !!userId && !!startDate && !!endDate,
  });
};
