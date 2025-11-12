import { View, Text } from "react-native";

interface ProgressBarProps {
  completed: number;
  total: number;
  percentage: number;
}

export const ProgressBar = ({
  completed,
  total,
  percentage,
}: ProgressBarProps) => {
  const totalBars = 40;
  const filledBars = Math.round((percentage / 100) * totalBars);

  return (
    <View className="py-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-base font-medium text-primary">
          Personal Progress
        </Text>
        <Text className="text-base font-medium text-secondary">
          {percentage}%
        </Text>
      </View>

      <View className="flex-row gap-1.5 mb-2">
        {Array.from({ length: totalBars }, (_, i) => (
          <View
            key={i}
            className={`flex-1 h-12 ${i < filledBars ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </View>

      <Text className="text-xs text-tertiary mt-1">
        {completed} of {total} habits completed
      </Text>
    </View>
  );
};
