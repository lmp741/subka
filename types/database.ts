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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          amount: number
          currency: string
          billing_period: 'monthly' | 'yearly' | 'weekly' | 'daily'
          next_billing_date: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: string
          amount: number
          currency: string
          billing_period: 'monthly' | 'yearly' | 'weekly' | 'daily'
          next_billing_date: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          amount?: number
          currency?: string
          billing_period?: 'monthly' | 'yearly' | 'weekly' | 'daily'
          next_billing_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      onboarding_responses: {
        Row: {
          id: string
          user_id: string
          category: string
          services: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          services: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          services?: string[]
          created_at?: string
        }
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
  }
}

