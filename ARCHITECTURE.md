# Pact App Architecture

## 🏗️ What's Been Set Up

### ✅ Database Schema (`supabase-schema.sql`)
- All tables created with RLS policies
- Views for optimized queries
- Triggers for auto-updating timestamps and profiles

### ✅ TypeScript Types (`types/database.types.ts`)
- Type-safe interfaces for all tables
- Enhanced types with relations (e.g., `DailyHabit`, `HabitWithParticipants`)
- Export types matching your exact Supabase schema

### ✅ React Query Setup (`providers/query-provider.tsx`)
- QueryClient configured with mobile-optimized defaults
- Caching strategy: 5 min stale time, 10 min garbage collection
- Automatic retry logic for failed requests

### ✅ Date Utilities (`utils/date-helpers.ts`)
All date functions you'll need for habit tracking:
- `getToday()` - Current date as YYYY-MM-DD
- `formatDateForDB(date)` - Convert Date to DB format
- `parseDateFromDB(dateStr)` - Convert DB string to Date
- `addDays(dateStr, days)` - Add/subtract days
- `getCurrentWeekRange()` - Start/end of current week
- Plus more helpers for display and ranges

### ✅ Data Hooks

#### `hooks/useHabits.ts`
- `useHabitsForDate(userId, date)` - Get all habits for a day with completion status
- `useCreateHabit()` - Create personal or social habits
- `useUpdateHabit()` - Update habit name/emoji
- `useArchiveHabit()` - Soft delete a habit
- `useLeaveHabit()` - Remove yourself from a social habit

#### `hooks/useHabitCompletions.ts`
- `useToggleHabitCompletion()` - Check/uncheck a habit (with optimistic updates!)
- `useCompleteMultipleHabits()` - Batch complete multiple habits

#### `hooks/useDailyProgress.ts`
- `useDailyProgress(userId, date)` - Calculate completion percentage
- Correctly handles social habits (only counts when ALL complete)

## 📖 How to Use

### Example: Home Screen

```typescript
import { useHabitsForDate } from "@/hooks/useHabits";
import { useToggleHabitCompletion } from "@/hooks/useHabitCompletions";
import { useDailyProgress } from "@/hooks/useDailyProgress";
import { getToday } from "@/utils/date-helpers";

function HomeScreen() {
  const { session } = useSupabase();
  const userId = session?.user.id;
  const today = getToday();

  // Get habits for today
  const { data: habits, isLoading } = useHabitsForDate(userId!, today);

  // Get progress percentage
  const { data: progress } = useDailyProgress(userId!, today);

  // Toggle completion
  const toggleCompletion = useToggleHabitCompletion();

  const handleToggle = (habit: DailyHabit) => {
    toggleCompletion.mutate({
      habitId: habit.id,
      userId: userId!,
      date: today,
      isCompleted: habit.is_completed,
      completionId: habit.completion_id,
    });
  };

  return (
    <View>
      <Text>Progress: {progress?.percentage}%</Text>
      {habits?.map((habit) => (
        <Pressable key={habit.id} onPress={() => handleToggle(habit)}>
          <Text>{habit.emoji} {habit.name}</Text>
          <Text>{habit.is_completed ? "✓" : "○"}</Text>
          {habit.is_social && (
            <View>
              {habit.participants.map((p) => (
                <Image key={p.id} source={{ uri: p.avatar_url }} />
              ))}
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
}
```

### Example: Create a Habit

```typescript
import { useCreateHabit } from "@/hooks/useHabits";

function CreateHabitModal() {
  const createHabit = useCreateHabit();
  const { session } = useSupabase();

  const handleCreate = () => {
    createHabit.mutate({
      name: "Morning Run",
      emoji: "🏃",
      isSocial: true,
      participantIds: [session.user.id, friendId1, friendId2],
      createdBy: session.user.id,
    });
  };

  // ...
}
```

## 🎯 Key Features

### Optimistic Updates
The `useToggleHabitCompletion` hook includes optimistic updates - the UI updates immediately before the server responds, then rolls back if there's an error.

### Social Habit Logic
- Personal habits: Complete when you check them off
- Social habits: Your completion is saved, but the habit only "counts" toward daily progress when ALL participants complete it
- This is handled automatically in `useDailyProgress`

### Type Safety
All database operations are fully typed. TypeScript will catch errors before runtime:
```typescript
const habit: DailyHabit = {
  id: "...",
  name: "Run",
  // ... TypeScript ensures all required fields are present
};
```

## 📁 Folder Structure

```
pact-app/
├── types/
│   └── database.types.ts      # Database type definitions
├── providers/
│   ├── supabase-provider.tsx  # Supabase client
│   └── query-provider.tsx     # React Query client
├── hooks/
│   ├── useSupabase.ts         # Access Supabase client
│   ├── useHabits.ts           # Habit CRUD operations
│   ├── useHabitCompletions.ts # Completion operations
│   └── useDailyProgress.ts    # Progress calculations
├── utils/
│   └── date-helpers.ts        # Date formatting utilities
└── app/
    └── (protected)/(tabs)/
        ├── index.tsx          # Home tab (to build)
        ├── progress.tsx       # Progress tab (to build)
        └── profile.tsx        # Profile tab (to build)
```

## 🚀 Next Steps

1. **Build Home Screen UI**
   - Date selector
   - Progress bar component
   - Habit list with checkboxes
   - Participant avatars for social habits

2. **Build Progress Screen**
   - GitHub-style heatmap
   - Habit selector
   - Streak calculations

3. **Build Profile Screen**
   - User stats
   - Friends list
   - Settings

4. **Add Friend System**
   - Friend requests
   - Friend search
   - Accept/reject flow

## 💡 Performance Tips

- React Query caches all data automatically
- Queries are scoped by `[queryKey]` - changing the date refetches
- Mutations automatically invalidate related queries
- Use `enabled: !!userId` to prevent queries running before auth loads

## 🐛 Debugging

To see React Query in action:
```typescript
import { useQueryClient } from "@tanstack/react-query";

// In your component
const queryClient = useQueryClient();
console.log(queryClient.getQueryCache().getAll());
```

