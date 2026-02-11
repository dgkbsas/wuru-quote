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
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'exported'
  notes?: string
}
