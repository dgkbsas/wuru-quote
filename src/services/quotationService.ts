import { type QuotationRecord, type StoredProcedure, type StoredPrestaciones, type StoredPrestacionRow } from '@/types/quotation'
import { EPISODIOS_DB } from '@/data/episodios'
import { getDescuento } from '@/data/coberturas'

const STORAGE_KEY = 'wuru_quotations'
const STORAGE_VERSION_KEY = 'wuru_quotations_version'
const STORAGE_VERSION = 'v3' // bump to re-seed with prestaciones

function getAll(): QuotationRecord[] {
  const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY)
  if (storedVersion !== STORAGE_VERSION) {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION)
    const seed = generateSeedData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const seed = generateSeedData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }
  return JSON.parse(raw) as QuotationRecord[]
}

function saveAll(records: QuotationRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

const SEED_PROCEDURES = [
  { name: 'Colecistectomía Laparoscópica', code: '51.23', category: 'Cirugía General', min: 45000, max: 65000, complexity: 'Media', duration: '1-2 horas' },
  { name: 'Artroscopía de Rodilla', code: '80.26', category: 'Ortopedia', min: 55000, max: 80000, complexity: 'Media', duration: '1-2 horas' },
  { name: 'Cesárea Programada', code: '74.1', category: 'Ginecología y Obstetricia', min: 35000, max: 50000, complexity: 'Media', duration: '1-2 horas' },
  { name: 'Hernioplastia Inguinal', code: '53.00', category: 'Cirugía General', min: 30000, max: 45000, complexity: 'Baja', duration: '1-2 horas' },
  { name: 'Endoscopía Digestiva Alta', code: '45.13', category: 'Gastroenterología', min: 15000, max: 25000, complexity: 'Baja', duration: '30 min - 1 hora' },
  { name: 'Reemplazo de Cadera', code: '81.51', category: 'Ortopedia', min: 180000, max: 220000, complexity: 'Alta', duration: '3-4 horas' },
  { name: 'Reemplazo de Rodilla', code: '81.54', category: 'Ortopedia', min: 170000, max: 210000, complexity: 'Alta', duration: '3-4 horas' },
  { name: 'Apendicectomía', code: '47.09', category: 'Cirugía General', min: 32000, max: 48000, complexity: 'Media', duration: '1-2 horas' },
  { name: 'Liposucción', code: '86.83', category: 'Cirugía Plástica', min: 90000, max: 130000, complexity: 'Media', duration: '2-3 horas' },
  { name: 'Cirugía de Columna Lumbar', code: '81.04', category: 'Neurocirugía', min: 200000, max: 280000, complexity: 'Alta', duration: '4-6 horas' },
  { name: 'Rinoplastía', code: '21.87', category: 'Cirugía Plástica', min: 60000, max: 95000, complexity: 'Media', duration: '2-3 horas' },
  { name: 'Histerectomía Laparoscópica', code: '68.41', category: 'Ginecología y Obstetricia', min: 70000, max: 100000, complexity: 'Media', duration: '2-3 horas' },
  { name: 'Bypass Gástrico', code: '44.31', category: 'Cirugía Bariátrica', min: 120000, max: 180000, complexity: 'Alta', duration: '3-4 horas' },
  { name: 'Manga Gástrica', code: '43.82', category: 'Cirugía Bariátrica', min: 100000, max: 150000, complexity: 'Alta', duration: '2-3 horas' },
  { name: 'Cateterismo Cardíaco', code: '37.22', category: 'Cardiología', min: 80000, max: 120000, complexity: 'Alta', duration: '1-2 horas' },
  { name: 'Amigdalectomía', code: '28.2', category: 'Otorrinolaringología', min: 20000, max: 35000, complexity: 'Baja', duration: '30 min - 1 hora' },
  { name: 'Septoplastía', code: '21.5', category: 'Otorrinolaringología', min: 40000, max: 60000, complexity: 'Media', duration: '1-2 horas' },
  { name: 'Colonoscopía', code: '45.23', category: 'Gastroenterología', min: 12000, max: 22000, complexity: 'Baja', duration: '30 min - 1 hora' },
]

const SEED_HOSPITALS = [
  'Hospital Ángeles Pedregal (CDMX)',
  'Hospital Ángeles Lomas (CDMX / Huixquilucan)',
  'Hospital Ángeles México (CDMX)',
  'Hospital Ángeles Puebla (Puebla)',
  'Hospital Ángeles Querétaro (Querétaro)',
  'Hospital Ángeles Acoxpa (CDMX)',
  'Hospital Ángeles Lindavista (CDMX)',
  'Hospital Ángeles León (Guanajuato)',
  'Hospital Ángeles Metropolitano (CDMX)',
  'Hospital Ángeles Mocel (CDMX)',
]

const SEED_DOCTORS = [
  { name: 'Dr. Carlos Méndez', specialty: 'Cirugía General' },
  { name: 'Dra. María López', specialty: 'Ortopedia y Traumatología' },
  { name: 'Dr. Roberto Hernández', specialty: 'Ginecología' },
  { name: 'Dr. Alejandro Torres', specialty: 'Cirugía General' },
  { name: 'Dra. Patricia Ruiz', specialty: 'Gastroenterología' },
  { name: 'Dr. Fernando Ríos', specialty: 'Ortopedia y Traumatología' },
  { name: 'Dra. Claudia Vega', specialty: 'Cirugía General' },
  { name: 'Dr. Enrique Salazar', specialty: 'Cirugía Plástica' },
  { name: 'Dr. Javier Morales', specialty: 'Neurocirugía' },
  { name: 'Dra. Sofía Ramírez', specialty: 'Cardiología' },
  { name: 'Dr. Miguel Ángel Castro', specialty: 'Cirugía Bariátrica' },
  { name: 'Dra. Laura Domínguez', specialty: 'Otorrinolaringología' },
  { name: 'Dr. Ricardo Fuentes', specialty: 'Cirugía General' },
  { name: 'Dra. Ana Belén Ortiz', specialty: 'Ginecología' },
]

const SEED_PATIENT_TYPES = ['particular', 'prepagada', 'eps', 'soat']
const SEED_STATUSES: QuotationRecord['status'][] = ['pending', 'approved', 'rejected', 'completed']

/** Find a matching EpisodioData for a seed procedure by keyword overlap */
function findEpisodioForSeed(procedureName: string) {
  const lower = procedureName.toLowerCase()
  return EPISODIOS_DB.find(ep =>
    ep.keywords.some(kw => lower.includes(kw.toLowerCase()))
  ) ?? null
}

/** Build StoredPrestaciones from an episodio for a given cobertura */
function buildSeedPrestaciones(
  procedureId: string,
  procedureName: string,
  patientType: string
): StoredPrestaciones | undefined {
  const ep = findEpisodioForSeed(procedureName)
  if (!ep) return undefined
  const makeRow = (
    p: { code: string; name: string; unidad: string; precioS4: number; frecuencia: number; cantidadSugerida: number },
    tipo: 'habitual' | 'diferencial'
  ): StoredPrestacionRow => ({
    rowId: `seed-${p.code}-${procedureId}`,
    code: p.code,
    name: p.name,
    unidad: p.unidad,
    precioS4: p.precioS4,
    frecuencia: p.frecuencia,
    cantidadSugerida: p.cantidadSugerida,
    tipo,
    descuento: getDescuento(patientType, p.unidad),
    cantidad: p.cantidadSugerida,
  })
  return {
    [procedureId]: [
      ...ep.prestacionesComunes.map(p => makeRow(p, 'habitual')),
    ],
  }
}

// Simple seeded pseudo-random to get deterministic data
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function generateSeedData(): QuotationRecord[] {
  const rand = mulberry32(42)
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]

  const records: QuotationRecord[] = []

  // Jul 2025 (month 6) through Feb 2026 (month 1) — 8 months
  const months = [
    { year: 2025, month: 6 },  // Jul
    { year: 2025, month: 7 },  // Aug
    { year: 2025, month: 8 },  // Sep
    { year: 2025, month: 9 },  // Oct
    { year: 2025, month: 10 }, // Nov
    { year: 2025, month: 11 }, // Dec
    { year: 2026, month: 0 },  // Jan
    { year: 2026, month: 1 },  // Feb
  ]

  for (const { year, month } of months) {
    // 6-10 quotations per month
    const count = 6 + Math.floor(rand() * 5)
    for (let i = 0; i < count; i++) {
      const proc = pick(SEED_PROCEDURES)
      const doctor = pick(SEED_DOCTORS)
      const day = 1 + Math.floor(rand() * 27)
      const costVariance = 0.85 + rand() * 0.3 // 85% to 115% of base
      const recordId = crypto.randomUUID()
      const patientType = pick(SEED_PATIENT_TYPES)
      const storedProcedures: StoredProcedure[] = [{
        id: recordId,
        title: proc.name,
        code: proc.code,
        category: proc.category,
      }]
      const prestaciones = buildSeedPrestaciones(recordId, proc.name, patientType)
      const prestacionesTotal = prestaciones
        ? Object.values(prestaciones).flat().reduce(
            (s, r) => s + r.precioS4 * (1 - r.descuento / 100) * r.cantidad, 0
          )
        : undefined
      records.push({
        id: recordId,
        created_at: new Date(year, month, day, 8 + Math.floor(rand() * 10), Math.floor(rand() * 60)).toISOString(),
        hospital: pick(SEED_HOSPITALS),
        procedure_name: proc.name,
        procedure_code: proc.code,
        procedure_category: proc.category,
        doctor_name: doctor.name,
        doctor_specialty: doctor.specialty,
        patient_type: patientType,
        estimated_cost_min: Math.round(proc.min * costVariance),
        estimated_cost_max: Math.round(proc.max * costVariance),
        complexity: proc.complexity,
        duration: proc.duration,
        status: rand() < 0.5 ? 'completed' : 'approved',
        procedures: storedProcedures,
        ...(prestaciones && { prestaciones, prestaciones_total: prestacionesTotal }),
      })
    }
  }

  // Shuffle deterministically then assign exactly 5 rejected and 8 pending
  for (let i = records.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [records[i], records[j]] = [records[j], records[i]]
  }
  const TARGET_REJECTED = 5
  const TARGET_PENDING = 8
  let assigned = 0
  for (let i = 0; i < records.length && assigned < TARGET_REJECTED; i++) {
    records[i].status = 'rejected'
    assigned++
  }
  assigned = 0
  for (let i = TARGET_REJECTED; i < records.length && assigned < TARGET_PENDING; i++) {
    records[i].status = 'pending'
    assigned++
  }

  // Sort newest first
  records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  return records
}

