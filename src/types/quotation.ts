export interface StoredProcedure {
  id: string
  title: string
  code: string
  category: string
}

export interface StoredPrestacionRow {
  rowId: string
  code: string
  name: string
  unidad: string
  precioS4: number
  frecuencia: number
  cantidadSugerida: number
  tipo: 'habitual' | 'diferencial' | 'catalogo'
  descuento: number
  cantidad: number
}

export type StoredPrestaciones = Record<string, StoredPrestacionRow[]>

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
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'exported' | 'draft'
  notes?: string
  procedures?: StoredProcedure[]
  prestaciones?: StoredPrestaciones
  prestaciones_total?: number
}
