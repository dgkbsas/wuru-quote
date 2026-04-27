import { useState } from 'react'
import { Pencil, RotateCcw } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  ConfigService,
  type CriterioView,
  type RequirementView,
} from '@/services/configService'
import { type PricingRule, type PricingMode } from '@/data/patientConditions'
import { CLINICAL_CRITERIA, REQUIREMENTS } from '@/data/patientConditions'

const MODE_LABELS: Record<PricingMode, string> = {
  fixed: 'Monto fijo ($)',
  percent: 'Porcentaje del costo base (%)',
  per_hour: 'Por hora ($)',
  per_unit: 'Por unidad ($)',
}

function PricingBadge({ pricing }: { pricing?: PricingRule | PricingRule[] }) {
  if (!pricing) return <span className="text-xs text-muted-foreground">Sin impacto</span>
  const rules = Array.isArray(pricing) ? pricing : [pricing]
  return (
    <div className="flex flex-wrap gap-1">
      {rules.map((r, i) => (
        <Badge key={i} variant="outline" className="text-[10px] px-1.5 border-emerald-200 text-emerald-700">
          {r.mode === 'fixed' && `$${r.rate}`}
          {r.mode === 'percent' && `${(r.rate * 100).toFixed(0)}%`}
          {r.mode === 'per_hour' && `$${r.rate}/h`}
          {r.mode === 'per_unit' && `$${r.rate}/${r.label ?? 'u'}`}
        </Badge>
      ))}
    </div>
  )
}

