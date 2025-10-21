// Date utilities for working with habit completions
// All dates are in user's local timezone

/**
 * Format a Date object as YYYY-MM-DD string for database storage
 */
export const formatDateForDB = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Parse a YYYY-MM-DD string into a Date object
 */
export const parseDateFromDB = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Get today's date as YYYY-MM-DD string
 */
export const getToday = (): string => {
  return formatDateForDB(new Date());
};

/**
 * Get yesterday's date as YYYY-MM-DD string
 */
export const getYesterday = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateForDB(yesterday);
};

/**
 * Add days to a date string
 */
export const addDays = (dateStr: string, days: number): string => {
  const date = parseDateFromDB(dateStr);
  date.setDate(date.getDate() + days);
  return formatDateForDB(date);
};

/**
 * Check if two date strings are the same
 */
export const isSameDay = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

/**
 * Check if a date string is today
 */
export const isToday = (dateStr: string): boolean => {
  return isSameDay(dateStr, getToday());
};

/**
 * Format date for display (e.g., "Mon, May 26")
 */
export const formatDateForDisplay = (dateStr: string): string => {
  const date = parseDateFromDB(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

/**
 * Get an array of date strings for a range
 */
export const getDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  let current = startDate;

  while (current <= endDate) {
    dates.push(current);
    current = addDays(current, 1);
  }

  return dates;
};

/**
 * Get the start and end of the current week (Sun-Sat)
 */
export const getCurrentWeekRange = (): { start: string; end: string } => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const start = new Date(today);
  start.setDate(today.getDate() - dayOfWeek);

  const end = new Date(today);
  end.setDate(today.getDate() + (6 - dayOfWeek));

  return {
    start: formatDateForDB(start),
    end: formatDateForDB(end),
  };
};

/**
 * Get date range for progress view (last 90 days)
 */
export const getProgressDateRange = (): { start: string; end: string } => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 90);

  return {
    start: formatDateForDB(start),
    end: formatDateForDB(end),
  };
};
