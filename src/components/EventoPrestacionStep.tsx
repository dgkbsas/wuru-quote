import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  ChevronDown,
  XCircle,
  BookOpen,
  X,
} from 'lucide-react';
import { EpisodioData, PrestacionItem, EPISODIOS_DB } from '@/data/episodios';
import { StatusPill, prestacionTipoVariant } from '@/components/ui/status-pill';
import { getDescuento } from '@/data/coberturas';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface PrestacionRow extends PrestacionItem {
  rowId: string;
  tipo: 'habitual' | 'diferencial';
  descuento: number;
  cantidad: number;
  cantidadSugerida: number;
}

/** Mapa de prestaciones por procedimiento: clave = id del ProcedureEntry */
export type PrestacionesByProcedure = Record<string, PrestacionRow[]>;

export function calcSubtotal(row: PrestacionRow): number {
  return row.precioS4 * (1 - row.descuento / 100) * row.cantidad;
}

export function totalPrestaciones(map: PrestacionesByProcedure): number {
  return Object.values(map)
    .flat()
    .reduce((s, r) => s + calcSubtotal(r), 0);
}

function makeRow(
  p: PrestacionItem,
  tipo: 'habitual' | 'diferencial',
  cobertura = ''
): PrestacionRow {
  return {
    ...p,
    rowId: crypto.randomUUID(),
    tipo,
    descuento: getDescuento(cobertura, p.unidad),
    cantidad: p.cantidadSugerida,
    cantidadSugerida: p.cantidadSugerida,
  };
}

// ── Pill de descuento con escala violeta ──────────────────────────────────────

const DESCUENTO_CLASSES: [number, string][] = [
  [0,  'bg-gray-100    text-gray-600    border-gray-400'],
  [5,  'bg-violet-100  text-violet-800  border-violet-300'],
  [10, 'bg-violet-300  text-violet-900  border-violet-400'],
  [15, 'bg-violet-500  text-white       border-violet-600'],
  [20, 'bg-violet-700  text-white       border-violet-800'],
  [Infinity, 'bg-violet-900  text-white border-violet-900'],
];

