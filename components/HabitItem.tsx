import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { DailyHabit } from "@/types/database.types";

interface HabitItemProps {
  habit: DailyHabit;
  onToggle: () => void;
}

export const HabitItem = ({ habit, onToggle }: HabitItemProps) => {
  const isCompleted = habit.is_completed;

  // For social habits, show if everyone completed
  const showSocialStatus = habit.is_social && habit.participants.length > 1;

  return (
    <Pressable style={styles.container} onPress={onToggle}>
      <View style={styles.leftSection}>
        {/* Checkbox */}
        <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
          {isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </View>

        {/* Habit info */}
        <View style={styles.habitInfo}>
          <View style={styles.habitHeader}>
            <Text style={styles.habitName}>
              {habit.name} {habit.emoji}
            </Text>
            {/* You could add streak count here like "🔥 21" */}
          </View>

          {/* Participants avatars for social habits */}
          {showSocialStatus && (
            <View style={styles.participantsRow}>
              {habit.participants.slice(0, 3).map((participant, index) => (
                <View
                  key={participant.id}
                  style={[styles.avatar, index > 0 && styles.avatarOverlap]}
                >
                  {participant.avatar_url ? (
                    <Image
                      source={{ uri: participant.avatar_url }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarPlaceholderText}>
                        {participant.display_name?.[0]?.toUpperCase() ||
                          participant.username?.[0]?.toUpperCase() ||
                          "?"}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
              {habit.participants.length > 3 && (
                <Text style={styles.moreParticipants}>
                  +{habit.participants.length - 3}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Social completion indicator */}
      {showSocialStatus && (
        <View style={styles.socialStatus}>
          <Text style={styles.socialStatusText}>
            {habit.is_social_completed ? "✓ All done" : "Waiting..."}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  habitInfo: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  habitName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  participantsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#f5f5f5",
    overflow: "hidden",
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  moreParticipants: {
    fontSize: 12,
    color: "#999",
    marginLeft: 8,
  },
  socialStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  socialStatusText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
});
