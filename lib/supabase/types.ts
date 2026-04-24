// Auto-generate the full version with: npx supabase gen types typescript --linked
// This is a hand-written minimal version sufficient for MVP.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

/** Minimal FK metadata so embedded selects type-check (matches @supabase/postgrest-js). */
type Rel = {
  foreignKeyName: string
  columns: string[]
  isOneToOne?: boolean
  referencedRelation: string
  referencedColumns: string[]
}

export interface Database {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['companies']['Insert']>
        Relationships: []
      }

      roles: {
        Row: {
          id: string
          company_id: string
          title: string
          job_description: string
          intake_notes: string | null
          seniority_level: 'new_grad' | 'junior' | 'mid'
          interview_plan: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          title: string
          job_description: string
          intake_notes?: string | null
          seniority_level?: 'new_grad' | 'junior' | 'mid'
          interview_plan?: Json | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['roles']['Insert']>
        Relationships: [
          {
            foreignKeyName: "roles_company_id_fkey",
            columns: ["company_id"],
            referencedRelation: "companies",
            referencedColumns: ["id"],
          },
        ]
      }

      candidates: {
        Row: {
          id: string
          role_id: string
          company_id: string
          name: string | null
          email: string | null
          resume_text: string | null
          interview_link_token: string
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          role_id: string
          company_id: string
          name?: string | null
          email?: string | null
          resume_text?: string | null
          interview_link_token: string
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['candidates']['Insert']>
        Relationships: [
          {
            foreignKeyName: "candidates_role_id_fkey",
            columns: ["role_id"],
            referencedRelation: "roles",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "candidates_company_id_fkey",
            columns: ["company_id"],
            referencedRelation: "companies",
            referencedColumns: ["id"],
          },
        ]
      }

      interviews: {
        Row: {
          id: string
          candidate_id: string
          vapi_call_id: string | null
          started_at: string | null
          ended_at: string | null
          duration_seconds: number | null
          transcript: Json | null
          recording_url: string | null
          status: 'pending' | 'active' | 'completed' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          vapi_call_id?: string | null
          started_at?: string | null
          ended_at?: string | null
          duration_seconds?: number | null
          transcript?: Json | null
          recording_url?: string | null
          status?: 'pending' | 'active' | 'completed' | 'failed'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['interviews']['Insert']>
        Relationships: [
          {
            foreignKeyName: "interviews_candidate_id_fkey",
            columns: ["candidate_id"],
            referencedRelation: "candidates",
            referencedColumns: ["id"],
          },
        ]
      }

      scorecards: {
        Row: {
          id: string
          interview_id: string
          candidate_id: string
          technical_depth: number | null
          cs_fundamentals: number | null
          communication_clarity: number | null
          problem_solving: number | null
          overall_score: number | null
          recommendation: 'strong_yes' | 'yes' | 'no' | 'strong_no' | null
          summary: string | null
          strengths: string[] | null
          concerns: string[] | null
          red_flags: string[] | null
          standout_moments: string[] | null
          cheat_signals: Json | null
          generated_at: string
        }
        Insert: {
          id?: string
          interview_id: string
          candidate_id: string
          technical_depth?: number | null
          cs_fundamentals?: number | null
          communication_clarity?: number | null
          problem_solving?: number | null
          overall_score?: number | null
          recommendation?: 'strong_yes' | 'yes' | 'no' | 'strong_no' | null
          summary?: string | null
          strengths?: string[] | null
          concerns?: string[] | null
          red_flags?: string[] | null
          standout_moments?: string[] | null
          cheat_signals?: Json | null
          generated_at?: string
        }
        Update: Partial<Database['public']['Tables']['scorecards']['Insert']>
        Relationships: [
          {
            foreignKeyName: "scorecards_interview_id_fkey",
            columns: ["interview_id"],
            referencedRelation: "interviews",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "scorecards_candidate_id_fkey",
            columns: ["candidate_id"],
            referencedRelation: "candidates",
            referencedColumns: ["id"],
          },
        ]
      }
    }
  }
}

// Convenience row types
export type Company   = Database['public']['Tables']['companies']['Row']
export type Role      = Database['public']['Tables']['roles']['Row']
export type Candidate = Database['public']['Tables']['candidates']['Row']
export type Interview = Database['public']['Tables']['interviews']['Row']
export type Scorecard = Database['public']['Tables']['scorecards']['Row']
