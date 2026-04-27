import { useState } from 'react'
import { AlertTriangle, Ban, CheckCircle2, RotateCcw } from 'lucide-react'
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
  ConfigService,
  DEFAULT_BUSINESS_RULES,
  RULE_ACTION_LABELS,
  type BusinessRule,
  type RuleAction,
} from '@/services/configService'

const ACTION_STYLES: Record<RuleAction, { icon: React.ReactNode; badge: string }> = {
  require_approval: {
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />,
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  flag: {
    icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  block: {
    icon: <Ban className="w-3.5 h-3.5 text-red-500" />,
    badge: 'bg-red-50 text-red-700 border-red-200',
  },
}

function RuleCard({
  rule,
  onChange,
  onReset,
}: {
  rule: BusinessRule
  onChange: (patch: Partial<BusinessRule>) => void
  onReset: () => void
}) {
  const defaultRule = DEFAULT_BUSINESS_RULES.find(r => r.id === rule.id)
  const isModified =
    rule.enabled !== defaultRule?.enabled ||
    rule.threshold !== defaultRule?.threshold ||
    rule.action !== defaultRule?.action

  const actionStyle = ACTION_STYLES[rule.action]

  const procedures = ConfigService.getProcedures().filter(p => p.active)

  return (
    <div className={[
      'rounded-xl border p-4 space-y-3 transition-opacity',
      rule.enabled ? 'border-border bg-white' : 'border-border/50 bg-slate-50/30 opacity-60',
    ].join(' ')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-sm">{rule.label}</span>
            {isModified && (
              <span className="text-[9px] text-amber-500 font-bold">●</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{rule.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isModified && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground"
              title="Restaurar"
              onClick={onReset}
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
          <Switch
            checked={rule.enabled}
            onCheckedChange={v => onChange({ enabled: v })}
          />
        </div>
      </div>

      {rule.enabled && (
        <div className="space-y-3 pt-1 border-t border-border/40">
          {/* Threshold input */}
          {rule.conditionType !== 'procedure_is' && (
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">
                  {rule.conditionType === 'amount_exceeds' && 'Monto límite ($)'}
                  {rule.conditionType === 'discount_exceeds' && 'Descuento máximo (%)'}
                  {rule.conditionType === 'episodio_deviation_exceeds' && 'Desvío máximo (%)'}
                </Label>
                <Input
                  type="number"
                  value={rule.threshold ?? 0}
                  onChange={e => onChange({ threshold: Number(e.target.value) })}
                  className="h-8 text-sm"
                  min={0}
                  step={rule.conditionType === 'amount_exceeds' ? 1000 : 1}
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Acción</Label>
                <Select value={rule.action} onValueChange={v => onChange({ action: v as RuleAction })}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(RULE_ACTION_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k} className="text-sm">{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Procedure selector */}
          {rule.conditionType === 'procedure_is' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Procedimientos que requieren aprobación</Label>
                <Select value={rule.action} onValueChange={v => onChange({ action: v as RuleAction })}>
                  <SelectTrigger className="h-7 text-xs w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(RULE_ACTION_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k} className="text-sm">{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {(rule.procedureCodes ?? []).map(code => {
                  const proc = procedures.find(p => p.code === code)
                  return (
                    <Badge
                      key={code}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-red-50 hover:text-red-600"
                      onClick={() =>
                        onChange({ procedureCodes: rule.procedureCodes?.filter(c => c !== code) ?? [] })
                      }
                    >
                      {proc?.title ?? code} ×
                    </Badge>
                  )
                })}
              </div>
              <Select
                value=""
                onValueChange={code => {
                  if (!rule.procedureCodes?.includes(code)) {
                    onChange({ procedureCodes: [...(rule.procedureCodes ?? []), code] })
                  }
                }}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Agregar procedimiento..." />
                </SelectTrigger>
                <SelectContent>
                  {procedures
                    .filter(p => !rule.procedureCodes?.includes(p.code))
                    .map(p => (
                      <SelectItem key={p.code} value={p.code} className="text-sm">
                        {p.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Action badge summary */}
          <div className="flex items-center gap-1.5 pt-1">
            {actionStyle.icon}
            <Badge variant="outline" className={`text-[10px] ${actionStyle.badge}`}>
              {RULE_ACTION_LABELS[rule.action]}
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ReglasTab() {
  const [rules, setRules] = useState(() => ConfigService.getBusinessRules())

  const refresh = () => setRules(ConfigService.getBusinessRules())

  const handleChange = (id: string, patch: Partial<BusinessRule>) => {
    ConfigService.setBusinessRule(id, patch)
    refresh()
  }

  const handleReset = (id: string) => {
    ConfigService.resetBusinessRule(id)
    refresh()
  }

  const activeCount = rules.filter(r => r.enabled).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Las reglas activas se evalúan al momento de generar una cotización.
        </p>
        {activeCount > 0 && (
          <Badge className="text-xs bg-primary-500">
            {activeCount} activa{activeCount !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map(rule => (
          <RuleCard
            key={rule.id}
            rule={rule}
            onChange={patch => handleChange(rule.id, patch)}
            onReset={() => handleReset(rule.id)}
          />
        ))}
      </div>

      <div className="rounded-lg bg-amber-50/60 border border-amber-100 px-4 py-3">
        <p className="text-xs text-amber-700 font-medium">Próximamente</p>
        <p className="text-xs text-amber-600 mt-0.5">
          Las reglas de negocio se integrarán al flujo de cotización para mostrar alertas en tiempo real
          y enviar solicitudes de aprobación a los usuarios con permiso correspondiente.
        </p>
      </div>
    </div>
  )
}
