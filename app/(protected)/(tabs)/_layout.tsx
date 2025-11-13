import { Tabs } from "expo-router";
import { View, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BarChart3, Home, User } from "lucide-react-native";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute left-5 right-5 rounded-full bg-primary"
      style={{
        bottom: Platform.OS === "ios" ? 20 + insets.bottom : 20,
        height: 48,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <View className="flex-1 flex-row items-center justify-around">
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Icon components mapping
          const IconComponent =
            route.name === "progress"
              ? BarChart3
              : route.name === "index"
                ? Home
                : User;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              className={`flex-1 items-center justify-center h-full ${
                isFocused ? "opacity-100" : "opacity-50"
              }`}
            >
              <IconComponent {...({ color: "white", size: 24 } as any)} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="progress" options={{ title: "Progress" }} />
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
