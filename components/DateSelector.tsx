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

  return (
    <View className="flex-1">
      <Text className="text-3xl font-medium text-primary mb-4">
        {formatDateForDisplay(selectedDate)}
      </Text>

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
              className={`flex-1 py-2 items-center rounded-lg ${
                isSelected ? "bg-primary" : ""
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isSelected
                    ? "text-white"
                    : isFuture || isPast
                      ? "text-tertiary"
                      : "text-primary"
                }`}
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
