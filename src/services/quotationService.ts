import { supabase, type QuotationRecord } from '@/lib/supabase'

export class QuotationService {
  // Create a new quotation
  static async createQuotation(quotationData: {
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
    status?: 'pending' | 'approved' | 'rejected' | 'completed'
    notes?: string
  }): Promise<QuotationRecord | null> {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .insert([{
          ...quotationData,
          status: quotationData.status || 'pending'
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating quotation:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Service error:', error)
      return null
    }
  }

  // Get all quotations with pagination
  static async getQuotations(
    limit: number = 10, 
    offset: number = 0
  ): Promise<{ quotations: QuotationRecord[], count: number }> {
    try {
      const { data, error, count } = await supabase
        .from('quotations')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Error fetching quotations:', error)
        return { quotations: [], count: 0 }
      }

      return { quotations: data || [], count: count || 0 }
    } catch (error) {
      console.error('Service error:', error)
      return { quotations: [], count: 0 }
    }
  }

  // Get quotation by ID
  static async getQuotationById(id: string): Promise<QuotationRecord | null> {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching quotation:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Service error:', error)
      return null
    }
  }

  // Update quotation status
  static async updateQuotationStatus(
    id: string, 
    status: 'pending' | 'approved' | 'rejected' | 'completed',
    notes?: string
  ): Promise<QuotationRecord | null> {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .update({ status, notes })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating quotation:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Service error:', error)
      return null
    }
  }

  // Delete quotation
  static async deleteQuotation(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting quotation:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Service error:', error)
      return false
    }
  }

  // Get quotation statistics
  static async getQuotationStats(): Promise<{
    total: number
    pending: number
    approved: number
    rejected: number
    completed: number
    totalValue: number
    avgValue: number
  }> {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('status, estimated_cost_min, estimated_cost_max')

      if (error) {
        console.error('Error fetching stats:', error)
        return {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          completed: 0,
          totalValue: 0,
          avgValue: 0
        }
      }

      const stats = {
        total: data.length,
        pending: data.filter(q => q.status === 'pending').length,
        approved: data.filter(q => q.status === 'approved').length,
        rejected: data.filter(q => q.status === 'rejected').length,
        completed: data.filter(q => q.status === 'completed').length,
        totalValue: data.reduce((sum, q) => sum + ((q.estimated_cost_min + q.estimated_cost_max) / 2), 0),
        avgValue: 0
      }

      stats.avgValue = stats.total > 0 ? stats.totalValue / stats.total : 0

      return stats
    } catch (error) {
      console.error('Service error:', error)
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        completed: 0,
        totalValue: 0,
        avgValue: 0
      }
    }
  }
}