const DiscountPill = ({ pct }: { pct: number }) => {
  const cls = DESCUENTO_CLASSES.find(([max]) => pct <= max)![1];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap border ${cls}`}>
      {pct > 0 ? `${pct}%` : '—'}
    </span>
  );
};

// ── Columnas compartidas ───────────────────────────────────────────────────────
// [# | Und | Código | Descripción | Tipo | Frec. | Precio S4 | Precio | % Desc. | Cant. | Subtotal | Acción]
const GRID =
  'grid-cols-[28px_64px_110px_1fr_110px_56px_120px_72px_128px_80px_36px]';

const TableHeader = ({ accentClass = '' }: { accentClass?: string }) => (
  <div className={`hidden md:block border-b border-border ${accentClass}`}>
    <div
      className={`grid ${GRID} text-xs font-semibold text-muted-foreground uppercase tracking-wide`}
    >
      <div className="px-1 py-2 text-center">#</div>
      <div className="px-2 py-2">Und.</div>
      <div className="px-2 py-2">Código</div>
      <div className="px-2 py-2">Descripción</div>
      <div className="px-2 py-2 text-center">Tipo</div>
      <div className="px-2 py-2 text-center">Frec.</div>
      <div className="px-2 py-2 text-center">Precio S4</div>
      <div className="px-2 py-2 text-center">% Desc.</div>
      <div className="px-2 py-2 text-center">Cant.</div>
      <div className="px-2 py-2 text-center">Subtotal</div>
      <div className="px-2 py-2" />
    </div>
  </div>
);

// ── Tabla de prestaciones agregadas ───────────────────────────────────────────

interface TableProps {
  rows: PrestacionRow[];
  onUpdate: (rowId: string, field: 'cantidad', value: string) => void;
  onRemove: (rowId: string) => void;
}

const PrestacionesTable = ({ rows, onUpdate, onRemove }: TableProps) => (
  <div className="rounded-lg border border-border overflow-hidden">
    <TableHeader accentClass="bg-muted/50" />
    <div className="divide-y divide-border/60">
      {rows.length === 0 ? (
        <div className="py-6 text-center text-sm text-muted-foreground">
          No hay prestaciones seleccionadas
        </div>
      ) : (
        rows.map((row, index) => (
          <div
            key={row.rowId}
            className={`grid ${GRID} items-center hover:bg-muted/20 transition-colors group`}
          >
            <div className="px-1 py-2 text-center text-xs text-muted-foreground/60 font-mono">
              {index + 1}
            </div>
            <div className="px-2 py-2 text-xs font-mono text-muted-foreground">
              {row.unidad}
            </div>
            <div className="px-2 py-2 text-xs font-mono text-foreground">
              {row.code}
            </div>
            <div className="px-2 py-2 text-xs text-foreground leading-tight">
              {row.name}
            </div>
            <div className="px-2 py-2 flex justify-center">
              <StatusPill
                label={row.tipo === 'diferencial' ? 'Diferencial' : 'Habitual'}
                variant={prestacionTipoVariant(row.tipo ?? 'habitual')}
              />
            </div>
            <div className="px-2 py-2 text-center text-xs text-muted-foreground">
              {row.frecuencia}%
            </div>
            {/* Precio S4 readonly */}
            <div className="px-1.5 py-1.5">
              <div className="flex items-center bg-muted/30 border border-border/50 rounded overflow-hidden">
                <span className="px-1.5 text-xs text-muted-foreground select-none">
                  $
                </span>
                <input
                  type="number"
                  readOnly
                  value={row.precioS4}
                  tabIndex={-1}
                  className="w-full text-right text-xs bg-transparent py-1 pr-1.5 text-muted-foreground cursor-default focus:outline-none"
                />
              </div>
            </div>
            {/* % Descuento (readonly, calculado por cobertura) */}
            <div className="px-1.5 py-1.5 flex justify-center">
              <DiscountPill pct={row.descuento} />
            </div>
            {/* Cantidad */}
            <div className="px-1.5 py-1.5">
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdate(
                      row.rowId,
                      'cantidad',
                      String(Math.max(1, row.cantidad - 1))
                    )
                  }
                  className="h-6 w-6 flex items-center justify-center rounded bg-muted border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40 active:scale-95 transition-all text-sm font-bold leading-none select-none shrink-0"
                >
                  −
                </button>
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={1}
                    value={row.cantidad}
                    onChange={e =>
                      onUpdate(row.rowId, 'cantidad', e.target.value)
                    }
                    className="w-full text-right text-xs bg-background border border-border rounded py-1 pr-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {row.cantidad !== (row.cantidadSugerida ?? 1) && (
                    <button
                      type="button"
                      title="Restablecer sugerencia"
                      onClick={() =>
                        onUpdate(
                          row.rowId,
                          'cantidad',
                          String(row.cantidadSugerida ?? 1)
                        )
                      }
                      className="absolute left-0.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdate(row.rowId, 'cantidad', String(row.cantidad + 1))
                  }
                  className="h-6 w-6 flex items-center justify-center rounded bg-muted border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40 active:scale-95 transition-all text-sm font-bold leading-none select-none shrink-0"
                >
                  +
                </button>
              </div>
            </div>
            {/* Subtotal */}
            <div className="px-2 py-2 text-right text-xs font-semibold text-foreground">
              $
              {calcSubtotal(row).toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            {/* Eliminar */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => onRemove(row.rowId)}
                className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 opacity-40 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// ── Tabla de prestaciones no seleccionadas (habituales + diferenciales unificadas) ──

interface AvailableItem extends PrestacionItem {
  tipo: 'habitual' | 'diferencial';
}

interface AvailableTableProps {
  items: AvailableItem[];
  cobertura: string;
  onAdd: (item: PrestacionItem, tipo: 'habitual' | 'diferencial') => void;
}

const AvailableTable = ({ items, cobertura, onAdd }: AvailableTableProps) => (
  <div className="rounded-lg border border-border overflow-hidden">
    <TableHeader accentClass="bg-muted/30" />
    <div className="divide-y divide-border/40">
      {items.map(p => (
        <div
          key={p.code}
          className={`grid ${GRID} items-center hover:bg-muted/20 transition-colors`}
        >
          {/* Sin número # */}
          <div />
          <div className="px-2 py-2 text-xs font-mono text-muted-foreground">
            {p.unidad}
          </div>
          <div className="px-2 py-2 text-xs font-mono text-muted-foreground/70">
            {p.code}
          </div>
          <div className="px-2 py-2 text-xs text-muted-foreground leading-tight">
            {p.name}
          </div>
          <div className="px-2 py-2 flex justify-center">
            <StatusPill
              label={p.tipo === 'diferencial' ? 'Diferencial' : 'Habitual'}
              variant={prestacionTipoVariant(p.tipo)}
            />
          </div>
          <div className="px-2 py-2 text-center text-xs text-muted-foreground">
            {p.frecuencia}%
          </div>
          {/* Precio S4 */}
          <div className="px-1.5 py-1.5">
            <div className="flex items-center bg-muted/20 border border-border/40 rounded overflow-hidden">
              <span className="px-1.5 text-xs text-muted-foreground/60 select-none">
                $
              </span>
              <input
                type="number"
                readOnly
                value={p.precioS4}
                tabIndex={-1}
                className="w-full text-right text-xs bg-transparent py-1 pr-1.5 text-muted-foreground/60 cursor-default focus:outline-none"
              />
            </div>
          </div>
          {/* % Desc. */}
          <div className="px-1.5 py-1.5 flex justify-center">
            <DiscountPill pct={getDescuento(cobertura, p.unidad)} />
          </div>
          {/* Cant. sugerida */}
          <div className="px-2 py-2 text-center text-xs text-muted-foreground/70 font-medium">
            {p.cantidadSugerida}
          </div>
          {/* Subtotal estimado */}
          <div className="px-2 py-2 text-right text-xs text-muted-foreground/70">
            {(() => {
              const d = getDescuento(cobertura, p.unidad);
              return `$${(p.precioS4 * (1 - d / 100) * p.cantidadSugerida).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            })()}
          </div>
          {/* Agregar */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => onAdd(p, p.tipo)}
              title="Agregar prestación"
              className="h-7 w-7 rounded flex items-center justify-center text-primary/60 hover:text-primary hover:bg-primary/10 border border-border hover:border-primary/40 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Catálogo completo de prestaciones ─────────────────────────────────────────

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  cobertura: string;
  addedCodes: Set<string>;
  onAdd: (p: PrestacionItem, tipo: 'habitual' | 'diferencial') => void;
}

