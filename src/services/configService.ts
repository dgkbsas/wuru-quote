import { PROCEDURES_DATABASE, type ProcedureData } from '@/data/procedures'
import { SURGEONS_DATABASE, type SurgeonData } from '@/data/surgeons'
import { DESCUENTOS_COBERTURA, FINANCIADOR_LABELS } from '@/data/coberturas'
import {
  CLINICAL_CRITERIA,
  REQUIREMENTS,
  type ClinicalCriterion,
  type Requirement,
  type PricingRule,
} from '@/data/patientConditions'
import { EPISODIOS_DB } from '@/data/episodios'

// ── Storage ──────────────────────────────────────────────────────────────────

function getClientId(): string {
  return localStorage.getItem('wuru_active_client') ?? 'default'
}

function storageKey(): string {
  return `wuru_config_v1_${getClientId()}`
}

// ── Override types ────────────────────────────────────────────────────────────

export interface ProcedureOverride {
  active?: boolean
  estimatedCost?: { min: number; max: number }
  estimatedDuration?: string
}

export interface SurgeonOverride {
  active?: boolean
  name?: string
  specialty?: string
  hospital?: string
  city?: string
  experience?: string
  procedureCategories?: string[]
  certifications?: string[]
  isCustom?: true
}

export interface FinanciadorOverride {
  active?: boolean
  discounts?: Record<string, number>
}

export interface CriterioOverride {
  active?: boolean
  pricing?: PricingRule | PricingRule[]
}

export interface RequirementOverride {
  active?: boolean
  pricing?: PricingRule
}

export interface ClientUser {
  id: string
  email: string
  name: string
  roleId: string
  createdAt: string
}

// ── Roles y permisos ─────────────────────────────────────────────────────────

export type Permission =
  | 'create_quotation'
  | 'approve_quotation'
  | 'reject_quotation'
  | 'export_quotation'
  | 'view_analytics'
  | 'edit_config'

export const PERMISSION_LABELS: Record<Permission, string> = {
  create_quotation: 'Crear cotización',
  approve_quotation: 'Aprobar cotización',
  reject_quotation: 'Rechazar cotización',
  export_quotation: 'Exportar cotización',
  view_analytics: 'Ver analítica',
  edit_config: 'Editar configuración',
}

export interface RoleConfig {
  id: string
  label: string
  permissions: Permission[]
}

export const DEFAULT_ROLES: RoleConfig[] = [
  {
    id: 'admin',
    label: 'Administrador',
    permissions: ['create_quotation', 'approve_quotation', 'reject_quotation', 'export_quotation', 'view_analytics', 'edit_config'],
  },
  {
    id: 'manager',
    label: 'Gerente',
    permissions: ['create_quotation', 'approve_quotation', 'reject_quotation', 'export_quotation', 'view_analytics'],
  },
  {
    id: 'operator',
    label: 'Operador',
    permissions: ['create_quotation', 'export_quotation'],
  },
]

export interface RoleOverride {
  label?: string
  permissions?: Permission[]
}

// ── Reglas de negocio ─────────────────────────────────────────────────────────

export type RuleAction = 'require_approval' | 'flag' | 'block'

export const RULE_ACTION_LABELS: Record<RuleAction, string> = {
  require_approval: 'Requiere aprobación',
  flag: 'Marcar para revisión',
  block: 'Bloquear',
}

export type RuleConditionType =
  | 'amount_exceeds'
  | 'discount_exceeds'
  | 'procedure_is'
  | 'episodio_deviation_exceeds'

export interface BusinessRule {
  id: string
  label: string
  description: string
  conditionType: RuleConditionType
  threshold?: number
  procedureCodes?: string[]
  action: RuleAction
  enabled: boolean
}

export const DEFAULT_BUSINESS_RULES: BusinessRule[] = [
  {
    id: 'amount_threshold',
    label: 'Monto elevado',
    description: 'Cotizaciones que superen un monto total',
    conditionType: 'amount_exceeds',
    threshold: 50000,
    action: 'require_approval',
    enabled: false,
  },
  {
    id: 'discount_threshold',
    label: 'Descuento elevado',
    description: 'Cotizaciones con descuento mayor a un porcentaje',
    conditionType: 'discount_exceeds',
    threshold: 30,
    action: 'require_approval',
    enabled: false,
  },
  {
    id: 'episodio_deviation',
    label: 'Desvío vs. episodio previo',
    description: 'Cotización muy diferente al histórico de episodios',
    conditionType: 'episodio_deviation_exceeds',
    threshold: 20,
    action: 'flag',
    enabled: false,
  },
  {
    id: 'procedure_approval',
    label: 'Procedimientos especiales',
    description: 'Ciertos procedimientos siempre requieren aprobación',
    conditionType: 'procedure_is',
    procedureCodes: [],
    action: 'require_approval',
    enabled: false,
  },
]