export class QuotationService {
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
    status?: QuotationRecord['status']
    notes?: string
    procedures?: StoredProcedure[]
    prestaciones?: StoredPrestaciones
    prestaciones_total?: number
  }): Promise<QuotationRecord | null> {
    const record: QuotationRecord = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...quotationData,
      status: quotationData.status || 'pending',
    }
    const all = getAll()
    all.unshift(record)
    saveAll(all)
    return record
  }

  static async getQuotations(
    limit: number = 10,
    offset: number = 0
  ): Promise<{ quotations: QuotationRecord[]; count: number }> {
    const all = getAll()
    return {
      quotations: all.slice(offset, offset + limit),
      count: all.length,
    }
  }

  static async getQuotationById(id: string): Promise<QuotationRecord | null> {
    return getAll().find(q => q.id === id) ?? null
  }

  static async updateQuotationStatus(
    id: string,
    status: QuotationRecord['status'],
    notes?: string
  ): Promise<QuotationRecord | null> {
    const all = getAll()
    const idx = all.findIndex(q => q.id === id)
    if (idx === -1) return null
    all[idx] = { ...all[idx], status, ...(notes !== undefined && { notes }) }
    saveAll(all)
    return all[idx]
  }

  static async deleteQuotation(id: string): Promise<boolean> {
    const all = getAll()
    const idx = all.findIndex(q => q.id === id)
    if (idx === -1) return false
    all.splice(idx, 1)
    saveAll(all)
    return true
  }

  static async getQuotationStats(): Promise<{
    total: number
    pending: number
    approved: number
    rejected: number
    completed: number
    draft: number
    totalValue: number
    avgValue: number
  }> {
    const all = getAll()
    const stats = {
      total: all.length,
      pending: all.filter(q => q.status === 'pending').length,
      approved: all.filter(q => q.status === 'approved').length,
      rejected: all.filter(q => q.status === 'rejected').length,
      completed: all.filter(q => q.status === 'completed').length,
      draft: all.filter(q => q.status === 'draft').length,
      totalValue: all.reduce(
        (sum, q) => sum + (q.estimated_cost_min + q.estimated_cost_max) / 2,
        0
      ),
      avgValue: 0,
    }
    stats.avgValue = stats.total > 0 ? stats.totalValue / stats.total : 0
    return stats
  }
}
