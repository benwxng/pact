import { View, Text, StyleSheet } from "react-native";

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
  // Create array of bars for visual representation
  const totalBars = 40;
  const filledBars = Math.round((percentage / 100) * totalBars);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Personal Progress</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>

      <View style={styles.barsContainer}>
        {Array.from({ length: totalBars }, (_, i) => (
          <View
            key={i}
            style={[styles.bar, i < filledBars && styles.barFilled]}
          />
        ))}
      </View>

      <Text style={styles.subtitle}>
        {completed} of {total} habits completed
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  percentage: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  barsContainer: {
    flexDirection: "row",
    gap: 2,
    marginBottom: 8,
  },
  bar: {
    flex: 1,
    height: 32,
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
  },
  barFilled: {
    backgroundColor: "#000",
  },
  subtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
});
