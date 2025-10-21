-- Complete fix for infinite recursion in RLS policies
-- This happens when policies reference tables that have their own policies
-- Run this entire script in your Supabase SQL Editor

-- ============================================
-- STEP 1: Create helper function that bypasses RLS
-- ============================================
CREATE OR REPLACE FUNCTION is_habit_participant(habit_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM habit_participants
    WHERE habit_id = habit_id_param 
    AND user_id = user_id_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 2: Fix habits policies
-- ============================================
DROP POLICY IF EXISTS "Users can view their own habits" ON habits;

CREATE POLICY "Users can view their own habits"
  ON habits FOR SELECT
  USING (
    created_by = auth.uid() 
    OR is_habit_participant(id, auth.uid())
  );

-- ============================================
-- STEP 3: Fix habit_participants policies
-- ============================================
DROP POLICY IF EXISTS "Users can view participants of their habits" ON habit_participants;

CREATE POLICY "Users can view participants of their habits"
  ON habit_participants FOR SELECT
  USING (
    is_habit_participant(habit_id, auth.uid())
  );

-- ============================================
-- STEP 4: Fix habit_completions policies
-- ============================================
DROP POLICY IF EXISTS "Users can view completions of their habits" ON habit_completions;

CREATE POLICY "Users can view completions of their habits"
  ON habit_completions FOR SELECT
  USING (
    is_habit_participant(habit_id, auth.uid())
  );

DROP POLICY IF EXISTS "Users can complete their own habits" ON habit_completions;

CREATE POLICY "Users can complete their own habits"
  ON habit_completions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND is_habit_participant(habit_id, auth.uid())
  );

-- ============================================
-- STEP 5: Fix habit_participants INSERT policy
-- ============================================
DROP POLICY IF EXISTS "Habit creators can add participants" ON habit_participants;

CREATE POLICY "Habit creators can add participants"
  ON habit_participants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE id = habit_id 
      AND created_by = auth.uid()
    )
  );

-- ============================================
-- Verify the function works
-- ============================================
-- Test query (uncomment to test):
-- SELECT is_habit_participant('some-habit-id'::uuid, auth.uid());

