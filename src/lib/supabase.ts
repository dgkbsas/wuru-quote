import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface QuotationRecord {
  id: string
  created_at: string
  hospital: string
  procedure_name: string
  procedure_code: string
  procedure_category: string
  doctor_name: string
  doctor_specialty: string
  patient_type: string
  estimated_cost_min: number
  estimated_cost_max: number
  complexity: string
  duration: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  notes?: string
}

export type Database = {
  public: {
    Tables: {
      quotations: {
        Row: QuotationRecord
        Insert: Omit<QuotationRecord, 'id' | 'created_at'>
        Update: Partial<Omit<QuotationRecord, 'id' | 'created_at'>>
      }
    }
  }
}