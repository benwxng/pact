import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
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

  // Fetch habits and progress
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
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (habitsError) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error loading habits</Text>
        <Text style={styles.errorSubtext}>{habitsError.message}</Text>
      </View>
    );
  }

  const hasHabits = habits && habits.length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Selector */}
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* Progress Bar */}
        {progress && hasHabits && (
          <ProgressBar
            completed={progress.completedHabits}
            total={progress.totalHabits}
            percentage={progress.percentage}
          />
        )}

        {/* Habits List */}
        <View style={styles.habitsSection}>
          {!hasHabits ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>📋</Text>
              <Text style={styles.emptyStateTitle}>No habits yet</Text>
              <Text style={styles.emptyStateText}>
                Create your first habit to start tracking
              </Text>
              <Pressable style={styles.createButton}>
                <Text style={styles.createButtonText}>+ Create Habit</Text>
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

      {/* Floating Action Button */}
      {hasHabits && (
        <Pressable style={[styles.fab, { bottom: insets.bottom + 80 }]}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  habitsSection: {
    marginTop: 24,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ff3b30",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
