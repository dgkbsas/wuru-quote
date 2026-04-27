import { useState } from 'react'
import { Plus, Trash2, Users } from 'lucide-react'
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { ConfigService, type ClientUser } from '@/services/configService'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  operator: 'Operador',
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-50 text-red-700 border-red-200',
  manager: 'bg-blue-50 text-blue-700 border-blue-200',
  operator: 'bg-slate-50 text-slate-600 border-slate-200',
}

export default function UsuariosTab() {
  const [users, setUsers] = useState<ClientUser[]>(() => ConfigService.getUsers())
  const [deleting, setDeleting] = useState<ClientUser | null>(null)
  const [form, setForm] = useState({ email: '', name: '', roleId: 'operator' })
  const [showAdd, setShowAdd] = useState(false)

  const refresh = () => setUsers(ConfigService.getUsers())

  const handleAdd = () => {
    if (!form.email.trim() || !form.name.trim()) return
    ConfigService.addUser(form)
    refresh()
    setForm({ email: '', name: '', roleId: 'operator' })
    setShowAdd(false)
  }

  const handleRoleChange = (id: string, roleId: string) => {
    ConfigService.updateUserRole(id, roleId)
    refresh()
  }

  const handleDelete = () => {
    if (deleting) {
      ConfigService.deleteUser(deleting.id)
      refresh()
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {users.length} usuario{users.length !== 1 ? 's' : ''} configurado{users.length !== 1 ? 's' : ''}
        </p>
        <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-3.5 h-3.5" />
          Agregar usuario
        </Button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-border bg-blue-50/30 p-4 space-y-3">
          <p className="text-sm font-medium">Nuevo usuario</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Nombre *</Label>
              <Input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="h-8 text-sm"
                placeholder="Juan García"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="h-8 text-sm"
                placeholder="juan@hospital.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Rol</Label>
              <Select value={form.roleId} onValueChange={v => setForm(p => ({ ...p, roleId: v }))}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k} className="text-sm">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAdd(false)}>Cancelar</Button>
            <Button
              size="sm"
              disabled={!form.email.trim() || !form.name.trim()}
              onClick={handleAdd}
            >
              Guardar
            </Button>
          </div>
        </div>
      )}

      {users.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-3">
          <Users className="w-10 h-10 text-muted-foreground/30" />
          <div>
            <p className="font-medium">Sin usuarios configurados</p>
            <p className="text-xs mt-1">Agregá usuarios para darles acceso a esta cuenta</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50/60 border-b border-border">
                <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground">Nombre</th>
                <th className="text-left px-4 py-2.5 font-medium text-xs text-muted-foreground hidden sm:table-cell">Email</th>
                <th className="px-4 py-2.5 font-medium text-xs text-muted-foreground">Rol</th>
                <th className="px-4 py-2.5 font-medium text-xs text-muted-foreground hidden md:table-cell">Alta</th>
                <th className="px-4 py-2.5 font-medium text-xs text-muted-foreground text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u.id}
                  className={['border-b border-border/40', i % 2 === 1 ? 'bg-slate-50/30' : ''].join(' ')}
                >
                  <td className="px-4 py-2.5 font-medium">{u.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell text-xs">{u.email}</td>
                  <td className="px-4 py-2.5">
                    <Select value={u.roleId ?? 'operator'} onValueChange={v => handleRoleChange(u.id, v)}>
                      <SelectTrigger className="h-7 text-xs w-36 border-0 bg-transparent p-0 focus:ring-0">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-medium ${ROLE_COLORS[u.roleId ?? 'operator'] ?? ''}`}
                        >
                          {ROLE_LABELS[u.roleId ?? 'operator'] ?? u.roleId}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ROLE_LABELS).map(([k, v]) => (
                          <SelectItem key={k} value={k} className="text-sm">{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground hidden md:table-cell">
                    {new Date(u.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setDeleting(u)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleting && (
        <AlertDialog open onOpenChange={() => setDeleting(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Eliminar a <strong>{deleting.name}</strong>? Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