function EditPricingDialog({
  label,
  current,
  onSave,
  onClose,
  allowMultiple,
}: {
  label: string
  current?: PricingRule | PricingRule[]
  onSave: (pricing: PricingRule | undefined) => void
  onClose: () => void
  allowMultiple?: boolean
}) {
  const initial: PricingRule = Array.isArray(current)
    ? current[0]
    : current ?? { mode: 'fixed', rate: 0 }

  const [mode, setMode] = useState<PricingMode>(initial.mode)
  const [rate, setRate] = useState(String(initial.rate))
  const [unitLabel, setUnitLabel] = useState(initial.label ?? '')
  const [hasPricing, setHasPricing] = useState(!!current)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">{label}</DialogTitle>
          <p className="text-xs text-muted-foreground">Configurar impacto en el costo</p>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2">
            <Switch checked={hasPricing} onCheckedChange={setHasPricing} />
            <span className="text-sm">{hasPricing ? 'Con impacto en costo' : 'Sin impacto en costo'}</span>
          </div>
          {hasPricing && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Modo de precio</Label>
                <Select value={mode} onValueChange={v => setMode(v as PricingMode)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MODE_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k} className="text-sm">{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">
                  {mode === 'percent' ? 'Fracción (ej. 0.15 = 15%)' : 'Tarifa'}
                </Label>
                <Input
                  type="number"
                  value={rate}
                  onChange={e => setRate(e.target.value)}
                  className="h-8 text-sm"
                  step={mode === 'percent' ? 0.01 : 1}
                />
              </div>
              {mode === 'per_unit' && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Etiqueta de unidad</Label>
                  <Input
                    value={unitLabel}
                    onChange={e => setUnitLabel(e.target.value)}
                    placeholder="ej. unidad, bolsa"
                    className="h-8 text-sm"
                  />
                </div>
              )}
            </>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button
            size="sm"
            onClick={() =>
              onSave(
                hasPricing
                  ? { mode, rate: Number(rate), ...(unitLabel ? { label: unitLabel } : {}) }
                  : undefined
              )
            }
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type Editing =
  | { type: 'criterio'; item: CriterioView }
  | { type: 'requirement'; item: RequirementView }

export default function CriteriosTab() {
  const [criterios, setCriterios] = useState(() => ConfigService.getCriterios())
  const [requirements, setRequirements] = useState(() => ConfigService.getRequirements())
  const [editing, setEditing] = useState<Editing | null>(null)

  const refresh = () => {
    setCriterios(ConfigService.getCriterios())
    setRequirements(ConfigService.getRequirements())
  }

  const isCriterioOverridden = (key: string) => {
    const orig = CLINICAL_CRITERIA.find(c => c.key === key)
    const cur = criterios.find(c => c.key === key)
    if (!orig || !cur) return false
    return !cur.active || JSON.stringify(orig.pricing) !== JSON.stringify(cur.pricing)
  }

  const isReqOverridden = (key: string) => {
    const orig = REQUIREMENTS.find(r => r.key === key)
    const cur = requirements.find(r => r.key === key)
    if (!orig || !cur) return false
    return !cur.active || JSON.stringify(orig.pricing) !== JSON.stringify(cur.pricing)
  }

  return (
    <div className="space-y-6">
      {/* ── Criterios clínicos ─────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Criterios clínicos</h3>
          <Badge variant="outline" className="text-xs">
            {criterios.filter(c => c.active).length} activos
          </Badge>
        </div>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50/60 border-b border-border">
                <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground">Criterio</th>
                <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground hidden sm:table-cell">Impacto en costo</th>
                <th className="px-4 py-2.5 font-medium text-xs text-muted-foreground text-center">Activo</th>
                <th className="px-4 py-2.5 font-medium text-xs text-muted-foreground text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {criterios.map((c, i) => (
                <tr
                  key={c.key}
                  className={[
                    'border-b border-border/40',
                    !c.active ? 'opacity-40' : '',
                    i % 2 === 1 ? 'bg-slate-50/30' : '',
                  ].join(' ')}
                >
                  <td className="px-4 py-2.5 font-medium">
                    {c.label}
                    {isCriterioOverridden(c.key) && (
                      <span className="ml-1.5 text-[9px] text-amber-500 font-bold">●</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 hidden sm:table-cell">
                    <PricingBadge pricing={c.pricing} />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <Switch
                      checked={c.active}
                      onCheckedChange={v => {
                        ConfigService.setCriterioOverride(c.key, { active: v })
                        refresh()
                      }}
                      className="scale-90"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isCriterioOverridden(c.key) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground"
                          onClick={() => {
                            const o = ConfigService.getOverrides()
                            delete o.criterios[c.key]
                            ConfigService.saveOverrides(o)
                            refresh()
                          }}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setEditing({ type: 'criterio', item: c })}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Requerimientos ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Requerimientos</h3>
          <Badge variant="outline" className="text-xs">
            {requirements.filter(r => r.active).length} activos
          </Badge>
        </div>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50/60 border-b border-border">
                <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground">Requerimiento</th>
                <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground hidden sm:table-cell">Tarifa</th>
                <th className="px-4 py-2.5 font-medium text-xs text-muted-foreground text-center">Activo</th>
                <th className="px-4 py-2.5 font-medium text-xs text-muted-foreground text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((r, i) => (
                <tr
                  key={r.key}
                  className={[
                    'border-b border-border/40',
                    !r.active ? 'opacity-40' : '',
                    i % 2 === 1 ? 'bg-slate-50/30' : '',
                  ].join(' ')}
                >
                  <td className="px-4 py-2.5 font-medium">
                    {r.label}
                    {isReqOverridden(r.key) && (
                      <span className="ml-1.5 text-[9px] text-amber-500 font-bold">●</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 hidden sm:table-cell">
                    <PricingBadge pricing={r.pricing} />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <Switch
                      checked={r.active}
                      onCheckedChange={v => {
                        ConfigService.setRequirementOverride(r.key, { active: v })
                        refresh()
                      }}
                      className="scale-90"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isReqOverridden(r.key) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground"
                          onClick={() => {
                            const o = ConfigService.getOverrides()
                            delete o.requirements[r.key]
                            ConfigService.saveOverrides(o)
                            refresh()
                          }}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setEditing({ type: 'requirement', item: r })}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing?.type === 'criterio' && (
        <EditPricingDialog
          label={editing.item.label}
          current={editing.item.pricing}
          allowMultiple
          onSave={pricing => {
            ConfigService.setCriterioOverride(editing.item.key, {
              pricing: pricing ?? undefined,
            })
            refresh()
            setEditing(null)
          }}
          onClose={() => setEditing(null)}
        />
      )}

      {editing?.type === 'requirement' && (
        <EditPricingDialog
          label={editing.item.label}
          current={editing.item.pricing}
          onSave={pricing => {
            if (pricing) {
              ConfigService.setRequirementOverride(editing.item.key, { pricing })
            }
            refresh()
            setEditing(null)
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
