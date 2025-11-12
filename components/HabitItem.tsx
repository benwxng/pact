import { View, Text, Pressable, Image } from "react-native";
import { DailyHabit } from "@/types/database.types";

interface HabitItemProps {
  habit: DailyHabit;
  onToggle: () => void;
}

export const HabitItem = ({ habit, onToggle }: HabitItemProps) => {
  const isCompleted = habit.is_completed;
  const showSocialStatus = habit.is_social && habit.participants.length > 1;

  return (
    <Pressable
      className="flex-row items-center justify-between bg-card rounded-xl p-4 mb-3"
      onPress={onToggle}
    >
      <View className="flex-row items-center flex-1 gap-3">
        {/* Checkbox */}
        <View
          className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
            isCompleted
              ? "bg-primary border-primary"
              : "bg-white border-[#DDDDDD]"
          }`}
        >
          {isCompleted && (
            <Text className="text-white text-sm font-medium">✓</Text>
          )}
        </View>

        {/* Habit info */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-base font-medium text-primary">
              {habit.name} {habit.emoji}
            </Text>
          </View>

          {/* Participants avatars for social habits */}
          {showSocialStatus && (
            <View className="flex-row items-center">
              {habit.participants.slice(0, 3).map((participant, index) => (
                <View
                  key={participant.id}
                  className={`w-7 h-7 rounded-full border-2 border-card overflow-hidden ${
                    index > 0 ? "-ml-2" : ""
                  }`}
                >
                  {participant.avatar_url ? (
                    <Image
                      source={{ uri: participant.avatar_url }}
                      className="w-full h-full"
                    />
                  ) : (
                    <View className="w-full h-full bg-[#DDDDDD] items-center justify-center">
                      <Text className="text-xs font-medium text-secondary">
                        {participant.display_name?.[0]?.toUpperCase() ||
                          participant.username?.[0]?.toUpperCase() ||
                          "?"}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
              {habit.participants.length > 3 && (
                <Text className="text-xs text-tertiary ml-2">
                  +{habit.participants.length - 3}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Social completion indicator */}
      {showSocialStatus && (
        <View className="px-2 py-1 rounded-md bg-white">
          <Text className="text-[11px] text-secondary font-medium">
            {habit.is_social_completed ? "✓ All done" : "Waiting..."}
          </Text>
        </View>
      )}
    </Pressable>
  );
};
