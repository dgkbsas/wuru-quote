import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { EpisodioData } from '@/data/episodios';

function formatFecha(fecha: string): string {
  const date = new Date(fecha + 'T12:00:00');
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const id of a) if (!b.has(id)) return false;
  return true;
}

interface EpisodiosModalProps {
  open: boolean;
  onClose: () => void;
  procedureName: string;
  episodio: EpisodioData;
  initialExcluded: Set<string>;
  onApply: (excluded: Set<string>) => void;
}

export const EpisodiosModal = ({
  open,
  onClose,
  procedureName,
  episodio,
  initialExcluded,
  onApply,
}: EpisodiosModalProps) => {
  const [excluded, setExcluded] = useState<Set<string>>(new Set(initialExcluded));

  useEffect(() => {
    if (open) setExcluded(new Set(initialExcluded));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (id: string) => {
    setExcluded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const activeCount = episodio.records.length - excluded.size;
  const hasChanges = !setsEqual(excluded, initialExcluded);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-base font-semibold leading-tight">
            Episodios · {procedureName}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {activeCount} de {episodio.records.length} episodios incluidos en el recuento de prestaciones
          </p>
        </DialogHeader>

        {/* Table header */}
        <div className="grid grid-cols-[2rem_1fr_1fr_1fr_auto] gap-3 px-6 py-2 bg-muted/40 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
          <span>#</span>
          <span>Fecha</span>
          <span>Profesional</span>
          <span>Paciente</span>
          <span>Incluir</span>
        </div>

        {/* Rows */}
        <div className="overflow-y-auto flex-1">
          {episodio.records.map((record, i) => {
            const isExcluded = excluded.has(record.id);
            return (
              <div
                key={record.id}
                className={`grid grid-cols-[2rem_1fr_1fr_1fr_auto] items-center gap-3 px-6 py-3 border-b border-border/50 transition-opacity ${isExcluded ? 'opacity-40' : ''}`}
              >
                <span className="text-xs text-muted-foreground tabular-nums">{i + 1}</span>
                <span className="text-sm">{formatFecha(record.fecha)}</span>
                <span className="text-sm truncate">{record.profesional}</span>
                <span className="text-sm text-muted-foreground">{record.paciente}</span>
                <Switch
                  checked={!isExcluded}
                  onCheckedChange={() => toggle(record.id)}
                />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <span className="text-xs text-muted-foreground">
            {excluded.size > 0
              ? `${excluded.size} episodio${excluded.size > 1 ? 's' : ''} excluido${excluded.size > 1 ? 's' : ''}`
              : 'Todos los episodios incluidos'}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm rounded-md border border-border bg-background hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => onApply(excluded)}
              disabled={!hasChanges}
              className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Aplicar cambios
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
