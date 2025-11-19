import { View, Text, Pressable } from "react-native";
import { formatDateForDisplay, addDays } from "@/utils/date-helpers";

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

  // Split the formatted date into parts (e.g., "Wed, Nov 19" -> ["Wed", "Nov 19"])
  const formattedDate = formatDateForDisplay(selectedDate);
  const [dayOfWeek, ...rest] = formattedDate.split(", ");
  const monthDay = rest.join(", ");

  return (
    <View className="flex-1">
      <View className="flex-row items-baseline mb-4">
        <Text className="text-3xl font-medium text-primary">{dayOfWeek}, </Text>
        <Text className="text-3xl font-medium" style={{ color: "#c5c5c5" }}>
          {monthDay}
        </Text>
      </View>

      <View className="flex-row gap-3">
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
              className="flex-1 py-2 items-center"
            >
              <Text
                className={`text-sm font-medium ${
                  isSelected
                    ? "text-primary"
                    : isFuture || isPast
                      ? "text-tertiary"
                      : "text-primary"
                }`}
                style={
                  isSelected
                    ? {
                        textDecorationLine: "underline",
                        textDecorationColor: "#000000",
                      }
                    : undefined
                }
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
