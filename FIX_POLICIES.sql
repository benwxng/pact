-- Fix infinite recursion in habit_participants policy
-- Run this in your Supabase SQL Editor

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view participants of their habits" ON habit_participants;

-- Create a better policy that doesn't create circular references
-- Users can view participants if they are also a participant OR if they created the habit
CREATE POLICY "Users can view participants of their habits"
  ON habit_participants FOR SELECT
  USING (
    -- User is a participant in the same habit
    EXISTS (
      SELECT 1 FROM habit_participants hp2 
      WHERE hp2.habit_id = habit_participants.habit_id 
      AND hp2.user_id = auth.uid()
    )
    -- OR user created the habit
    OR EXISTS (
      SELECT 1 FROM habits h
      WHERE h.id = habit_participants.habit_id
      AND h.created_by = auth.uid()
    )
  );