const CatalogModal = ({ isOpen, onClose, cobertura, addedCodes, onAdd }: CatalogModalProps) => {
  const [search, setSearch] = useState('');
  const [filterUnidad, setFilterUnidad] = useState('all');

  const allItems = useMemo(() => {
    const map = new Map<string, PrestacionItem>();
    EPISODIOS_DB.forEach(ep => {
      [...ep.prestacionesComunes, ...ep.prestacionesDiferenciales].forEach(p => {
        if (!map.has(p.code)) map.set(p.code, p);
      });
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const unidades = useMemo(() => {
    const s = new Set(allItems.map(p => p.unidad));
    return Array.from(s).sort();
  }, [allItems]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allItems.filter(p => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
      const matchUnidad = filterUnidad === 'all' || p.unidad === filterUnidad;
      return matchSearch && matchUnidad;
    });
  }, [allItems, search, filterUnidad]);

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3 shrink-0 border-b border-border/30">
          <DialogTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-primary" />
            Catálogo completo de prestaciones
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="px-5 py-3 shrink-0 flex gap-2 border-b border-border/20 bg-muted/10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o código..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <Select value={filterUnidad} onValueChange={setFilterUnidad}>
            <SelectTrigger className="w-40 h-8 text-sm">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las unidades</SelectItem>
              {unidades.map(u => (
                <SelectItem key={u} value={u}>{u}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground self-center shrink-0">
            {filtered.length} prestaciones
          </span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-muted/80 backdrop-blur-sm border-b border-border grid grid-cols-[90px_100px_1fr_70px_100px_80px_80px] text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            <div className="px-3 py-2">Unidad</div>
            <div className="px-2 py-2">Código</div>
            <div className="px-2 py-2">Descripción</div>
            <div className="px-2 py-2 text-center">Frec.</div>
            <div className="px-2 py-2 text-right">Precio S4</div>
            <div className="px-2 py-2 text-center">% Desc.</div>
            <div className="px-2 py-2 text-center">Agregar</div>
          </div>
          <div className="divide-y divide-border/30">
            {filtered.map(p => {
              const already = addedCodes.has(p.code);
              const descuento = getDescuento(cobertura, p.unidad);
              return (
                <div
                  key={p.code}
                  className={`grid grid-cols-[90px_100px_1fr_70px_100px_80px_80px] items-center text-xs transition-colors ${already ? 'opacity-40 bg-muted/10' : 'hover:bg-muted/20'}`}
                >
                  <div className="px-3 py-2 font-mono text-muted-foreground">{p.unidad}</div>
                  <div className="px-2 py-2 font-mono text-muted-foreground/80">{p.code}</div>
                  <div className="px-2 py-2 text-foreground leading-snug">{p.name}</div>
                  <div className="px-2 py-2 text-center text-muted-foreground">{p.frecuencia}%</div>
                  <div className="px-2 py-2 text-right font-medium">${p.precioS4.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</div>
                  <div className="px-2 py-2 flex justify-center">
                    <DiscountPill pct={descuento} />
                  </div>
                  <div className="px-2 py-2 flex justify-center">
                    {already ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAdd(p, 'diferencial')}
                        className="h-7 w-7 rounded flex items-center justify-center text-primary/60 hover:text-primary hover:bg-primary/10 border border-border hover:border-primary/40 transition-all"
                        title="Agregar como diferencial"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ── Tarjeta de procedimiento sin episodios (interactiva) ─────────────────────

interface NoEpisodioSectionProps {
  procedureName: string;
  rows: PrestacionRow[];
  cobertura: string;
  onChange: (rows: PrestacionRow[]) => void;
}

const NoEpisodioSection = ({ procedureName, rows, cobertura, onChange }: NoEpisodioSectionProps) => {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const addedCodes = new Set(rows.map(r => r.code));

  const updateRow = (rowId: string, field: 'cantidad', raw: string) => {
    const num = parseFloat(raw.replace(',', '.')) || 0;
    onChange(rows.map(r => (r.rowId === rowId ? { ...r, [field]: num } : r)));
  };
  const removeRow = (rowId: string) => onChange(rows.filter(r => r.rowId !== rowId));
  const addRow = (p: PrestacionItem, tipo: 'habitual' | 'diferencial') => {
    if (addedCodes.has(p.code)) return;
    onChange([...rows, makeRow(p, tipo, cobertura)]);
  };

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-red-50/60">
        <XCircle className="h-4 w-4 text-red-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">{procedureName}</p>
          <p className="text-xs text-red-400 mt-0.5">0 episodios · Sin datos registrados</p>
        </div>
        <button
          type="button"
          onClick={() => setCatalogOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/40 rounded-lg hover:bg-primary/10 transition-colors shrink-0"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Cargar del catálogo
        </button>
      </div>

      {/* Rows if any were added */}
      {rows.length > 0 && (
        <div className="px-3 pb-3 pt-2">
          <PrestacionesTable rows={rows} onUpdate={updateRow} onRemove={removeRow} />
        </div>
      )}

      <CatalogModal
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        cobertura={cobertura}
        addedCodes={addedCodes}
        onAdd={addRow}
      />
    </div>
  );
};

// ── Sección de un procedimiento ───────────────────────────────────────────────

interface ProcedureSectionProps {
  procedureName: string;
  episodio: EpisodioData;
  rows: PrestacionRow[];
  cobertura: string;
  onChange: (rows: PrestacionRow[]) => void;
}

const ProcedureSection = ({
  procedureName,
  episodio,
  rows,
  cobertura,
  onChange,
}: ProcedureSectionProps) => {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (rows.length > 0) {
      setScanned(true);
      return;
    }

    setScanning(true);
    const t = setTimeout(() => {
      setScanning(false);
      setScanned(true);
      onChange(episodio.prestacionesComunes.map(p => makeRow(p, 'habitual', cobertura)));
    }, 1200);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Actualizar descuentos cuando cambia la cobertura (también en draft-restore)
  useEffect(() => {
    if (rows.length === 0) return;
    onChange(rows.map(r => ({ ...r, descuento: getDescuento(cobertura, r.unidad) })));
  }, [cobertura]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateRow = (rowId: string, field: 'cantidad', raw: string) => {
    const num = parseFloat(raw.replace(',', '.')) || 0;
    onChange(rows.map(r => (r.rowId === rowId ? { ...r, [field]: num } : r)));
  };

  const removeRow = (rowId: string) =>
    onChange(rows.filter(r => r.rowId !== rowId));

  const addRow = (p: PrestacionItem, tipo: 'habitual' | 'diferencial') => {
    if (rows.some(r => r.code === p.code)) return;
    onChange([...rows, makeRow(p, tipo, cobertura)]);
  };

  const addedCodes = new Set(rows.map(r => r.code));
  const selectedHabituals = rows.filter(r => r.tipo === 'habitual').length;
  const selectedDiferenciales = rows.filter(
    r => r.tipo === 'diferencial'
  ).length;

  const notSelected: AvailableItem[] = [
    ...episodio.prestacionesComunes
      .filter(p => !addedCodes.has(p.code))
      .map(p => ({ ...p, tipo: 'habitual' as const })),
    ...episodio.prestacionesDiferenciales
      .filter(p => !addedCodes.has(p.code))
      .map(p => ({ ...p, tipo: 'diferencial' as const })),
  ];

  const notSelectedHabituals = notSelected.filter(
    p => p.tipo === 'habitual'
  ).length;
  const notSelectedDiferenciales = notSelected.filter(
    p => p.tipo === 'diferencial'
  ).length;

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
      {/* Procedure header — accordion toggle */}
      <button
        type="button"
        onClick={() => scanned && setIsOpen(o => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-blue-50/60 text-left transition-colors ${scanned ? 'hover:bg-blue-50 cursor-pointer' : 'cursor-default'} ${isOpen ? 'border-b border-border' : ''}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {scanning ? (
            <Search className="h-4 w-4 text-primary animate-pulse shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">
              {procedureName}
            </p>
            {scanning ? (
              <p className="text-xs text-primary/70 mt-0.5">
                Buscando episodios similares…
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-0.5">
                {episodio.totalEpisodios} episodios · {episodio.procedureName}
              </p>
            )}
          </div>
        </div>

        {scanned && (
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <div className="flex items-center gap-x-3 gap-y-1 flex-wrap justify-end">
              {/* Seleccionadas */}
              {(selectedHabituals > 0 || selectedDiferenciales > 0) && (
                <div className="bg-blue-100    text-blue-700    border border-blue-300' gap-2 inline-flex items-center rounded-full px-2 py-0.5 pr-0.5 text-[10px] font-medium whitespace-nowrap">
                  <span className="text-[10px] text-muted-foreground hidden sm:inline">
                    Seleccionados
                  </span>
                  {selectedHabituals > 0 && (
                    <StatusPill
                      label={`${selectedHabituals} habitual${selectedHabituals !== 1 ? 'es' : ''}`}
                      variant="emerald"
                    />
                  )}
                  {selectedDiferenciales > 0 && (
                    <StatusPill
                      label={`${selectedDiferenciales} diferencial${selectedDiferenciales !== 1 ? 'es' : ''}`}
                      variant="amber"
                    />
                  )}
                </div>
              )}
              {(selectedHabituals > 0 || selectedDiferenciales > 0) &&
                (notSelectedHabituals > 0 || notSelectedDiferenciales > 0) && (
                  <span className="text-muted-foreground/40 text-xs hidden sm:inline">
                    ·
                  </span>
                )}
              {/* No seleccionadas */}
              {(notSelectedHabituals > 0 || notSelectedDiferenciales > 0) && (
                <div className="bg-blue-100    text-blue-700    border border-blue-300' gap-2 inline-flex items-center rounded-full px-2 py-0.5 pr-0.5 text-[10px] font-medium whitespace-nowrap">
                  <span className="text-[10px] text-muted-foreground hidden sm:inline">
                    No seleccionados
                  </span>
                  {notSelectedHabituals > 0 && (
                    <StatusPill
                      label={`${notSelectedHabituals} habitual${notSelectedHabituals !== 1 ? 'es' : ''}`}
                      variant="teal"
                    />
                  )}
                  {notSelectedDiferenciales > 0 && (
                    <StatusPill
                      label={`${notSelectedDiferenciales} diferencial${notSelectedDiferenciales !== 1 ? 'es' : ''}`}
                      variant="orange"
                    />
                  )}
                </div>
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        )}
      </button>

      {scanned && isOpen && (
        <div className="divide-y divide-border/40">
          {/* ── Seleccionadas ── */}
          <div>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/20">
              <span className="text-xs font-semibold text-foreground">
                Seleccionadas
              </span>
              <StatusPill label={`${rows.length}`} variant="blue" />
            </div>
            <div className="px-3 pb-3 pt-2">
              <PrestacionesTable
                rows={rows}
                onUpdate={updateRow}
                onRemove={removeRow}
              />
            </div>
          </div>

          {/* ── No seleccionadas ── */}
          {notSelected.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/10">
                <span className="text-xs font-semibold text-muted-foreground">
                  No seleccionadas
                </span>
                <StatusPill label={`${notSelected.length}`} variant="gray" />
              </div>
              <div className="px-3 pb-3 pt-2">
                <AvailableTable items={notSelected} cobertura={cobertura} onAdd={addRow} />
              </div>
            </div>
          )}

          {/* ── Catálogo completo ── */}
          <div className="px-4 py-3 border-t border-border/30 bg-muted/5">
            <button
              type="button"
              onClick={() => setCatalogOpen(true)}
              className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Buscar en catálogo completo de prestaciones
            </button>
          </div>
        </div>
      )}

      <CatalogModal
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        cobertura={cobertura}
        addedCodes={addedCodes}
        onAdd={addRow}
      />
    </div>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────

export interface ProcedureWithEpisodio {
  procedureId: string;
  procedureName: string;
  episodio: EpisodioData | null;
}

interface Props {
  procedures: ProcedureWithEpisodio[];
  cobertura: string;
  value: PrestacionesByProcedure;
  onChange: (map: PrestacionesByProcedure) => void;
}

const EventoPrestacionStep = ({
  procedures,
  cobertura,
  value,
  onChange,
}: Props) => {
  const handleProcedureChange = (
    procedureId: string,
    rows: PrestacionRow[]
  ) => {
    onChange({ ...value, [procedureId]: rows });
  };

  const grandTotal = totalPrestaciones(value);
  const allRows = Object.values(value).flat();

  if (procedures.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground border border-dashed border-border rounded-lg bg-muted/20">
        Seleccione un procedimiento para ver las prestaciones asociadas
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {procedures.map(proc =>
          proc.episodio ? (
            <ProcedureSection
              key={proc.procedureId}
              procedureName={proc.procedureName}
              episodio={proc.episodio}
              cobertura={cobertura}
              rows={value[proc.procedureId] ?? []}
              onChange={rows => handleProcedureChange(proc.procedureId, rows)}
            />
          ) : (
            <NoEpisodioSection
              key={proc.procedureId}
              procedureName={proc.procedureName}
              rows={value[proc.procedureId] ?? []}
              cobertura={cobertura}
              onChange={rows => handleProcedureChange(proc.procedureId, rows)}
            />
          )
        )}
      </div>

      {/* Total prestaciones */}
      {allRows.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 flex-wrap">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Total prestaciones ·{' '}
              <span className="text-primary font-semibold">
                {allRows.length} ítem{allRows.length !== 1 ? 's' : ''}{' '}
                seleccionado{allRows.length !== 1 ? 's' : ''}
              </span>
            </span>
            {(() => {
              const h = allRows.filter(r => r.tipo === 'habitual').length;
              const d = allRows.filter(r => r.tipo === 'diferencial').length;
              return (
                <>
                  {h > 0 && (
                    <StatusPill
                      label={`${h} habitual${h !== 1 ? 'es' : ''}`}
                      variant="emerald"
                    />
                  )}
                  {d > 0 && (
                    <StatusPill
                      label={`${d} diferencial${d !== 1 ? 'es' : ''}`}
                      variant="amber"
                    />
                  )}
                </>
              );
            })()}
          </div>
          <p className="text-lg font-bold text-primary">
            $
            {grandTotal.toLocaleString('es-MX', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventoPrestacionStep;
