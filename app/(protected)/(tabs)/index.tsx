import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSupabase } from "@/hooks/useSupabase";
import { useHabitsForDate } from "@/hooks/useHabits";
import { useDailyProgress } from "@/hooks/useDailyProgress";
import { useToggleHabitCompletion } from "@/hooks/useHabitCompletions";
import { getToday } from "@/utils/date-helpers";
import { DateSelector } from "@/components/DateSelector";
import { ProgressBar } from "@/components/ProgressBar";
import { HabitItem } from "@/components/HabitItem";
import { DailyHabit } from "@/types/database.types";

export default function HomePage() {
  const { session } = useSupabase();
  const insets = useSafeAreaInsets();
  const userId = session?.user?.id;

  const [selectedDate, setSelectedDate] = useState(getToday());

  const {
    data: habits,
    isLoading: habitsLoading,
    error: habitsError,
  } = useHabitsForDate(userId!, selectedDate);

  const { data: progress, isLoading: progressLoading } = useDailyProgress(
    userId!,
    selectedDate
  );

  const toggleCompletion = useToggleHabitCompletion();

  const handleToggle = (habit: DailyHabit) => {
    if (!userId) return;

    toggleCompletion.mutate({
      habitId: habit.id,
      userId,
      date: selectedDate,
      isCompleted: habit.is_completed,
      completionId: habit.completion_id,
    });
  };

  const isLoading = habitsLoading || progressLoading;

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  if (habitsError) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-lg font-semibold text-error mb-2">
          Error loading habits
        </Text>
        <Text className="text-sm text-tertiary text-center">
          {habitsError.message}
        </Text>
      </View>
    );
  }

  const hasHabits = habits && habits.length > 0;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-24"
        showsVerticalScrollIndicator={false}
      >
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {progress && hasHabits && (
          <ProgressBar
            completed={progress.completedHabits}
            total={progress.totalHabits}
            percentage={progress.percentage}
          />
        )}

        <View className="mt-6">
          {!hasHabits ? (
            <View className="items-center justify-center py-16">
              <Text className="text-6xl mb-4">📋</Text>
              <Text className="text-xl font-semibold text-primary mb-2">
                No habits yet
              </Text>
              <Text className="text-sm text-tertiary text-center mb-6">
                Create your first habit to start tracking
              </Text>
              <Pressable className="bg-primary px-6 py-3 rounded-full">
                <Text className="text-white text-base font-semibold">
                  + Create Habit
                </Text>
              </Pressable>
            </View>
          ) : (
            habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                onToggle={() => handleToggle(habit)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {hasHabits && (
        <Pressable
          className="absolute right-5 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg"
          style={{ bottom: insets.bottom + 80 }}
        >
          <Text className="text-white text-3xl font-light">+</Text>
        </Pressable>
      )}
    </View>
  );
}
