export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string
          persona: 'student' | 'professional' | null
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          email: string
          persona?: 'student' | 'professional' | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          persona?: 'student' | 'professional' | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          repo_url: string | null
          last_opened: string | null
          configuration_json: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          repo_url?: string | null
          last_opened?: string | null
          configuration_json?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          repo_url?: string | null
          last_opened?: string | null
          configuration_json?: Json | null
          created_at?: string
        }
      }
      mock_definitions: {
        Row: {
          id: string
          project_id: string
          api_schema: Json | null
          routes: Json | null
          sample_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          api_schema?: Json | null
          routes?: Json | null
          sample_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          api_schema?: Json | null
          routes?: Json | null
          sample_data?: Json | null
          created_at?: string
        }
      }
      chat_history: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          message: string
          role: 'user' | 'assistant'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          message: string
          role: 'user' | 'assistant'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          message?: string
          role?: 'user' | 'assistant'
          created_at?: string
        }
      }
    }
  }
}

