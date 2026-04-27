import { useState } from 'react'
import { Plus, Trash2, UserCheck } from 'lucide-react'
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { ConfigService, type SurgeonView } from '@/services/configService'
import { useClient } from '@/hooks/useClient'

const EMPTY_FORM = {
  name: '',
  specialty: '',
  hospital: '',
  city: '',
  experience: '',
  procedureCategories: [] as string[],
  certifications: [] as string[],
}

function AddSurgeonDialog({
  onSave,
  onClose,
}: {
  onSave: (data: typeof EMPTY_FORM) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(EMPTY_FORM)

  const set = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const valid = form.name.trim() && form.specialty.trim() && form.hospital.trim()

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Agregar profesional</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Nombre completo *</Label>
              <Input value={form.name} onChange={set('name')} className="h-8 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Especialidad *</Label>
              <Input value={form.specialty} onChange={set('specialty')} className="h-8 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Años de experiencia</Label>
              <Input value={form.experience} onChange={set('experience')} placeholder="ej. 10 años" className="h-8 text-sm" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Hospital *</Label>
              <Input value={form.hospital} onChange={set('hospital')} className="h-8 text-sm" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Ciudad</Label>
              <Input value={form.city} onChange={set('city')} className="h-8 text-sm" />
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button size="sm" disabled={!valid} onClick={() => onSave(form)}>Agregar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ProfessionalsTab() {
  const client = useClient()
  const [surgeons, setSurgeons] = useState(() => ConfigService.getSurgeons(client.hospitals))
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [deleting, setDeleting] = useState<SurgeonView | null>(null)

  const refresh = () => setSurgeons(ConfigService.getSurgeons(client.hospitals))

  const toggleActive = (id: string, active: boolean) => {
    ConfigService.setSurgeonOverride(id, { active })
    refresh()
  }

  const handleAdd = (data: typeof EMPTY_FORM) => {
    ConfigService.addSurgeon(data)
    refresh()
    setShowAdd(false)
  }

  const handleDelete = (surgeon: SurgeonView) => {
    ConfigService.deleteSurgeon(surgeon.id)
    refresh()
    setDeleting(null)
  }

  const filtered = surgeons.filter(
    s =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.specialty.toLowerCase().includes(search.toLowerCase()) ||
      s.hospital.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount = surgeons.filter(s => s.active).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Input
          placeholder="Buscar por nombre, especialidad u hospital..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-8 text-sm max-w-xs"
        />
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="text-xs">{activeCount} activos</Badge>
          <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setShowAdd(true)}>
            <Plus className="w-3.5 h-3.5" />
            Agregar
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-50/60 border-b border-border">
              <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground">Profesional</th>
              <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground hidden sm:table-cell">Especialidad</th>
              <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground hidden md:table-cell">Hospital</th>
              <th className="px-4 py-2.5 font-medium text-xs text-muted-foreground text-center">Activo</th>
              <th className="px-4 py-2.5 font-medium text-xs text-muted-foreground text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr
                key={s.id}
                className={[
                  'border-b border-border/40 transition-colors',
                  !s.active ? 'opacity-40' : '',
                  i % 2 === 1 ? 'bg-slate-50/30' : '',
                ].join(' ')}
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{s.name}</span>
                    {s.isCustom && (
                      <Badge className="text-[9px] h-4 px-1 bg-violet-100 text-violet-700 border-violet-200">
                        custom
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">{s.specialty}</td>
                <td className="px-4 py-2.5 text-muted-foreground hidden md:table-cell text-xs">{s.hospital}</td>
                <td className="px-4 py-2.5 text-center">
                  <Switch
                    checked={s.active}
                    onCheckedChange={v => toggleActive(s.id, v)}
                    className="scale-90"
                  />
                </td>
                <td className="px-4 py-2.5 text-right">
                  {s.isCustom && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setDeleting(s)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
            <UserCheck className="w-8 h-8 text-muted-foreground/40" />
            {search ? 'No se encontraron profesionales' : 'No hay profesionales configurados'}
          </div>
        )}
      </div>

      {showAdd && <AddSurgeonDialog onSave={handleAdd} onClose={() => setShowAdd(false)} />}

      {deleting && (
        <AlertDialog open onOpenChange={() => setDeleting(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar profesional</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Eliminar a <strong>{deleting.name}</strong>? Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDelete(deleting)}
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
