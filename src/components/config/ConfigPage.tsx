import { useState } from 'react'
import { Settings } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useClient } from '@/hooks/useClient'
import ProceduresTab from './ProceduresTab'
import ProfessionalsTab from './ProfessionalsTab'
import FinanciadoresTab from './FinanciadoresTab'
import CriteriosTab from './CriteriosTab'
import EpisodiosTab from './EpisodiosTab'
import UsuariosTab from './UsuariosTab'
import RolesTab from './RolesTab'
import ReglasTab from './ReglasTab'

const TABS = [
  { value: 'procedures', label: 'Procedimientos' },
  { value: 'professionals', label: 'Profesionales' },
  { value: 'financiadores', label: 'Financiadores' },
  { value: 'criterios', label: 'Criterios clínicos' },
  { value: 'episodios', label: 'Episodios' },
  { value: 'usuarios', label: 'Usuarios' },
  { value: 'roles', label: 'Roles y permisos' },
  { value: 'reglas', label: 'Reglas de negocio' },
]

export default function ConfigPage() {
  const client = useClient()
  const [activeTab, setActiveTab] = useState('procedures')

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500/10">
          <Settings className="w-5 h-5 text-primary-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Configuración</h1>
          <p className="text-sm text-muted-foreground">{client.name}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-blue-50/60 border border-border p-1 rounded-xl mb-6">
          {TABS.map(t => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="text-xs font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="procedures" className="mt-0"><ProceduresTab /></TabsContent>
        <TabsContent value="professionals" className="mt-0"><ProfessionalsTab /></TabsContent>
        <TabsContent value="financiadores" className="mt-0"><FinanciadoresTab /></TabsContent>
        <TabsContent value="criterios" className="mt-0"><CriteriosTab /></TabsContent>
        <TabsContent value="episodios" className="mt-0"><EpisodiosTab /></TabsContent>
        <TabsContent value="usuarios" className="mt-0"><UsuariosTab /></TabsContent>
        <TabsContent value="roles" className="mt-0"><RolesTab /></TabsContent>
        <TabsContent value="reglas" className="mt-0"><ReglasTab /></TabsContent>
      </Tabs>
    </div>
  )
}
