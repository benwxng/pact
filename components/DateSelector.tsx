import { View, Text, StyleSheet, Pressable } from "react-native";
import { formatDateForDisplay, addDays } from "@/utils/date-helpers";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
} from "@/styles/theme";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DateSelector = ({
  selectedDate,
  onDateChange,
}: DateSelectorProps) => {
  const dates = Array.from({ length: 7 }, (_, i) =>
    addDays(selectedDate, i - 3)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.mainDate}>{formatDateForDisplay(selectedDate)}</Text>

      <View style={styles.daysContainer}>
        {dates.map((date) => {
          const dateObj = new Date(date);
          const dayName = DAYS[dateObj.getDay()];
          const isSelected = date === selectedDate;
          const isPast = date < selectedDate;
          const isFuture = date > selectedDate;

          return (
            <Pressable
              key={date}
              onPress={() => onDateChange(date)}
              style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                  (isFuture || isPast) && !isSelected && styles.dayTextMuted,
                ]}
              >
                {dayName}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xl,
  },
  mainDate: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.medium,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  daysContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  dayButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: borderRadius.md,
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
  dayTextSelected: {
    color: colors.white,
  },
  dayTextMuted: {
    color: colors.tertiary,
  },
});
