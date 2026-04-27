import { useState } from 'react'
import { Pencil, RotateCcw } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ConfigService, type FinanciadorView } from '@/services/configService'
import { DESCUENTOS_COBERTURA } from '@/data/coberturas'

const UNIDAD_LABELS: Record<string, string> = {
  ATM: 'Anestesiología',
  CIR: 'Cirugía',
  APB: 'A. por bloque',
  APR: 'A. profesional',
  ADM: 'Admisión',
  INS: 'Insumos',
  LAB: 'Laboratorio',
  DXO: 'Diagnóstico',
}

function EditDiscountsDialog({
  financiador,
  onSave,
  onClose,
}: {
  financiador: FinanciadorView
  onSave: (discounts: Record<string, number>) => void
  onClose: () => void
}) {
  const [discounts, setDiscounts] = useState<Record<string, number>>({ ...financiador.discounts })

  const setDiscount = (key: string, val: string) => {
    setDiscounts(prev => ({ ...prev, [key]: Math.min(100, Math.max(0, Number(val))) }))
  }

  const keys = Object.keys(DESCUENTOS_COBERTURA[financiador.key] ?? {})
  const hasKeys = keys.length > 0

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base">{financiador.label}</DialogTitle>
          <p className="text-xs text-muted-foreground">Descuentos por tipo de prestación (%)</p>
        </DialogHeader>
        {hasKeys ? (
          <div className="grid grid-cols-2 gap-3 py-2">
            {keys.map(key => (
              <div key={key} className="space-y-1.5">
                <Label className="text-xs">{UNIDAD_LABELS[key] ?? key}</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={discounts[key] ?? 0}
                    onChange={e => setDiscount(key, e.target.value)}
                    className="h-8 text-sm pr-6"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-sm text-muted-foreground text-center">
            Sin descuentos configurados (tarifa particular)
          </p>
        )}
        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button size="sm" onClick={() => onSave(discounts)} disabled={!hasKeys}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function FinanciadoresTab() {
  const [financiadores, setFinanciadores] = useState(() => ConfigService.getFinanciadores())
  const [editing, setEditing] = useState<FinanciadorView | null>(null)

  const refresh = () => setFinanciadores(ConfigService.getFinanciadores())

  const toggleActive = (key: string, active: boolean) => {
    ConfigService.setFinanciadorOverride(key, { active })
    refresh()
  }

  const isOverridden = (key: string) => {
    const orig = DESCUENTOS_COBERTURA[key]
    const cur = financiadores.find(f => f.key === key)
    if (!cur) return false
    if (!cur.active) return true
    if (!orig) return false
    return Object.keys(orig).some(k => orig[k] !== cur.discounts[k])
  }

  const resetOverride = (key: string) => {
    const o = ConfigService.getOverrides()
    delete o.financiadores[key]
    ConfigService.saveOverrides(o)
    refresh()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {financiadores.filter(f => f.active).length} de {financiadores.length} financiadores activos
      </p>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-50/60 border-b border-border">
              <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground">Financiador</th>
              <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground hidden sm:table-cell">Descuentos principales</th>
              <th className="px-4 py-2.5 font-medium text-xs text-muted-foreground text-center">Activo</th>
              <th className="px-4 py-2.5 font-medium text-xs text-muted-foreground text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {financiadores.map((f, i) => {
              const discountEntries = Object.entries(f.discounts).filter(([, v]) => v > 0)
              return (
                <tr
                  key={f.key}
                  className={[
                    'border-b border-border/40',
                    !f.active ? 'opacity-40' : '',
                    i % 2 === 1 ? 'bg-slate-50/30' : '',
                  ].join(' ')}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{f.label}</span>
                      {isOverridden(f.key) && (
                        <span className="text-[9px] text-amber-500 font-bold">●</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {discountEntries.length === 0 ? (
                        <span className="text-xs text-muted-foreground">Sin descuento</span>
                      ) : (
                        discountEntries.slice(0, 4).map(([k, v]) => (
                          <Badge key={k} variant="outline" className="text-[10px] px-1.5 py-0">
                            {UNIDAD_LABELS[k] ?? k}: {v}%
                          </Badge>
                        ))
                      )}
                      {discountEntries.length > 4 && (
                        <span className="text-xs text-muted-foreground">+{discountEntries.length - 4} más</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Switch
                      checked={f.active}
                      onCheckedChange={v => toggleActive(f.key, v)}
                      className="scale-90"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isOverridden(f.key) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          title="Restaurar"
                          onClick={() => resetOverride(f.key)}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setEditing(f)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditDiscountsDialog
          financiador={editing}
          onSave={discounts => {
            ConfigService.setFinanciadorOverride(editing.key, { discounts })
            refresh()
            setEditing(null)
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
