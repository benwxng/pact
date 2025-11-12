import { View, Text, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProgressPage() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-24">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6 mt-4">
          <Text className="text-3xl font-bold text-primary">Progress</Text>
          <Pressable className="w-10 h-10 rounded-full bg-card items-center justify-center">
            <Text className="text-lg">🔔</Text>
          </Pressable>
        </View>

        {/* Habit Card */}
        <View className="bg-card rounded-xl p-4 mb-6">
          {/* Habit Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <Text className="text-base font-semibold text-primary">
                Morning Run
              </Text>
              {/* Avatar Stack */}
              <View className="flex-row">
                <View className="w-7 h-7 rounded-full bg-secondary items-center justify-center border-2 border-card">
                  <Text className="text-xs text-white">A</Text>
                </View>
                <View className="w-7 h-7 rounded-full bg-primary items-center justify-center border-2 border-card -ml-2">
                  <Text className="text-xs text-white">B</Text>
                </View>
                <View className="w-7 h-7 rounded-full bg-tertiary items-center justify-center border-2 border-card -ml-2">
                  <Text className="text-xs text-white">C</Text>
                </View>
              </View>
            </View>
            {/* Stats */}
            <View className="flex-row items-center gap-1">
              <Text className="text-xs text-error">🔥</Text>
              <Text className="text-sm font-semibold text-primary">31</Text>
            </View>
          </View>

          {/* Contribution Grid */}
          <View className="gap-1">
            {/* Week rows */}
            {[0, 1, 2, 3, 4, 5, 6].map((week) => (
              <View key={week} className="flex-row gap-1">
                {[...Array(16)].map((_, day) => {
                  // Placeholder logic for demo
                  const isActive = day > 45 || (week > 3 && day > 40);
                  return (
                    <View
                      key={day}
                      className={`w-4 h-4 rounded-sm ${
                        isActive ? "bg-primary" : "bg-border"
                      }`}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* Additional placeholder cards */}
        <View className="bg-card rounded-xl p-4 mb-4 h-32" />
        <View className="bg-card rounded-xl p-4 mb-4 h-32" />
      </ScrollView>
    </View>
  );
}
