import { View, Text, StyleSheet, Pressable } from "react-native";
import { formatDateForDisplay, addDays, isToday } from "@/utils/date-helpers";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DateSelector = ({
  selectedDate,
  onDateChange,
}: DateSelectorProps) => {
  // Generate array of dates: 3 days before, current, 3 days after
  const dates = Array.from({ length: 7 }, (_, i) =>
    addDays(selectedDate, i - 3)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.mainDate}>{formatDateForDisplay(selectedDate)}</Text>

      <View style={styles.daysContainer}>
        {dates.map((date, index) => {
          const dateObj = new Date(date);
          const dayName = DAYS[dateObj.getDay()];
          const isSelected = date === selectedDate;
          const isPast = date < selectedDate;
          const isFuture = date > selectedDate;
          const isCurrentDay = isToday(date);

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
    paddingVertical: 20,
  },
  mainDate: {
    fontSize: 28,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: "row",
    gap: 12,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  dayButtonSelected: {
    backgroundColor: "#000",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  dayTextSelected: {
    color: "#fff",
  },
  dayTextMuted: {
    color: "#999",
  },
});
