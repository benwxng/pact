import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./useSupabase";
import { DailyHabit, Habit, Profile } from "@/types/database.types";
import { getToday } from "@/utils/date-helpers";

/**
 * Fetch all active habits for a user on a specific date
 * Returns habits with completion status and participant info
 */
export const useHabitsForDate = (userId: string, date: string = getToday()) => {
  const { supabase } = useSupabase();

  return useQuery({
    queryKey: ["habits", userId, date],
    queryFn: async (): Promise<DailyHabit[]> => {
      // 1. Get all habits the user participates in
      const { data: habitParticipants, error: participantsError } =
        await supabase
          .from("habit_participants")
          .select(
            `
          habit_id,
          habits!inner (
            id,
            name,
            emoji,
            created_by,
            is_social,
            created_at,
            updated_at,
            archived_at
          )
        `
          )
          .eq("user_id", userId)
          .is("habits.archived_at", null);

      if (participantsError) throw participantsError;

      const habitIds =
        habitParticipants?.map((hp) => hp.habit_id).filter(Boolean) || [];

      if (habitIds.length === 0) return [];

      // 2. Get all participants for these habits
      const { data: allParticipants, error: allParticipantsError } =
        await supabase
          .from("habit_participants")
          .select("habit_id, user_id")
          .in("habit_id", habitIds);

      if (allParticipantsError) throw allParticipantsError;

      // 3. Get profiles for all participants
      const participantUserIds = [
        ...new Set(allParticipants?.map((p) => p.user_id) || []),
      ];

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .in("id", participantUserIds);

      if (profilesError) throw profilesError;

      // Create a map of user_id -> profile for easy lookup
      const profilesMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      // 4. Get completions for this date
      const { data: completions, error: completionsError } = await supabase
        .from("habit_completions")
        .select("*")
        .in("habit_id", habitIds)
        .eq("completed_date", date);

      if (completionsError) throw completionsError;

      // 5. Build the response
      const habitsMap = new Map<string, DailyHabit>();

      habitParticipants?.forEach((hp) => {
        const habit = hp.habits as unknown as Habit;
        if (!habit) return;

        const participants =
          (allParticipants
            ?.filter((p) => p.habit_id === habit.id)
            .map((p) => profilesMap.get(p.user_id))
            .filter(Boolean) as Profile[]) || [];

        const userCompletion = completions?.find(
          (c) => c.habit_id === habit.id && c.user_id === userId
        );

        let isSocialCompleted = false;
        if (habit.is_social) {
          const totalParticipants = participants.length;
          const completedParticipants =
            completions?.filter((c) => c.habit_id === habit.id).length || 0;
          isSocialCompleted = totalParticipants === completedParticipants;
        }

        habitsMap.set(habit.id, {
          ...habit,
          participants,
          is_completed: !!userCompletion,
          completion_id: userCompletion?.id,
          is_social_completed: habit.is_social ? isSocialCompleted : undefined,
        });
      });

      return Array.from(habitsMap.values());
    },
    enabled: !!userId,
  });
};

/**
 * Create a new habit (personal or social)
 */
export const useCreateHabit = () => {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      emoji,
      isSocial,
      participantIds,
      createdBy,
    }: {
      name: string;
      emoji?: string;
      isSocial: boolean;
      participantIds: string[]; // Include creator in this list
      createdBy: string;
    }) => {
      // 1. Create the habit
      const { data: habit, error: habitError } = await supabase
        .from("habits")
        .insert({
          name,
          emoji,
          is_social: isSocial,
          created_by: createdBy,
        })
        .select()
        .single();

      if (habitError) throw habitError;

      // 2. Add participants
      const participantsToInsert = participantIds.map((userId) => ({
        habit_id: habit.id,
        user_id: userId,
      }));

      const { error: participantsError } = await supabase
        .from("habit_participants")
        .insert(participantsToInsert);

      if (participantsError) throw participantsError;

      return habit;
    },
    onSuccess: () => {
      // Invalidate habits queries to refetch
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
};

/**
 * Update a habit (name, emoji)
 */
export const useUpdateHabit = () => {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      habitId,
      name,
      emoji,
    }: {
      habitId: string;
      name?: string;
      emoji?: string;
    }) => {
      const { data, error } = await supabase
        .from("habits")
        .update({ name, emoji })
        .eq("id", habitId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
};

/**
 * Archive (soft delete) a habit
 */
export const useArchiveHabit = () => {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (habitId: string) => {
      const { data, error } = await supabase
        .from("habits")
        .update({ archived_at: new Date().toISOString() })
        .eq("id", habitId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
};

/**
 * Leave a social habit (remove yourself as participant)
 */
export const useLeaveHabit = () => {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      habitId,
      userId,
    }: {
      habitId: string;
      userId: string;
    }) => {
      const { error } = await supabase
        .from("habit_participants")
        .delete()
        .eq("habit_id", habitId)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
};
