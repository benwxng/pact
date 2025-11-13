# Pact - Product Vision & Technical Specification

> **North Star**: Beauty. The app should feel crafted with care and precision.

---

## 🎨 Vision & Philosophy

### Core Principles
- **Beauty First**: Every interaction, animation, and design decision should feel intentional and delightful
- **Clarity**: The UI should be clean, uncluttered, and immediately understandable
- **Precision**: Attention to detail in spacing, typography, animations, and transitions
- **Craftsmanship**: Build with care - no shortcuts, no technical debt

### User's Vision

**Core Purpose**: Pact is a habit tracking app designed to allow users to build habits with friends. The focus is on social accountability and shared progress.

**Home Screen Experience**:
- View today's date and progress
- See all habits for the selected day
- Progress bar showing daily completion percentage
- Date selector to navigate between days
- Plus button (top right) to create new habits
- Each habit shows:
  - Name and emoji
  - Participant avatars (for social habits)
  - Streak counter
  - Completion checkbox

**Habit Creation Flow**:
When user taps the plus button, they can configure:
- Habit name
- Emoji/icon
- Personal vs Social toggle
- If social: Select participants (friends)
- Frequency (daily, specific days, etc.)
- Reminder settings (future)

**Progress Tab Experience**:
- GitHub-style contribution calendar for each habit
- Color depth indicates completion rate:
  - Light shade: Partial completion (e.g., 1/2 people)
  - Dark shade: Full completion (e.g., 2/2 people)
  - Shows long-term patterns and consistency
- Can drill down into specific habits
- Streak visualization

**Social Features**:
- Friend system (add/remove friends)
- Invite friends to habits
- See friend activity/progress
- Shared accountability

---

## 📱 Current State Assessment

### ✅ What's Working
- NativeWind setup (modern, clean styling approach)
- Supabase backend (authentication, database)
- Basic tab navigation (Home, Progress, Profile)
- Habit tracking with completion toggle
- Social habits with participant avatars
- Progress bar visualization
- Date selector for viewing different days

### 🔧 What Needs Improvement
- DateSelector still uses old StyleSheet approach
- Progress screen uses placeholder data
- Profile screen uses placeholder data
- No animations or transitions
- No habit creation flow
- No social invitation system
- Limited progress visualizations

---

## 🎯 Feature Roadmap

### Phase 1: Foundation & Polish
**Goal**: Make the core experience beautiful and delightful

#### Frontend
- [ ] Convert DateSelector to NativeWind
- [ ] Add smooth transitions between screens
- [ ] Implement micro-interactions (haptic feedback, subtle animations)
- [ ] Polish habit item interactions (swipe gestures, completion animation)
- [ ] Improve loading states with skeleton screens
- [ ] Add empty state illustrations
- [ ] Implement pull-to-refresh

#### Backend
- [ ] Optimize queries for performance
- [ ] Add proper error handling
- [ ] Implement caching strategy

---

### Phase 2: Habit Management
**Goal**: Complete CRUD operations for habits

#### Frontend
- [ ] Habit creation modal/screen
  - Name input
  - Emoji/icon picker
  - Frequency selection (daily, weekly, etc.)
  - Social vs personal toggle
- [ ] Habit editing
- [ ] Habit deletion (with confirmation)
- [ ] Habit reordering/prioritization
- [ ] Habit categories/tags

#### Backend
- [ ] Create habit endpoint
- [ ] Update habit endpoint
- [ ] Delete habit endpoint
- [ ] Habit validation logic
- [ ] Handle habit frequency rules

---

### Phase 3: Social Features
**Goal**: Make accountability beautiful and motivating

#### Frontend
- [ ] Friend search/discovery
- [ ] Invitation system
- [ ] Participant management in habits
- [ ] Social feed/activity
- [ ] Shared progress visualization
- [ ] Celebration animations when everyone completes
- [ ] Friend profiles
- [ ] Leaderboards (if appropriate)

#### Backend
- [ ] Friend relationships table/logic
- [ ] Invitation system
- [ ] Notification system
- [ ] Activity feed generation
- [ ] Privacy controls

---

### Phase 4: Progress & Insights
**Goal**: Make progress tracking meaningful and motivating

#### Frontend
- [ ] GitHub-style contribution calendar (already started)
- [ ] Streak visualization
- [ ] Personal statistics
- [ ] Goal setting
- [ ] Achievement badges
- [ ] Weekly/monthly summaries
- [ ] Export data capability

#### Backend
- [ ] Analytics aggregation
- [ ] Streak calculation logic
- [ ] Achievement system
- [ ] Historical data queries

---

