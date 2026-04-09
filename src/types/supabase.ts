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
          name: string
          role: 'technician' | 'manager' | 'admin'
          pin: string
          hire_date: string
          is_active: boolean
          push_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role: 'technician' | 'manager' | 'admin'
          pin: string
          hire_date: string
          is_active?: boolean
          push_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: 'technician' | 'manager' | 'admin'
          pin?: string
          hire_date?: string
          is_active?: boolean
          push_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          id: string
          category: 'safety' | 'summer_service' | 'winter_service' | 'policy'
          season: 'year_round' | 'summer' | 'winter'
          type: 'multiple_choice' | 'short_answer'
          question: string
          options: string[] | null
          correct_answer: string | null
          grading_guidance: string | null
          reference: string | null
          video_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          category: 'safety' | 'summer_service' | 'winter_service' | 'policy'
          season: 'year_round' | 'summer' | 'winter'
          type: 'multiple_choice' | 'short_answer'
          question: string
          options?: string[] | null
          correct_answer?: string | null
          grading_guidance?: string | null
          reference?: string | null
          video_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          category?: 'safety' | 'summer_service' | 'winter_service' | 'policy'
          season?: 'year_round' | 'summer' | 'winter'
          type?: 'multiple_choice' | 'short_answer'
          question?: string
          options?: string[] | null
          correct_answer?: string | null
          grading_guidance?: string | null
          reference?: string | null
          video_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          id: string
          quote: string
          author: string
          translation: string | null
          sort_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          quote: string
          author: string
          translation?: string | null
          sort_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          quote?: string
          author?: string
          translation?: string | null
          sort_order?: number | null
          created_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          date: string
          questions: Json
          answers: Json
          completed_at: string | null
          signature: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          questions: Json
          answers: Json
          completed_at?: string | null
          signature?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          questions?: Json
          answers?: Json
          completed_at?: string | null
          signature?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      question_history: {
        Row: {
          id: string
          user_id: string
          question_id: string
          used_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          used_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          used_date?: string
          created_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'reminder' | 'report' | 'push'
          title: string
          message: string
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'reminder' | 'report' | 'push'
          title: string
          message: string
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'reminder' | 'report' | 'push'
          title?: string
          message?: string
          sent_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
