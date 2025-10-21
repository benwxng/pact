-- ============================================
-- PACT APP - DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HABITS TABLE
-- ============================================
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  emoji TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_social BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- ============================================
-- HABIT_PARTICIPANTS TABLE
-- ============================================
CREATE TABLE habit_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, user_id)
);

-- ============================================
-- HABIT_COMPLETIONS TABLE
-- ============================================
CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, user_id, completed_date)
);

-- ============================================
-- FRIENDSHIPS TABLE
-- ============================================
CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status friendship_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_habits_created_by ON habits(created_by);
CREATE INDEX idx_habits_archived ON habits(archived_at) WHERE archived_at IS NULL;

CREATE INDEX idx_habit_participants_user ON habit_participants(user_id);
CREATE INDEX idx_habit_participants_habit ON habit_participants(habit_id);

CREATE INDEX idx_completions_user_date ON habit_completions(user_id, completed_date DESC);
CREATE INDEX idx_completions_habit_date ON habit_completions(habit_id, completed_date DESC);
CREATE INDEX idx_completions_date ON habit_completions(completed_date DESC);

CREATE INDEX idx_friendships_requester ON friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX idx_friendships_status ON friendships(status);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Habits: Users can see habits they participate in
CREATE POLICY "Users can view their own habits"
  ON habits FOR SELECT
  USING (
    created_by = auth.uid() 
    OR id IN (
      SELECT habit_id FROM habit_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create habits"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update habits they created"
  ON habits FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete habits they created"
  ON habits FOR DELETE
  USING (auth.uid() = created_by);

-- Habit Participants: Users can see participants of habits they're in
CREATE POLICY "Users can view participants of their habits"
  ON habit_participants FOR SELECT
  USING (
    habit_id IN (
      SELECT habit_id FROM habit_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Habit creators can add participants"
  ON habit_participants FOR INSERT
  WITH CHECK (
    habit_id IN (
      SELECT id FROM habits WHERE created_by = auth.uid()
    )
  );

-- UPDATED: Allow users to leave habits OR creators to remove participants
CREATE POLICY "Users can leave habits and creators can remove participants"
  ON habit_participants FOR DELETE
  USING (
    auth.uid() = user_id -- Users can remove themselves
    OR habit_id IN (
      SELECT id FROM habits WHERE created_by = auth.uid() -- Creators can remove anyone
    )
  );

-- Habit Completions: Users can see completions for habits they're in
CREATE POLICY "Users can view completions of their habits"
  ON habit_completions FOR SELECT
  USING (
    habit_id IN (
      SELECT habit_id FROM habit_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can complete their own habits"
  ON habit_completions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND habit_id IN (
      SELECT habit_id FROM habit_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own completions"
  ON habit_completions FOR DELETE
  USING (auth.uid() = user_id);

-- Friendships: Users can see friendships involving them
CREATE POLICY "Users can view their friendships"
  ON friendships FOR SELECT
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());

CREATE POLICY "Users can create friendship requests"
  ON friendships FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendship requests addressed to them"
  ON friendships FOR UPDATE
  USING (auth.uid() = addressee_id);

-- ============================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- ============================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_friendships_updated_at BEFORE UPDATE ON friendships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER VIEWS FOR COMMON QUERIES
-- ============================================

-- View to get habits with participant count
CREATE VIEW habits_with_participant_count AS
SELECT 
  h.*,
  COUNT(hp.user_id) as participant_count
FROM habits h
LEFT JOIN habit_participants hp ON h.id = hp.habit_id
WHERE h.archived_at IS NULL
GROUP BY h.id;

-- View to check if social habits are fully completed for a date
CREATE VIEW social_habit_completion_status AS
SELECT 
  h.id as habit_id,
  hc.completed_date,
  COUNT(DISTINCT hp.user_id) as total_participants,
  COUNT(DISTINCT hc.user_id) as completed_participants,
  CASE 
    WHEN COUNT(DISTINCT hp.user_id) = COUNT(DISTINCT hc.user_id) THEN true
    ELSE false
  END as is_fully_completed
FROM habits h
INNER JOIN habit_participants hp ON h.id = hp.habit_id
LEFT JOIN habit_completions hc ON h.id = hc.habit_id AND hc.user_id = hp.user_id
WHERE h.is_social = true AND h.archived_at IS NULL
GROUP BY h.id, hc.completed_date;