// ── ConfigOverrides ───────────────────────────────────────────────────────────

interface ConfigOverrides {
  procedures: Record<string, ProcedureOverride>
  surgeons: Record<string, SurgeonOverride>
  financiadores: Record<string, FinanciadorOverride>
  criterios: Record<string, CriterioOverride>
  requirements: Record<string, RequirementOverride>
  users: ClientUser[]
  roleOverrides: Record<string, RoleOverride>
  businessRules: Record<string, Partial<BusinessRule>>
}

const EMPTY_OVERRIDES: ConfigOverrides = {
  procedures: {},
  surgeons: {},
  financiadores: {},
  criterios: {},
  requirements: {},
  users: [],
  roleOverrides: {},
  businessRules: {},
}

// ── Merged view types ─────────────────────────────────────────────────────────

export type ProcedureView = ProcedureData & { active: boolean }

export type SurgeonView = SurgeonData & { active: boolean; isCustom?: true }

export interface FinanciadorView {
  key: string
  label: string
  active: boolean
  discounts: Record<string, number>
}

export type CriterioView = ClinicalCriterion & { active: boolean }

export type RequirementView = Requirement & { active: boolean }

export interface EpisodioSummary {
  procedureName: string
  totalEpisodios: number
  prestacionesComunes: number
  prestacionesDiferenciales: number
  keywords: string[]
}

// ── Service ───────────────────────────────────────────────────────────────────

export class ConfigService {
  // ── Internal ────────────────────────────────────────────────────────────────

  static getOverrides(): ConfigOverrides {
    try {
      const raw = localStorage.getItem(storageKey())
      if (!raw) return { ...EMPTY_OVERRIDES }
      const parsed = JSON.parse(raw) as Partial<ConfigOverrides>
      return {
        procedures: parsed.procedures ?? {},
        surgeons: parsed.surgeons ?? {},
        financiadores: parsed.financiadores ?? {},
        criterios: parsed.criterios ?? {},
        requirements: parsed.requirements ?? {},
        users: parsed.users ?? [],
        roleOverrides: parsed.roleOverrides ?? {},
        businessRules: parsed.businessRules ?? {},
      }
    } catch {
      return { ...EMPTY_OVERRIDES }
    }
  }

  static saveOverrides(o: ConfigOverrides): void {
    localStorage.setItem(storageKey(), JSON.stringify(o))
  }

  // ── Procedures ───────────────────────────────────────────────────────────────

  static getProcedures(): ProcedureView[] {
    const { procedures } = this.getOverrides()
    return PROCEDURES_DATABASE.map(p => ({
      ...p,
      ...(procedures[p.code] ?? {}),
      active: procedures[p.code]?.active ?? true,
    }))
  }

  static setProcedureOverride(code: string, patch: ProcedureOverride): void {
    const o = this.getOverrides()
    o.procedures[code] = { ...(o.procedures[code] ?? {}), ...patch }
    this.saveOverrides(o)
  }

  // ── Surgeons ─────────────────────────────────────────────────────────────────

  static getSurgeons(clientHospitals: string[] = []): SurgeonView[] {
    const { surgeons } = this.getOverrides()

    const isInClient = (hospital: string) =>
      clientHospitals.length === 0 ||
      clientHospitals.some(h => h.includes(hospital) || hospital.includes(h))

    const base: SurgeonView[] = SURGEONS_DATABASE
      .filter(s => isInClient(s.hospital))
      .map(s => ({
        ...s,
        ...(surgeons[s.id] ?? {}),
        active: surgeons[s.id]?.active ?? true,
      }))

    const custom: SurgeonView[] = Object.entries(surgeons)
      .filter(([, v]) => v.isCustom)
      .map(([id, v]) => ({
        id,
        name: v.name ?? '',
        specialty: v.specialty ?? '',
        hospital: v.hospital ?? '',
        city: v.city ?? '',
        experience: v.experience ?? '',
        procedureCategories: v.procedureCategories ?? [],
        certifications: v.certifications ?? [],
        active: v.active ?? true,
        isCustom: true as const,
      }))

    return [...base, ...custom]
  }

  static setSurgeonOverride(id: string, patch: SurgeonOverride): void {
    const o = this.getOverrides()
    o.surgeons[id] = { ...(o.surgeons[id] ?? {}), ...patch }
    this.saveOverrides(o)
  }

  static addSurgeon(data: Omit<SurgeonView, 'id' | 'active' | 'isCustom'>): SurgeonView {
    const id = crypto.randomUUID()
    const o = this.getOverrides()
    o.surgeons[id] = { ...data, isCustom: true, active: true }
    this.saveOverrides(o)
    return { ...data, id, active: true, isCustom: true }
  }

