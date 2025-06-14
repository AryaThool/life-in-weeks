import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://auvkjcgnirjxetnrnket.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1dmtqY2duaXJqeGV0bnJua2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NzEyMDYsImV4cCI6MjA2NTQ0NzIwNn0.-AT8lz_m7DYCRTxuuh9l0K1V8Mzum2OKLZzO9How3HY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          birthdate: string
          created_at?: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          birthdate: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          birthdate?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          date: string
          week_number: number
          category: string
          color: string
          attachments: any | null
          notify_on_anniversary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          date: string
          week_number: number
          category: string
          color: string
          attachments?: any | null
          notify_on_anniversary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          date?: string
          week_number?: number
          category?: string
          color?: string
          attachments?: any | null
          notify_on_anniversary?: boolean
          created_at?: string
        }
      }
    }
  }
}