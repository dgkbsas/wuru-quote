import { useState } from 'react'
import { RotateCcw, Shield } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ConfigService,
  DEFAULT_ROLES,
  PERMISSION_LABELS,
  type Permission,
  type RoleConfig,
} from '@/services/configService'

const ROLE_COLORS: Record<string, { card: string; badge: string }> = {
  admin: {
    card: 'border-red-200 bg-red-50/30',
    badge: 'bg-red-100 text-red-700 border-red-200',
  },
  manager: {
    card: 'border-blue-200 bg-blue-50/30',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  operator: {
    card: 'border-slate-200 bg-slate-50/20',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
  },
}

const ALL_PERMISSIONS = Object.keys(PERMISSION_LABELS) as Permission[]

const PERMISSION_GROUPS: { label: string; permissions: Permission[] }[] = [
  {
    label: 'Cotizaciones',
    permissions: ['create_quotation', 'approve_quotation', 'reject_quotation', 'export_quotation'],
  },
  {
    label: 'Sistema',
    permissions: ['view_analytics', 'edit_config'],
  },
]

function RoleCard({ role, onUpdate, onReset }: {
  role: RoleConfig
  onUpdate: (permissions: Permission[]) => void
  onReset: () => void
}) {
  const defaultRole = DEFAULT_ROLES.find(r => r.id === role.id)
  const isModified = JSON.stringify(role.permissions.sort()) !== JSON.stringify((defaultRole?.permissions ?? []).sort())
  const colors = ROLE_COLORS[role.id] ?? ROLE_COLORS.operator

  const toggle = (perm: Permission) => {
    const has = role.permissions.includes(perm)
    onUpdate(has ? role.permissions.filter(p => p !== perm) : [...role.permissions, perm])
  }

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${colors.card}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-sm">{role.label}</span>
          {isModified && (
            <Badge variant="outline" className="text-[9px] px-1.5 border-amber-200 text-amber-600">
              modificado
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-[10px] ${colors.badge}`}>
            {role.permissions.length} permisos
          </Badge>
          {isModified && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground"
              title="Restaurar permisos originales"
              onClick={onReset}
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {PERMISSION_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              {group.label}
            </p>
            <div className="space-y-1.5">
              {group.permissions.map(perm => (
                <div key={perm} className="flex items-center justify-between">
                  <span className="text-xs text-foreground">{PERMISSION_LABELS[perm]}</span>
                  <Switch
                    checked={role.permissions.includes(perm)}
                    onCheckedChange={() => toggle(perm)}
                    className="scale-75 origin-right"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RolesTab() {
  const [roles, setRoles] = useState(() => ConfigService.getRoles())

  const refresh = () => setRoles(ConfigService.getRoles())

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Configurá los permisos de cada rol. Los cambios afectan a todos los usuarios con ese rol asignado.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map(role => (
          <RoleCard
            key={role.id}
            role={role}
            onUpdate={permissions => {
              ConfigService.setRoleOverride(role.id, { permissions })
              refresh()
            }}
            onReset={() => {
              ConfigService.resetRole(role.id)
              refresh()
            }}
          />
        ))}
      </div>

      <div className="rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-3 mt-2">
        <p className="text-xs text-blue-700 font-medium">Nota</p>
        <p className="text-xs text-blue-600 mt-0.5">
          El rol <strong>Administrador</strong> siempre tiene acceso completo al sistema.
          Los permisos se aplican la próxima vez que el usuario inicia sesión.
        </p>
      </div>
    </div>
  )
}