### Phase 5: Notifications & Reminders
**Goal**: Keep users engaged without being annoying

#### Frontend
- [ ] Notification preferences UI
- [ ] In-app notification center
- [ ] Custom reminder times

#### Backend
- [ ] Push notification setup
- [ ] Reminder scheduling system
- [ ] Notification preference storage

---

## 🎨 Design System

### Colors
```
Primary (Black):     #000000
Secondary (Gray):    #666666
Tertiary (Lt Gray):  #999999
Background (White):  #FFFFFF
Card (Off-white):    #F5F5F5
Border:              #E5E5E5
Success (Green):     #22C55E
Error (Red):         #EF4444
Warning (Orange):    #F59E0B
```

### Typography Scale
- **Huge**: 32px (Hero text)
- **XXL**: 28px (Page titles)
- **XXL**: 24px (Section headers)
- **XL**: 20px (Large text)
- **LG**: 18px (Subheaders)
- **Base**: 16px (Body text)
- **SM**: 14px (Secondary text)
- **XS**: 12px (Captions)

### Spacing Scale
- **XXXL**: 32px
- **XXL**: 24px
- **XL**: 20px
- **LG**: 16px
- **MD**: 12px
- **SM**: 8px
- **XS**: 4px

### Radius Scale
- **Full**: 9999px (Pills)
- **XL**: 16px
- **LG**: 12px
- **MD**: 8px
- **SM**: 6px

---

## 🏗️ Architecture Decisions

### Frontend Stack
- ✅ React Native (Expo)
- ✅ Expo Router (file-based routing)
- ✅ NativeWind (Tailwind for React Native)
- ✅ TanStack Query (data fetching & caching)
- 🔜 React Native Reanimated (animations)
- 🔜 React Native Gesture Handler (gestures)

### Backend Stack
- ✅ Supabase (PostgreSQL)
- ✅ Supabase Auth
- ✅ Row Level Security (RLS)
- 🔜 Edge Functions (for complex logic)
- 🔜 Realtime subscriptions (for social features)

### Database Schema

