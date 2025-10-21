-- Seed data for testing Pact app
-- This creates habits for your actual user account

-- Your user ID: 608c8dac-90a3-4028-8dde-b06491f7b24b

-- ============================================
-- 1. Ensure your profile exists (should be auto-created, but just in case)
-- ============================================
-- This will only insert if the profile doesn't exist
INSERT INTO profiles (id, username, display_name, avatar_url)
VALUES 
  ('608c8dac-90a3-4028-8dde-b06491f7b24b', 'ben', 'Ben', null)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. Create sample personal habits
-- ============================================
INSERT INTO habits (id, name, emoji, created_by, is_social)
VALUES 
  ('10000000-0000-0000-0000-000000000001', 'Morning Meditation', '🧘', '608c8dac-90a3-4028-8dde-b06491f7b24b', false),
  ('10000000-0000-0000-0000-000000000002', 'Drink Water', '💧', '608c8dac-90a3-4028-8dde-b06491f7b24b', false),
  ('10000000-0000-0000-0000-000000000003', 'Read 30 Minutes', '📚', '608c8dac-90a3-4028-8dde-b06491f7b24b', false),
  ('10000000-0000-0000-0000-000000000004', 'Workout', '💪', '608c8dac-90a3-4028-8dde-b06491f7b24b', false),
  ('10000000-0000-0000-0000-000000000005', 'Journal', '📝', '608c8dac-90a3-4028-8dde-b06491f7b24b', false);

-- Add you as participant in your personal habits
INSERT INTO habit_participants (habit_id, user_id)
VALUES 
  ('10000000-0000-0000-0000-000000000001', '608c8dac-90a3-4028-8dde-b06491f7b24b'),
  ('10000000-0000-0000-0000-000000000002', '608c8dac-90a3-4028-8dde-b06491f7b24b'),
  ('10000000-0000-0000-0000-000000000003', '608c8dac-90a3-4028-8dde-b06491f7b24b'),
  ('10000000-0000-0000-0000-000000000004', '608c8dac-90a3-4028-8dde-b06491f7b24b'),
  ('10000000-0000-0000-0000-000000000005', '608c8dac-90a3-4028-8dde-b06491f7b24b');

-- ============================================
-- 3. Create sample completions for today
-- ============================================
-- Complete 3 out of 5 habits today (60% progress)
INSERT INTO habit_completions (habit_id, user_id, completed_date)
VALUES 
  ('10000000-0000-0000-0000-000000000001', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE),
  ('10000000-0000-0000-0000-000000000002', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE),
  ('10000000-0000-0000-0000-000000000003', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE);

-- ============================================
-- 4. Create completions for previous days (for streaks/progress view)
-- ============================================
INSERT INTO habit_completions (habit_id, user_id, completed_date)
VALUES 
  -- Yesterday (completed 4/5)
  ('10000000-0000-0000-0000-000000000001', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE - INTERVAL '1 day'),
  ('10000000-0000-0000-0000-000000000002', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE - INTERVAL '1 day'),
  ('10000000-0000-0000-0000-000000000003', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE - INTERVAL '1 day'),
  ('10000000-0000-0000-0000-000000000004', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE - INTERVAL '1 day'),
  
  -- 2 days ago (completed 5/5 - perfect day!)
  ('10000000-0000-0000-0000-000000000001', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE - INTERVAL '2 days'),
  ('10000000-0000-0000-0000-000000000002', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE - INTERVAL '2 days'),
  ('10000000-0000-0000-0000-000000000003', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE - INTERVAL '2 days'),
  ('10000000-0000-0000-0000-000000000004', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE - INTERVAL '2 days'),
  ('10000000-0000-0000-0000-000000000005', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE - INTERVAL '2 days'),
  
  -- 3 days ago (completed 3/5)
  ('10000000-0000-0000-0000-000000000001', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE - INTERVAL '3 days'),
  ('10000000-0000-0000-0000-000000000002', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE - INTERVAL '3 days'),
  ('10000000-0000-0000-0000-000000000005', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE - INTERVAL '3 days'),
  
  -- 4 days ago (completed 2/5)
  ('10000000-0000-0000-0000-000000000001', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE - INTERVAL '4 days'),
  ('10000000-0000-0000-0000-000000000004', '608c8dac-90a3-4028-8dde-b06491f7b24b', CURRENT_DATE - INTERVAL '4 days');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Uncomment and run these to verify your data:

-- Check your habits
-- SELECT h.name, h.emoji, h.is_social
-- FROM habits h
-- JOIN habit_participants hp ON h.id = hp.habit_id
-- WHERE hp.user_id = '608c8dac-90a3-4028-8dde-b06491f7b24b'
-- AND h.archived_at IS NULL;

-- Check today's completions
-- SELECT h.name, h.emoji
-- FROM habit_completions hc
-- JOIN habits h ON hc.habit_id = h.id
-- WHERE hc.user_id = '608c8dac-90a3-4028-8dde-b06491f7b24b'
-- AND hc.completed_date = CURRENT_DATE;

-- Check daily progress for today
-- SELECT 
--   COUNT(DISTINCT hp.habit_id) as total_habits,
--   COUNT(DISTINCT hc.habit_id) as completed_habits,
--   ROUND((COUNT(DISTINCT hc.habit_id)::numeric / COUNT(DISTINCT hp.habit_id)) * 100) as percentage
-- FROM habit_participants hp
-- LEFT JOIN habit_completions hc ON hp.habit_id = hc.habit_id 
--   AND hc.user_id = hp.user_id 
--   AND hc.completed_date = CURRENT_DATE
-- WHERE hp.user_id = '608c8dac-90a3-4028-8dde-b06491f7b24b';
