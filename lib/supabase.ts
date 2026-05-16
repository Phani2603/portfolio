import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabasePublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey)

// Type definitions for better TypeScript support
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string | null
          github_url: string | null
          live_url: string | null
          image_url: string | null
          tech_stack: string[] | null
          featured: boolean
          stars: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          github_url?: string | null
          live_url?: string | null
          image_url?: string | null
          tech_stack?: string[] | null
          featured?: boolean
          stars?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          github_url?: string | null
          live_url?: string | null
          image_url?: string | null
          tech_stack?: string[] | null
          featured?: boolean
          stars?: number
          created_at?: string
          updated_at?: string
        }
      }
      coding_stats: {
        Row: {
          id: string
          platform: string
          total_solved: number
          easy_solved: number
          medium_solved: number
          hard_solved: number
          ranking: number | null
          updated_at: string
        }
        Insert: {
          id?: string
          platform: string
          total_solved?: number
          easy_solved?: number
          medium_solved?: number
          hard_solved?: number
          ranking?: number | null
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: string
          total_solved?: number
          easy_solved?: number
          medium_solved?: number
          hard_solved?: number
          ranking?: number | null
          updated_at?: string
        }
      }
    }
  }
}