#### Understanding Multi-User Databases
In a multi-user app, the database is shared by everyone, but users only see their own data (and data they're allowed to see). This is achieved through:
1. **User IDs**: Every piece of data is linked to a user
2. **Row Level Security (RLS)**: Database rules that automatically filter data
3. **Foreign Keys**: Link related data together

#### Core Tables

**1. `users` (managed by Supabase Auth)**
```sql
users (
  id UUID PRIMARY KEY,              -- Unique user ID (auto-generated)
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT now()
)
```
*Purpose*: Store user profile information. Supabase Auth creates this automatically.

**2. `habits`**
```sql
habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,  -- Who created it
  name TEXT NOT NULL,
  emoji TEXT,
  is_social BOOLEAN DEFAULT false,  -- Personal or social habit
  frequency TEXT DEFAULT 'daily',   -- daily, weekly, etc.
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```
*Purpose*: Store habit definitions. The `created_by` links each habit to its creator.

**3. `habit_participants`**
```sql
habit_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(habit_id, user_id)  -- Prevents duplicate entries
)
```
*Purpose*: Track who is part of each habit. This is a "join table" that connects users to habits.
- For personal habits: Only the creator is a participant
- For social habits: Multiple users are participants

**4. `habit_completions`**
```sql
habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed_at TIMESTAMP DEFAULT now(),
  UNIQUE(habit_id, user_id, date)  -- One completion per user per day
)
```
*Purpose*: Track when users complete habits. Each row = one user completing one habit on one day.

**5. `friendships`**
```sql
friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,      -- Person who sent request
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,    -- Person who received request
  status TEXT DEFAULT 'pending',  -- pending, accepted, rejected
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, friend_id)
)
```
*Purpose*: Track friend relationships. Both people must be connected to see each other.

**6. `habit_invitations`**
```sql
habit_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  inviter_id UUID REFERENCES users(id) ON DELETE CASCADE,   -- Who sent invite
  invitee_id UUID REFERENCES users(id) ON DELETE CASCADE,   -- Who received invite
  status TEXT DEFAULT 'pending',  -- pending, accepted, rejected
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(habit_id, invitee_id)
)
```
*Purpose*: Track habit invitations before someone joins.

#### How Data Flows

**Example: Creating a Social Habit**
1. User A creates a habit → Insert into `habits` table
2. User A is auto-added as participant → Insert into `habit_participants`
3. User A invites User B → Insert into `habit_invitations`
4. User B accepts → Insert into `habit_participants` for User B
5. Both users complete the habit → Insert into `habit_completions` for each

**Example: Viewing Progress**
To get the GitHub-style calendar data:
```sql
SELECT 
  date,
  COUNT(*) as completions,
  COUNT(DISTINCT hp.user_id) as total_participants
FROM habit_completions hc
JOIN habit_participants hp ON hc.habit_id = hp.habit_id
WHERE hc.habit_id = :habit_id
GROUP BY date
ORDER BY date
```
This tells you: "On each day, how many people completed it vs how many total?"

#### Row Level Security (RLS) Examples

Users should only see habits they're part of:
```sql
-- Users can only see habits they participate in
CREATE POLICY "Users can view their habits"
  ON habits FOR SELECT
  USING (
    id IN (
      SELECT habit_id FROM habit_participants 
      WHERE user_id = auth.uid()
    )
  );
```

Users can only mark their own completions:
```sql
-- Users can only insert their own completions
CREATE POLICY "Users can complete their habits"
  ON habit_completions FOR INSERT
  WITH CHECK (user_id = auth.uid());
```

---

## 💡 Implementation Guidelines

### Code Quality
1. **Use NativeWind exclusively** - No more StyleSheet.create()
2. **Component composition** - Keep components small and focused
3. **Custom hooks** - Extract logic into reusable hooks
4. **Type safety** - Leverage TypeScript fully
5. **Error boundaries** - Graceful error handling everywhere

### Performance
1. **Optimize re-renders** - Use React.memo, useMemo, useCallback appropriately
2. **Image optimization** - Lazy load, proper sizing
3. **List virtualization** - FlatList for long lists
4. **Query optimization** - Proper indexes, selective fields
5. **Caching strategy** - Leverage TanStack Query

### User Experience
1. **Loading states** - Never show blank screens
2. **Optimistic updates** - Instant feedback
3. **Haptic feedback** - Physical confirmation of actions
4. **Smooth animations** - 60fps target
5. **Accessibility** - Screen reader support, proper contrast

---

## 🚀 Next Steps

### Immediate Priorities
1. Finish capturing product vision
2. Convert DateSelector to NativeWind
3. Add basic animations to habit completion
4. Implement habit creation flow
5. Connect Progress screen to real data

### Questions to Answer
- [x] What makes a habit "complete" for social habits? → Each person completes individually; color depth shows group completion rate
- [ ] How should friend requests work? (Two-way acceptance? Search by username/email?)
- [ ] What notifications do users want? (Friend completed habit? All completed? Reminders?)
- [ ] How should we handle missed days? (Mark as failed? Allow late completion?)
- [ ] What celebrations/rewards feel authentic?
- [ ] Should habits have specific times? (e.g., "Morning Run" at 6am)
- [ ] Can habits be archived or do they get deleted?
- [ ] Should we track partial completions? (e.g., ran 2/5 miles)

---

## 📚 Learning Resources

### Understanding Multi-User Apps

**Key Concepts**:
1. **Authentication**: Who is the user? (Handled by Supabase Auth)
2. **Authorization**: What can they access? (Handled by RLS policies)
3. **Data Isolation**: Users only see their data (Foreign keys + RLS)
4. **Data Sharing**: Allow specific users to see shared data (Join tables)

**Common Patterns**:
- **One-to-Many**: One user has many habits (user_id in habits table)
- **Many-to-Many**: Many users share many habits (habit_participants join table)
- **Bidirectional**: Friendships work both ways (query both directions)

### Useful Supabase Queries

**Get user's habits**:
```typescript
const { data } = await supabase
  .from('habits')
  .select(`
    *,
    habit_participants!inner(user_id)
  `)
  .eq('habit_participants.user_id', userId);
```

**Get habit with all participants**:
```typescript
const { data } = await supabase
  .from('habits')
  .select(`
    *,
    habit_participants(
      user:users(id, username, avatar_url)
    )
  `)
  .eq('id', habitId);
```

**Get completion rate for a habit**:
```typescript
const { data } = await supabase
  .from('habit_completions')
  .select('date, user_id')
  .eq('habit_id', habitId)
  .gte('date', startDate)
  .lte('date', endDate);
```

## 📝 Notes

### Design Decisions Made
- Progress visualization uses color depth (not binary complete/incomplete)
- Each user completes habits independently (no group completion requirement)
- Personal and social habits share the same table (is_social flag)
- **Sticking with Supabase Client** (no Drizzle ORM) for simplicity and better Supabase feature integration

### Ideas to Explore
- Habit templates (pre-made habits users can add)
- Weekly check-ins or summaries
- Private vs public profiles
- Group challenges or competitions
- Habit chains (complete X in a row unlocks Y)


