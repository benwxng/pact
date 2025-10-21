// TypeScript types generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          name: string;
          emoji: string | null;
          created_by: string;
          is_social: boolean;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          emoji?: string | null;
          created_by: string;
          is_social?: boolean;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          emoji?: string | null;
          created_by?: string;
          is_social?: boolean;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
      };
      habit_participants: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          user_id?: string;
          joined_at?: string;
        };
      };
      habit_completions: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_date: string; // DATE type comes through as string
          completed_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          completed_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          user_id?: string;
          completed_date?: string;
          completed_at?: string;
        };
      };
      friendships: {
        Row: {
          id: string;
          requester_id: string;
          addressee_id: string;
          status: "pending" | "accepted" | "rejected";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          addressee_id: string;
          status?: "pending" | "accepted" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          requester_id?: string;
          addressee_id?: string;
          status?: "pending" | "accepted" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      habits_with_participant_count: {
        Row: {
          id: string;
          name: string;
          emoji: string | null;
          created_by: string;
          is_social: boolean;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
          participant_count: number;
        };
      };
      social_habit_completion_status: {
        Row: {
          habit_id: string;
          completed_date: string | null;
          total_participants: number;
          completed_participants: number;
          is_fully_completed: boolean;
        };
      };
    };
  };
}

// Convenience types for working with the database
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitParticipant =
  Database["public"]["Tables"]["habit_participants"]["Row"];
export type HabitCompletion =
  Database["public"]["Tables"]["habit_completions"]["Row"];
export type Friendship = Database["public"]["Tables"]["friendships"]["Row"];

export type HabitWithParticipantCount =
  Database["public"]["Views"]["habits_with_participant_count"]["Row"];
export type SocialHabitCompletionStatus =
  Database["public"]["Views"]["social_habit_completion_status"]["Row"];

// Enhanced types with relations
export type HabitWithParticipants = Habit & {
  participants: Profile[];
  participant_count: number;
};

export type HabitWithCompletions = Habit & {
  completions: HabitCompletion[];
  participants: Profile[];
};

export type DailyHabit = Habit & {
  participants: Profile[];
  is_completed: boolean;
  completion_id?: string;
  is_social_completed?: boolean; // For social habits: are ALL participants done?
};
