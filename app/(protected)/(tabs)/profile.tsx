import { Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfilePage() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-24">
        {/* Header with username and avatar */}
        <View className="flex-row items-center justify-between mt-4 mb-4">
          <Text className="text-2xl font-bold text-primary">benwxng</Text>
          <View className="w-12 h-12 rounded-full bg-secondary items-center justify-center">
            <Text className="text-white text-lg font-semibold">B</Text>
          </View>
        </View>

        {/* Longest Streak */}
        <View className="mb-6">
          <Text className="text-sm text-secondary">
            Longest Streak: <Text className="text-error">🔥</Text>{" "}
            <Text className="font-semibold text-primary">21</Text>
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 aspect-square bg-card rounded-xl" />
          <View className="flex-1 aspect-square bg-card rounded-xl" />
          <View className="flex-1 aspect-square bg-card rounded-xl" />
        </View>

        {/* Additional placeholder sections */}
        <View className="bg-card rounded-xl p-4 mb-4 h-32" />
        <View className="bg-card rounded-xl p-4 mb-4 h-32" />
      </ScrollView>
    </View>
  );
}
