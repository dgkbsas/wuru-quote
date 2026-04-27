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
import { ConfigService, type ProcedureView, type ProcedureOverride } from '@/services/configService'
import { PROCEDURES_DATABASE } from '@/data/procedures'

function EditDialog({
  procedure,
  onSave,
  onClose,
}: {
  procedure: ProcedureView
  onSave: (patch: ProcedureOverride) => void
  onClose: () => void
}) {
  const [min, setMin] = useState(String(procedure.estimatedCost.min))
  const [max, setMax] = useState(String(procedure.estimatedCost.max))
  const [duration, setDuration] = useState(procedure.estimatedDuration ?? '')

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">{procedure.title}</DialogTitle>
          <p className="text-xs text-muted-foreground font-mono">{procedure.code}</p>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Costo mínimo ($)</Label>
              <Input
                type="number"
                value={min}
                onChange={e => setMin(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Costo máximo ($)</Label>
              <Input
                type="number"
                value={max}
                onChange={e => setMax(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Duración estimada</Label>
            <Input
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="ej. 2-3 horas"
              className="h-8 text-sm"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button
            size="sm"
            onClick={() => onSave({
              estimatedCost: { min: Number(min), max: Number(max) },
              estimatedDuration: duration || undefined,
            })}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ProceduresTab() {
  const [procedures, setProcedures] = useState(() => ConfigService.getProcedures())
  const [editing, setEditing] = useState<ProcedureView | null>(null)
  const [search, setSearch] = useState('')

  const refresh = () => setProcedures(ConfigService.getProcedures())

  const toggleActive = (code: string, active: boolean) => {
    ConfigService.setProcedureOverride(code, { active })
    refresh()
  }

  const isOverridden = (code: string) => {
    const orig = PROCEDURES_DATABASE.find(p => p.code === code)
    const cur = procedures.find(p => p.code === code)
    if (!orig || !cur) return false
    return (
      orig.estimatedCost.min !== cur.estimatedCost.min ||
      orig.estimatedCost.max !== cur.estimatedCost.max ||
      !cur.active
    )
  }

  const resetOverride = (code: string) => {
    const o = ConfigService.getOverrides()
    delete o.procedures[code]
    ConfigService.saveOverrides(o)
    refresh()
  }

  const filtered = procedures.filter(
    p =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.includes(search)
  )

  const activeCount = procedures.filter(p => p.active).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Input
          placeholder="Buscar procedimiento o código..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-8 text-sm max-w-xs"
        />
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="text-xs">{activeCount} activos</Badge>
          <span className="text-xs text-muted-foreground">de {procedures.length}</span>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-50/60 border-b border-border">
              <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground">Código</th>
              <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground">Procedimiento</th>
              <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground hidden sm:table-cell">Costo estimado</th>
              <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground hidden md:table-cell">Complejidad</th>
              <th className="px-4 py-2.5 font-medium text-xs text-muted-foreground text-center">Activo</th>
              <th className="px-4 py-2.5 font-medium text-xs text-muted-foreground text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((proc, i) => (
              <tr
                key={proc.code}
                className={[
                  'border-b border-border/40 transition-colors',
                  !proc.active ? 'opacity-40' : '',
                  i % 2 === 1 ? 'bg-slate-50/30' : '',
                ].join(' ')}
              >
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">
                  {proc.code}
                  {isOverridden(proc.code) && (
                    <span className="ml-1 text-[9px] text-amber-500 font-bold">●</span>
                  )}
                </td>
                <td className="px-4 py-2.5 font-medium">{proc.title}</td>
                <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                  ${proc.estimatedCost.min.toLocaleString()} – ${proc.estimatedCost.max.toLocaleString()}
                </td>
                <td className="px-4 py-2.5 hidden md:table-cell">
                  <Badge
                    variant="outline"
                    className={[
                      'text-[10px] font-medium',
                      proc.complexity === 'Alta' || proc.complexity === 'Muy Alta'
                        ? 'border-red-200 text-red-600'
                        : proc.complexity === 'Media'
                        ? 'border-amber-200 text-amber-600'
                        : 'border-green-200 text-green-600',
                    ].join(' ')}
                  >
                    {proc.complexity}
                  </Badge>
                </td>
                <td className="px-4 py-2.5 text-center">
                  <Switch
                    checked={proc.active}
                    onCheckedChange={v => toggleActive(proc.code, v)}
                    className="scale-90"
                  />
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {isOverridden(proc.code) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        title="Restaurar valores originales"
                        onClick={() => resetOverride(proc.code)}
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setEditing(proc)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No se encontraron procedimientos
          </div>
        )}
      </div>

      {editing && (
        <EditDialog
          procedure={editing}
          onSave={patch => {
            ConfigService.setProcedureOverride(editing.code, patch)
            refresh()
            setEditing(null)
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