  static deleteSurgeon(id: string): void {
    const o = this.getOverrides()
    delete o.surgeons[id]
    this.saveOverrides(o)
  }

  // ── Financiadores ─────────────────────────────────────────────────────────────

  static getFinanciadores(): FinanciadorView[] {
    const { financiadores } = this.getOverrides()
    return Object.entries(FINANCIADOR_LABELS).map(([key, label]) => ({
      key,
      label,
      active: financiadores[key]?.active ?? true,
      discounts: {
        ...(DESCUENTOS_COBERTURA[key] ?? {}),
        ...(financiadores[key]?.discounts ?? {}),
      },
    }))
  }

  static setFinanciadorOverride(key: string, patch: FinanciadorOverride): void {
    const o = this.getOverrides()
    o.financiadores[key] = { ...(o.financiadores[key] ?? {}), ...patch }
    this.saveOverrides(o)
  }

  // ── Criterios clínicos ────────────────────────────────────────────────────────

  static getCriterios(): CriterioView[] {
    const { criterios } = this.getOverrides()
    return CLINICAL_CRITERIA.map(c => ({
      ...c,
      ...(criterios[c.key]?.pricing !== undefined ? { pricing: criterios[c.key].pricing } : {}),
      active: criterios[c.key]?.active ?? true,
    }))
  }

  static setCriterioOverride(key: string, patch: CriterioOverride): void {
    const o = this.getOverrides()
    o.criterios[key] = { ...(o.criterios[key] ?? {}), ...patch }
    this.saveOverrides(o)
  }

  // ── Requirements ─────────────────────────────────────────────────────────────

  static getRequirements(): RequirementView[] {
    const { requirements } = this.getOverrides()
    return REQUIREMENTS.map(r => ({
      ...r,
      ...(requirements[r.key]?.pricing !== undefined ? { pricing: requirements[r.key].pricing as PricingRule } : {}),
      active: requirements[r.key]?.active ?? true,
    }))
  }

  static setRequirementOverride(key: string, patch: RequirementOverride): void {
    const o = this.getOverrides()
    o.requirements[key] = { ...(o.requirements[key] ?? {}), ...patch }
    this.saveOverrides(o)
  }

  // ── Episodios (read-only) ─────────────────────────────────────────────────────

  static getEpisodiosSummary(): EpisodioSummary[] {
    return EPISODIOS_DB.map(ep => ({
      procedureName: ep.procedureName,
      totalEpisodios: ep.totalEpisodios,
      prestacionesComunes: ep.prestacionesComunes.length,
      prestacionesDiferenciales: ep.prestacionesDiferenciales.length,
      keywords: ep.keywords,
    }))
  }

  // ── Users ─────────────────────────────────────────────────────────────────────

  static getUsers(): ClientUser[] {
    return this.getOverrides().users
  }

  static addUser(data: { email: string; name: string; roleId: string }): ClientUser {
    const o = this.getOverrides()
    const user: ClientUser = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    }
    o.users.push(user)
    this.saveOverrides(o)
    return user
  }

  static updateUserRole(id: string, roleId: string): void {
    const o = this.getOverrides()
    const user = o.users.find(u => u.id === id)
    if (user) user.roleId = roleId
    this.saveOverrides(o)
  }

  static deleteUser(id: string): void {
    const o = this.getOverrides()
    o.users = o.users.filter(u => u.id !== id)
    this.saveOverrides(o)
  }

  // ── Roles ─────────────────────────────────────────────────────────────────────

  static getRoles(): RoleConfig[] {
    const { roleOverrides } = this.getOverrides()
    return DEFAULT_ROLES.map(r => ({
      ...r,
      ...(roleOverrides[r.id] ?? {}),
    }))
  }

  static setRoleOverride(id: string, patch: RoleOverride): void {
    const o = this.getOverrides()
    o.roleOverrides[id] = { ...(o.roleOverrides[id] ?? {}), ...patch }
    this.saveOverrides(o)
  }

  static resetRole(id: string): void {
    const o = this.getOverrides()
    delete o.roleOverrides[id]
    this.saveOverrides(o)
  }

  // ── Business Rules ────────────────────────────────────────────────────────────

  static getBusinessRules(): BusinessRule[] {
    const { businessRules } = this.getOverrides()
    return DEFAULT_BUSINESS_RULES.map(r => ({
      ...r,
      ...(businessRules[r.id] ?? {}),
    }))
  }

  static setBusinessRule(id: string, patch: Partial<BusinessRule>): void {
    const o = this.getOverrides()
    o.businessRules[id] = { ...(o.businessRules[id] ?? {}), ...patch }
    this.saveOverrides(o)
  }

  static resetBusinessRule(id: string): void {
    const o = this.getOverrides()
    delete o.businessRules[id]
    this.saveOverrides(o)
  }
}
