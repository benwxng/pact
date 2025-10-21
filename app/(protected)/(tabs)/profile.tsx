import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfilePage() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Profile</Text>
      <Text style={{ marginTop: 16, color: "#555" }}>
        This is the profile tab
      </Text>
    </View>
  );
}
