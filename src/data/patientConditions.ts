// ── Modos de precio ──────────────────────────────────────────────────────────

export type PricingMode = 'fixed' | 'percent' | 'per_hour' | 'per_unit';

export interface PricingRule {
  mode: PricingMode;
  rate: number; // monto fijo | fracción (0.15) | tarifa/hora | tarifa/unidad
  label?: string; // descripción opcional, ej. "por día"
}

// Cuando hay múltiples reglas se toma la de mayor impacto
export type Pricing = PricingRule | PricingRule[];

// ── Interfaces de datos ──────────────────────────────────────────────────────

export interface ClinicalCriterion {
  key: string;
  label: string;
  pricing?: Pricing;
}

export interface PostopType {
  key: string;
  label: string;
  costPerUnit: number;
  unit: 'días' | 'horas';
}

export interface Requirement {
  key: string;
  label: string;
  pricing: PricingRule; // cada requerimiento tiene exactamente un modo
}

// ── Datos de configuración ───────────────────────────────────────────────────

export const CLINICAL_CRITERIA: ClinicalCriterion[] = [
  { key: 'internado', label: 'Internado' },
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'marcapasos', label: 'Marcapasos' },
  { key: 'inmunosuprimido', label: 'Inmunosuprimido', pricing: { mode: 'fixed', rate: 350 } },
  { key: 'anticoagulado', label: 'Anticoagulado', pricing: { mode: 'fixed', rate: 350 } },
  { key: 'hipertermia_maligna', label: 'Hipertermia maligna', pricing: { mode: 'fixed', rate: 450 } },
  { key: 'aislamiento', label: 'Aislamiento' },
  { key: 'bioseguridad_medica', label: 'Bioseguridad médica' },
  { key: 'obesidad_morbida', label: 'Obesidad mórbida', pricing: { mode: 'fixed', rate: 400 } },
  { key: 'alergia_latex', label: 'Alergia al látex' },
  { key: 'hipertension', label: 'Hipertensión' },
  { key: 'otras_alergias', label: 'Otras alergias' },
  {
    key: 'pediatrico',
    label: 'Pediátrico',
    pricing: [
      { mode: 'fixed', rate: 500 },
      { mode: 'percent', rate: 0.15 },
    ],
  },
  {
    key: 'adulto_mayor',
    label: 'Adulto mayor',
    pricing: [
      { mode: 'fixed', rate: 300 },
      { mode: 'percent', rate: 0.10 },
    ],
  },
];

export const POSTOP_TYPES: PostopType[] = [
  { key: 'ambulatorio', label: 'Ambulatorio', costPerUnit: 0, unit: 'horas' },
  { key: 'internacion', label: 'Internación', costPerUnit: 800, unit: 'días' },
  { key: 'uco', label: 'UCO', costPerUnit: 1500, unit: 'días' },
  { key: 'uti', label: 'UTI', costPerUnit: 2500, unit: 'días' },
];

export const REQUIREMENTS: Requirement[] = [
  { key: 'anatomo_patologo', label: 'Presencia de Anatomo Patólogo', pricing: { mode: 'per_hour', rate: 300 } },
  { key: 'tecnico_rayos', label: 'Técnico de rayos', pricing: { mode: 'per_hour', rate: 150 } },
  { key: 'placas_radiograficas', label: 'Placas radiográficas', pricing: { mode: 'fixed', rate: 400 } },
  { key: 'monitoreo_electrofisiologico', label: 'Monitoreo electrofisiológico', pricing: { mode: 'per_hour', rate: 200 } },
  { key: 'consulta_infectologica', label: 'Consulta infectológica', pricing: { mode: 'fixed', rate: 500 } },
  { key: 'hemoterapia', label: 'Hemoterapia', pricing: { mode: 'per_unit', rate: 250, label: 'unidad' } },
];

// ── Estado del formulario ────────────────────────────────────────────────────

export interface PatientConditionsData {
  clinicalCriteria: string[];
  postopType: string;
  postopQuantity: number;
  requirements: string[];
  requirementQuantities: Record<string, number>; // para per_unit
  patientName: string;
  observations: string;
}

export const EMPTY_PATIENT_CONDITIONS: PatientConditionsData = {
  clinicalCriteria: [],
  postopType: '',
  postopQuantity: 0,
  requirements: [],
  requirementQuantities: {},
  patientName: '',
  observations: '',
};

// ── Cálculo de impacto ───────────────────────────────────────────────────────

export function evalRule(
  rule: PricingRule,
  ctx: { baseCost: number; durationHours: number; quantity: number }
): number {
  switch (rule.mode) {
    case 'fixed':   return rule.rate;
    case 'percent': return rule.rate * ctx.baseCost;
    case 'per_hour': return rule.rate * ctx.durationHours;
    case 'per_unit': return rule.rate * ctx.quantity;
  }
}

export function criterionImpact(
  criterion: ClinicalCriterion,
  ctx: { baseCost: number; durationHours: number }
): number {
  if (!criterion.pricing) return 0;
  const rules = Array.isArray(criterion.pricing) ? criterion.pricing : [criterion.pricing];
  return Math.round(Math.max(...rules.map(r => evalRule(r, { ...ctx, quantity: 1 }))));
}

export function requirementImpact(
  req: Requirement,
  ctx: { baseCost: number; durationHours: number; quantity: number }
): number {
  return Math.round(evalRule(req.pricing, ctx));
}

export function calcPatientConditionsCost(
  conditions: PatientConditionsData,
  ctx: { baseCost?: number; durationHours?: number } = {}
): number {
  const baseCost = ctx.baseCost ?? 0;
  const durationHours = ctx.durationHours ?? 1;
  let total = 0;

  const postop = POSTOP_TYPES.find(t => t.key === conditions.postopType);
  if (postop && conditions.postopQuantity > 0) {
    total += postop.costPerUnit * conditions.postopQuantity;
  }

  for (const key of conditions.clinicalCriteria) {
    const criterion = CLINICAL_CRITERIA.find(c => c.key === key);
    if (criterion) total += criterionImpact(criterion, { baseCost, durationHours });
  }

  for (const key of conditions.requirements) {
    const req = REQUIREMENTS.find(r => r.key === key);
    if (req) {
      const qty = conditions.requirementQuantities?.[key] ?? 1;
      total += requirementImpact(req, { baseCost, durationHours, quantity: qty });
    }
  }

  return Math.round(total);
}

