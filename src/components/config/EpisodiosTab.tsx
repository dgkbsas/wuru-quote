import { useState } from 'react'
import { ChevronDown, ChevronRight, Database } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ConfigService } from '@/services/configService'
import { EPISODIOS_DB } from '@/data/episodios'

export default function EpisodiosTab() {
  const summaries = ConfigService.getEpisodiosSummary()
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (name: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Database className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {summaries.length} procedimientos con datos históricos de episodios
        </p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden divide-y divide-border/60">
        {summaries.map(s => {
          const isOpen = expanded.has(s.procedureName)
          const full = EPISODIOS_DB.find(e => e.procedureName === s.procedureName)
          return (
            <div key={s.procedureName}>
              <button
                className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-blue-50/40 transition-colors"
                onClick={() => toggle(s.procedureName)}
              >
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.procedureName}</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {s.keywords.map(k => (
                      <span key={k} className="text-[10px] text-muted-foreground bg-slate-100 rounded px-1">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div>
                    <p className="text-xs font-semibold text-foreground">{s.totalEpisodios}</p>
                    <p className="text-[10px] text-muted-foreground">episodios</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary-500">{s.prestacionesComunes}</p>
                    <p className="text-[10px] text-muted-foreground">comunes</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-600">{s.prestacionesDiferenciales}</p>
                    <p className="text-[10px] text-muted-foreground">diferenc.</p>
                  </div>
                </div>
              </button>

              {isOpen && full && (
                <div className="px-4 pb-4 bg-slate-50/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Prestaciones comunes ({full.prestacionesComunes.length})
                      </p>
                      <div className="space-y-1">
                        {full.prestacionesComunes.map(p => (
                          <div key={p.code} className="flex items-center justify-between text-xs py-1 border-b border-border/30">
                            <div>
                              <span className="font-mono text-[10px] text-muted-foreground mr-2">{p.code}</span>
                              <span className="text-foreground">{p.name}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <Badge variant="outline" className="text-[10px] px-1">
                                {p.frecuencia}%
                              </Badge>
                              <span className="text-muted-foreground">${p.precioS4.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {full.prestacionesDiferenciales.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Prestaciones diferenciales ({full.prestacionesDiferenciales.length})
                        </p>
                        <div className="space-y-1">
                          {full.prestacionesDiferenciales.map(p => (
                            <div key={p.code} className="flex items-center justify-between text-xs py-1 border-b border-border/30">
                              <div>
                                <span className="font-mono text-[10px] text-muted-foreground mr-2">{p.code}</span>
                                <span className="text-foreground">{p.name}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                <Badge variant="outline" className="text-[10px] px-1 border-amber-200 text-amber-600">
                                  {p.frecuencia}%
                                </Badge>
                                <span className="text-muted-foreground">${p.precioS4.toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
