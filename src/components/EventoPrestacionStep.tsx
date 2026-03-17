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
  BarChart2,
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
  tipo: 'habitual' | 'diferencial' | 'catalogo';
  descuento: number;
  cantidad: number;
  cantidadSugerida: number;
}

/** Mapa de prestaciones por procedimiento: clave = id del ProcedureEntry */
export type PrestacionesByProcedure = Record<string, PrestacionRow[]>;

export interface ProcedureWithEpisodio {
  procedureId: string;
  procedureName: string;
  episodio: EpisodioData | null;
}

export function calcSubtotal(row: PrestacionRow): number {
  return row.precioS4 * (1 - row.descuento / 100) * row.cantidad;
}

export function totalPrestaciones(map: PrestacionesByProcedure): number {
  return Object.values(map)
    .flat()
    .reduce((s, r) => s + calcSubtotal(r), 0);
}

const COBERTURAS_LIST = [
  { key: 'particular', label: 'Particular' },
  { key: 'eps', label: 'EPS' },
  { key: 'prepagada', label: 'Prepagada' },
  { key: 'soat', label: 'SOAT' },
] as const;

function calcTotalForCobertura(
  rows: PrestacionRow[],
  cobertura: string
): number {
  return rows.reduce((sum, row) => {
    const desc = getDescuento(cobertura, row.unidad);
    return sum + row.precioS4 * (1 - desc / 100) * row.cantidad;
  }, 0);
}

function makeRow(
  p: PrestacionItem,
  tipo: 'habitual' | 'diferencial' | 'catalogo',
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
  [0, 'bg-gray-100    text-gray-600    border-gray-400'],
  [5, 'bg-violet-100  text-violet-800  border-violet-300'],
  [10, 'bg-violet-300  text-violet-900  border-violet-400'],
  [15, 'bg-violet-500  text-white       border-violet-600'],
  [20, 'bg-violet-700  text-white       border-violet-800'],
  [Infinity, 'bg-violet-900  text-white border-violet-900'],
];

const DiscountPill = ({ pct }: { pct: number }) => {
  const cls = DESCUENTO_CLASSES.find(([max]) => pct <= max)![1];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap border ${cls}`}
    >
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

    {/* ── Mobile cards (< lg) ── */}
    <div className="lg:hidden divide-y divide-border/60">
      {rows.length === 0 ? (
        <div className="py-6 text-center text-sm text-muted-foreground">
          No hay prestaciones seleccionadas
        </div>
      ) : rows.map(row => (
        <div key={row.rowId} className="p-3 space-y-2 hover:bg-muted/20 transition-colors">
          {/* Name + tipo */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground leading-snug">{row.name}</p>
              <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{row.code} · {row.unidad}</p>
            </div>
            <StatusPill
              label={row.tipo === 'diferencial' ? 'Diferencial' : row.tipo === 'catalogo' ? 'Catálogo' : 'Habitual'}
              variant={prestacionTipoVariant(row.tipo ?? 'habitual')}
            />
          </div>
          {/* Frec + precio + desc */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
            <span>Frec. {row.tipo === 'catalogo' ? '0%' : `${row.frecuencia}%`}</span>
            <span>S4 ${row.precioS4.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <DiscountPill pct={row.descuento} />
          </div>
          {/* Qty + subtotal + delete */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => onUpdate(row.rowId, 'cantidad', String(Math.max(1, row.cantidad - 1)))}
                className="h-6 w-6 flex items-center justify-center rounded bg-muted border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40 active:scale-95 transition-all text-sm font-bold leading-none select-none shrink-0"
              >−</button>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  value={row.cantidad}
                  onChange={e => onUpdate(row.rowId, 'cantidad', e.target.value)}
                  className="w-12 text-center text-xs bg-background border border-border rounded py-1 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                {row.cantidad !== (row.cantidadSugerida ?? 1) && (
                  <button
                    type="button"
                    title="Restablecer sugerencia"
                    onClick={() => onUpdate(row.rowId, 'cantidad', String(row.cantidadSugerida ?? 1))}
                    className="absolute left-0.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => onUpdate(row.rowId, 'cantidad', String(row.cantidad + 1))}
                className="h-6 w-6 flex items-center justify-center rounded bg-muted border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40 active:scale-95 transition-all text-sm font-bold leading-none select-none shrink-0"
              >+</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">
                ${calcSubtotal(row).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <button
                type="button"
                onClick={() => onRemove(row.rowId)}
                className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* ── Desktop table (>= lg) ── */}
    <div className="hidden lg:block">
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
                  label={
                    row.tipo === 'diferencial'
                      ? 'Diferencial'
                      : row.tipo === 'catalogo'
                        ? 'Catálogo'
                        : 'Habitual'
                  }
                  variant={prestacionTipoVariant(row.tipo ?? 'habitual')}
                />
              </div>
              <div className="px-2 py-2 text-center text-xs text-muted-foreground">
                {row.tipo === 'catalogo' ? '0%' : `${row.frecuencia}%`}
              </div>
              <div className="px-1.5 py-1.5">
                <div className="flex items-center bg-muted/30 border border-border/50 rounded overflow-hidden">
                  <span className="px-1.5 text-xs text-muted-foreground select-none">$</span>
                  <input
                    type="number"
                    readOnly
                    value={row.precioS4}
                    tabIndex={-1}
                    className="w-full text-right text-xs bg-transparent py-1 pr-1.5 text-muted-foreground cursor-default focus:outline-none"
                  />
                </div>
              </div>
              <div className="px-1.5 py-1.5 flex justify-center">
                <DiscountPill pct={row.descuento} />
              </div>
              <div className="px-1.5 py-1.5">
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => onUpdate(row.rowId, 'cantidad', String(Math.max(1, row.cantidad - 1)))}
                    className="h-6 w-6 flex items-center justify-center rounded bg-muted border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40 active:scale-95 transition-all text-sm font-bold leading-none select-none shrink-0"
                  >−</button>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min={1}
                      value={row.cantidad}
                      onChange={e => onUpdate(row.rowId, 'cantidad', e.target.value)}
                      className="w-full text-right text-xs bg-background border border-border rounded py-1 pr-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {row.cantidad !== (row.cantidadSugerida ?? 1) && (
                      <button
                        type="button"
                        title="Restablecer sugerencia"
                        onClick={() => onUpdate(row.rowId, 'cantidad', String(row.cantidadSugerida ?? 1))}
                        className="absolute left-0.5 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded text-amber-500 hover:text-amber-700 hover:bg-amber-100 transition-colors"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdate(row.rowId, 'cantidad', String(row.cantidad + 1))}
                    className="h-6 w-6 flex items-center justify-center rounded bg-muted border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40 active:scale-95 transition-all text-sm font-bold leading-none select-none shrink-0"
                  >+</button>
                </div>
              </div>
              <div className="px-2 py-2 text-right text-xs font-semibold text-foreground">
                ${calcSubtotal(row).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
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

    {/* ── Mobile cards (< lg) ── */}
    <div className="lg:hidden divide-y divide-border/40">
      {items.map(p => {
        const d = getDescuento(cobertura, p.unidad);
        const subtotal = p.precioS4 * (1 - d / 100) * p.cantidadSugerida;
        return (
          <div key={p.code} className="p-3 space-y-1.5 hover:bg-muted/20 transition-colors">
            {/* Name + tipo */}
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-muted-foreground leading-snug flex-1">{p.name}</p>
              <StatusPill
                label={p.tipo === 'diferencial' ? 'Diferencial' : 'Habitual'}
                variant={prestacionTipoVariant(p.tipo)}
              />
            </div>
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
              <span className="font-mono">{p.code} · {p.unidad}</span>
              <span>Frec. {p.frecuencia}%</span>
              <span>S4 ${p.precioS4.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <DiscountPill pct={d} />
            </div>
            {/* Cant. sugerida + subtotal + add */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-muted-foreground">
                Cant. sugerida: <strong>{p.cantidadSugerida}</strong> · Est. ${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <button
                type="button"
                onClick={() => onAdd(p, p.tipo)}
                title="Agregar prestación"
                className="h-7 w-7 rounded flex items-center justify-center text-primary/60 hover:text-primary hover:bg-primary/10 border border-border hover:border-primary/40 transition-all shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>

    {/* ── Desktop table (>= lg) ── */}
    <div className="hidden lg:block">
      <TableHeader accentClass="bg-muted/30" />
      <div className="divide-y divide-border/40">
        {items.map(p => (
          <div
            key={p.code}
            className={`grid ${GRID} items-center hover:bg-muted/20 transition-colors`}
          >
            <div />
            <div className="px-2 py-2 text-xs font-mono text-muted-foreground">{p.unidad}</div>
            <div className="px-2 py-2 text-xs font-mono text-muted-foreground/70">{p.code}</div>
            <div className="px-2 py-2 text-xs text-muted-foreground leading-tight">{p.name}</div>
            <div className="px-2 py-2 flex justify-center">
              <StatusPill
                label={p.tipo === 'diferencial' ? 'Diferencial' : 'Habitual'}
                variant={prestacionTipoVariant(p.tipo)}
              />
            </div>
            <div className="px-2 py-2 text-center text-xs text-muted-foreground">{p.frecuencia}%</div>
            <div className="px-1.5 py-1.5">
              <div className="flex items-center bg-muted/20 border border-border/40 rounded overflow-hidden">
                <span className="px-1.5 text-xs text-muted-foreground/60 select-none">$</span>
                <input type="number" readOnly value={p.precioS4} tabIndex={-1} className="w-full text-right text-xs bg-transparent py-1 pr-1.5 text-muted-foreground/60 cursor-default focus:outline-none" />
              </div>
            </div>
            <div className="px-1.5 py-1.5 flex justify-center">
              <DiscountPill pct={getDescuento(cobertura, p.unidad)} />
            </div>
            <div className="px-2 py-2 text-center text-xs text-muted-foreground/70 font-medium">{p.cantidadSugerida}</div>
            <div className="px-2 py-2 text-right text-xs text-muted-foreground/70">
              {(() => {
                const d = getDescuento(cobertura, p.unidad);
                return `$${(p.precioS4 * (1 - d / 100) * p.cantidadSugerida).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              })()}
            </div>
            <div className="flex items-center justify-center">
              <button type="button" onClick={() => onAdd(p, p.tipo)} title="Agregar prestación" className="h-7 w-7 rounded flex items-center justify-center text-primary/60 hover:text-primary hover:bg-primary/10 border border-border hover:border-primary/40 transition-all">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
);

// ── Catálogo completo de prestaciones ─────────────────────────────────────────

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  cobertura: string;
  addedCodes: Set<string>;
  onAdd: (
    p: PrestacionItem,
    tipo: 'habitual' | 'diferencial' | 'catalogo'
  ) => void;
  onRemove: (code: string) => void;
  onClearAll: () => void;
}

const CatalogModal = ({
  isOpen,
  onClose,
  cobertura,
  addedCodes,
  onAdd,
  onRemove,
  onClearAll,
}: CatalogModalProps) => {
  const [search, setSearch] = useState('');
  const [filterUnidad, setFilterUnidad] = useState('all');

  const allItems = useMemo(() => {
    const map = new Map<string, PrestacionItem>();
    EPISODIOS_DB.forEach(ep => {
      [...ep.prestacionesComunes, ...ep.prestacionesDiferenciales].forEach(
        p => {
          if (!map.has(p.code)) map.set(p.code, p);
        }
      );
    });
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, []);

  const unidades = useMemo(() => {
    const s = new Set(allItems.map(p => p.unidad));
    return Array.from(s).sort();
  }, [allItems]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allItems.filter(p => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q);
      const matchUnidad = filterUnidad === 'all' || p.unidad === filterUnidad;
      return matchSearch && matchUnidad;
    });
  }, [allItems, search, filterUnidad]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-4xl h-[80vh] max-h-[800px] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-3 shrink-0 border-b border-border/30">
          <DialogTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-primary" />
            Catálogo completo de prestaciones
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="px-6 py-3 shrink-0 flex gap-2 border-b border-border/20 bg-muted/10">
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
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs font-medium text-primary self-center shrink-0 px-2.5 py-1 rounded-full border border-primary/30 bg-primary/10">
            {filtered.length} resultados
          </span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto px-6 mb-6">
          {/* Header */}
          <div className="sticky top-0 bg-muted/70 backdrop-blur-sm z-10 border-b border-border grid grid-cols-[28px_64px_120px_2fr_100px_100px_64px] text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            <div className="px-1 py-2.5 text-center">#</div>
            <div className="px-3 py-2.5">Und.</div>
            <div className="px-2 py-2.5">Código</div>
            <div className="px-2 py-2.5">Descripción</div>
            <div className="px-2 py-2.5 text-right">Precio S4</div>
            <div className="px-2 py-2.5 text-center">% Desc.</div>
            <div className="px-2 py-2.5 text-center">Agregar</div>
          </div>
          <div className="divide-y divide-border/30">
            {filtered.map((p, index) => {
              const already = addedCodes.has(p.code);
              const descuento = getDescuento(cobertura, p.unidad);
              return (
                <div
                  key={p.code}
                  className={`grid grid-cols-[28px_64px_120px_2fr_100px_100px_64px] items-center text-xs transition-colors ${already ? 'bg-primary/5' : 'hover:bg-muted/20'}`}
                >
                  <div className="px-1 py-3 text-center text-muted-foreground/50 font-mono">
                    {index + 1}
                  </div>
                  <div className="px-3 py-3 font-mono text-muted-foreground">
                    {p.unidad}
                  </div>
                  <div className="px-2 py-3 font-mono text-muted-foreground/80">
                    {p.code}
                  </div>
                  <div className="px-2 py-3 text-foreground leading-snug">
                    {p.name}
                  </div>
                  <div className="px-2 py-3 text-right font-medium">
                    $
                    {p.precioS4.toLocaleString('es-MX', {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <div className="px-2 py-3 flex justify-center">
                    <DiscountPill pct={descuento} />
                  </div>
                  {/* Toggle switch */}
                  <div className="px-2 py-3 flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        already ? onRemove(p.code) : onAdd(p, 'catalogo')
                      }
                      title={
                        already ? 'Quitar prestación' : 'Agregar desde catálogo'
                      }
                      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none ${already ? 'bg-primary' : 'bg-muted-foreground/20'}`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${already ? 'translate-x-4' : 'translate-x-0.5'}`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border/30 px-6 py-4 flex justify-end gap-2 bg-background">
          <button
            type="button"
            onClick={() => {
              onClearAll();
            }}
            className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            Limpiar selección
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            Aceptar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ── Tabla comparativa por financiador ─────────────────────────────────────────

interface CoverageComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  procedures: ProcedureWithEpisodio[];
  value: PrestacionesByProcedure;
  currentCobertura: string;
}

const CoverageComparisonModal = ({
  isOpen,
  onClose,
  procedures,
  value,
  currentCobertura,
}: CoverageComparisonModalProps) => {
  const activeProcs = procedures.filter(
    p => (value[p.procedureId]?.length ?? 0) > 0
  );

  const fmt = (n: number) =>
    n.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <Dialog open={isOpen} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-4xl flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-3 shrink-0 border-b border-border/30">
          <DialogTitle className="flex items-center gap-2 text-base">
            <BarChart2 className="h-4 w-4 text-primary" />
            Comparativa por financiador
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-auto px-6 py-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-semibold text-muted-foreground pb-2.5 pr-4 w-1/2">
                  Procedimiento
                </th>
                {COBERTURAS_LIST.map(c => (
                  <th
                    key={c.key}
                    className={`text-right text-xs font-semibold pb-2 px-6 ${
                      c.key === currentCobertura
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span className="flex justify-end items-center gap-2">
                      {c.key === currentCobertura && (
                        <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 rounded-full px-1.5 py-0.5 font-normal">
                          actual
                        </span>
                      )}
                      {c.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {activeProcs.map(proc => {
                const rows = value[proc.procedureId] ?? [];
                return (
                  <tr
                    key={proc.procedureId}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-3 pr-4 text-foreground/90 leading-tight">
                      {proc.procedureName}
                    </td>
                    {COBERTURAS_LIST.map(c => (
                      <td
                        key={c.key}
                        className={`py-3 px-6 text-right tabular-nums ${
                          c.key === currentCobertura
                            ? 'text-primary font-semibold'
                            : 'text-foreground'
                        }`}
                      >
                        ${fmt(calcTotalForCobertura(rows, c.key))}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
            {activeProcs.length > 1 && (
              <tfoot>
                <tr className="border-t-2 border-border">
                  <td className="pt-3 pr-4 font-semibold text-foreground">
                    Total
                  </td>
                  {COBERTURAS_LIST.map(c => {
                    const total = activeProcs.reduce(
                      (sum, proc) =>
                        sum +
                        calcTotalForCobertura(
                          value[proc.procedureId] ?? [],
                          c.key
                        ),
                      0
                    );
                    return (
                      <td
                        key={c.key}
                        className={`pt-3 px-6 text-right tabular-nums font-bold ${
                          c.key === currentCobertura
                            ? 'text-primary'
                            : 'text-foreground'
                        }`}
                      >
                        ${fmt(total)}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <div className="shrink-0 border-t border-border/30 px-6 py-4 flex justify-end bg-background">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            Cerrar
          </button>
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

const NoEpisodioSection = ({
  procedureName,
  rows,
  cobertura,
  onChange,
}: NoEpisodioSectionProps) => {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(rows.length > 0);
  const prevRowsLength = useRef(rows.length);
  useEffect(() => {
    if (rows.length > 0 && prevRowsLength.current === 0) setIsOpen(true);
    prevRowsLength.current = rows.length;
  }, [rows.length]);
  const addedCodes = new Set(rows.map(r => r.code));

  const updateRow = (rowId: string, field: 'cantidad', raw: string) => {
    const num = parseFloat(raw.replace(',', '.')) || 0;
    onChange(rows.map(r => (r.rowId === rowId ? { ...r, [field]: num } : r)));
  };
  const removeRow = (rowId: string) =>
    onChange(rows.filter(r => r.rowId !== rowId));
  const addRow = (
    p: PrestacionItem,
    tipo: 'habitual' | 'diferencial' | 'catalogo'
  ) => {
    if (addedCodes.has(p.code)) return;
    onChange([...rows, makeRow(p, tipo, cobertura)]);
  };
  const removeByCode = (code: string) =>
    onChange(rows.filter(r => r.code !== code));

  const selectedCatalogo = rows.filter(r => r.tipo === 'catalogo').length;

  return (
    <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className={`flex items-center gap-3 px-4 py-3 bg-red-50/60 ${rows.length > 0 ? 'cursor-pointer hover:bg-red-50' : ''}`}
        onClick={() => rows.length > 0 && setIsOpen(o => !o)}
      >
        <XCircle className="h-4 w-4 text-red-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">
            {procedureName}
          </p>
          <p className="text-xs text-red-400 mt-0.5">
            0 episodios · Sin datos registrados
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {rows.length > 0 && (
            <div className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 pr-0.5 bg-blue-100 border border-blue-300 text-[10px] font-medium whitespace-nowrap">
              <span className="text-muted-foreground">Seleccionados</span>
              {selectedCatalogo > 0 && (
                <StatusPill
                  label={`${selectedCatalogo} catálogo`}
                  variant="sky"
                />
              )}
            </div>
          )}
          {rows.length > 0 && (
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
          {rows.length === 0 && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setCatalogOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/40 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Catálogo
            </button>
          )}
        </div>
      </div>

      {/* Rows — accordion */}
      {rows.length > 0 && (
        <div
          className={`grid transition-all duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/20">
              <span className="text-xs font-semibold text-foreground">
                Seleccionadas
              </span>
              <StatusPill label={`${rows.length}`} variant="blue" />
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setCatalogOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/40 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Catálogo
              </button>
            </div>
            <div className="px-3 pb-3 pt-2">
              <PrestacionesTable
                rows={rows}
                onUpdate={updateRow}
                onRemove={removeRow}
              />
            </div>
          </div>
        </div>
      )}

      <CatalogModal
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        cobertura={cobertura}
        addedCodes={addedCodes}
        onAdd={addRow}
        onRemove={removeByCode}
        onClearAll={() => onChange([])}
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
      onChange(
        episodio.prestacionesComunes.map(p => makeRow(p, 'habitual', cobertura))
      );
    }, 1200);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Actualizar descuentos cuando cambia la cobertura (también en draft-restore)
  useEffect(() => {
    if (rows.length === 0) return;
    onChange(
      rows.map(r => ({ ...r, descuento: getDescuento(cobertura, r.unidad) }))
    );
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
  const removeByCode = (code: string) =>
    onChange(rows.filter(r => r.code !== code));

  const addedCodes = new Set(rows.map(r => r.code));
  const selectedHabituals = rows.filter(r => r.tipo === 'habitual').length;
  const selectedDiferenciales = rows.filter(
    r => r.tipo === 'diferencial'
  ).length;
  const selectedCatalogo = rows.filter(r => r.tipo === 'catalogo').length;

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
        className={`w-full px-4 py-3 bg-blue-50/60 text-left transition-colors ${scanned ? 'hover:bg-blue-50 cursor-pointer' : 'cursor-default'} ${isOpen ? 'border-b border-border' : ''}`}
      >
        {/* ── Mobile (< lg): 2 filas ── */}
        <div className="lg:hidden">
          <div className="flex items-center gap-2">
            {scanning ? (
              <Search className="h-4 w-4 text-primary animate-pulse shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            )}
            <p className="text-sm font-semibold text-foreground leading-tight flex-1 truncate">
              {procedureName}
            </p>
            {scanned && (
              <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 pl-6">
            {scanning ? (
              <span className="text-xs text-primary/70">Buscando episodios similares…</span>
            ) : (
              <span className="text-xs text-muted-foreground shrink-0">{episodio.totalEpisodios} episodios</span>
            )}
            {scanned && (selectedHabituals > 0 || selectedDiferenciales > 0 || selectedCatalogo > 0) && (
              <div className="bg-blue-100 text-blue-700 border border-blue-300 gap-1.5 inline-flex items-center rounded-full px-2 py-0.5 pr-0.5 text-[10px] font-medium whitespace-nowrap">
                <span className="text-muted-foreground">Sel.</span>
                {selectedHabituals > 0 && <StatusPill label={`${selectedHabituals} hab.`} variant="emerald" />}
                {selectedDiferenciales > 0 && <StatusPill label={`${selectedDiferenciales} dif.`} variant="amber" />}
                {selectedCatalogo > 0 && <StatusPill label={`${selectedCatalogo} cat.`} variant="sky" />}
              </div>
            )}
            {scanned && (notSelectedHabituals > 0 || notSelectedDiferenciales > 0) && (
              <div className="bg-blue-100 text-blue-700 border border-blue-300 gap-1.5 inline-flex items-center rounded-full px-2 py-0.5 pr-0.5 text-[10px] font-medium whitespace-nowrap">
                <span className="text-muted-foreground">No sel.</span>
                {notSelectedHabituals > 0 && <StatusPill label={`${notSelectedHabituals} hab.`} variant="teal" />}
                {notSelectedDiferenciales > 0 && <StatusPill label={`${notSelectedDiferenciales} dif.`} variant="orange" />}
              </div>
            )}
          </div>
        </div>

        {/* ── Desktop (>= lg): fila única original ── */}
        <div className="hidden lg:flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {scanning ? (
              <Search className="h-4 w-4 text-primary animate-pulse shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">{procedureName}</p>
              {scanning ? (
                <p className="text-xs text-primary/70 mt-0.5">Buscando episodios similares…</p>
              ) : (
                <p className="text-xs text-foreground mt-0.5">{episodio.totalEpisodios} episodios</p>
              )}
            </div>
          </div>
          {scanned && (
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <div className="flex items-center gap-x-3 gap-y-1 flex-wrap justify-end">
                {(selectedHabituals > 0 || selectedDiferenciales > 0 || selectedCatalogo > 0) && (
                  <div className="bg-blue-100 text-blue-700 border border-blue-300 gap-2 inline-flex items-center rounded-full px-2 py-0.5 pr-0.5 text-[10px] font-medium whitespace-nowrap">
                    <span className="text-muted-foreground">Seleccionados</span>
                    {selectedHabituals > 0 && <StatusPill label={`${selectedHabituals} habitual${selectedHabituals !== 1 ? 'es' : ''}`} variant="emerald" />}
                    {selectedDiferenciales > 0 && <StatusPill label={`${selectedDiferenciales} diferencial${selectedDiferenciales !== 1 ? 'es' : ''}`} variant="amber" />}
                    {selectedCatalogo > 0 && <StatusPill label={`${selectedCatalogo} catálogo`} variant="sky" />}
                  </div>
                )}
                {(selectedHabituals > 0 || selectedDiferenciales > 0) && (notSelectedHabituals > 0 || notSelectedDiferenciales > 0) && (
                  <span className="text-muted-foreground/40 text-xs">·</span>
                )}
                {(notSelectedHabituals > 0 || notSelectedDiferenciales > 0) && (
                  <div className="bg-blue-100 text-blue-700 border border-blue-300 gap-2 inline-flex items-center rounded-full px-2 py-0.5 pr-0.5 text-[10px] font-medium whitespace-nowrap">
                    <span className="text-muted-foreground">No seleccionados</span>
                    {notSelectedHabituals > 0 && <StatusPill label={`${notSelectedHabituals} habitual${notSelectedHabituals !== 1 ? 'es' : ''}`} variant="teal" />}
                    {notSelectedDiferenciales > 0 && <StatusPill label={`${notSelectedDiferenciales} diferencial${notSelectedDiferenciales !== 1 ? 'es' : ''}`} variant="orange" />}
                  </div>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          )}
        </div>
      </button>

      {scanned && isOpen && (
        <div className="divide-y divide-border/40 max-h-80 overflow-y-auto">
          {/* ── Seleccionadas ── */}
          <div>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/20">
              <span className="text-xs font-semibold text-foreground">
                Seleccionadas
              </span>
              <StatusPill label={`${rows.length}`} variant="blue" />
              {/* ── Catálogo completo ── */}
              <button
                type="button"
                onClick={() => setCatalogOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/40 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Catálogo
              </button>
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
                <AvailableTable
                  items={notSelected}
                  cobertura={cobertura}
                  onAdd={addRow}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <CatalogModal
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        cobertura={cobertura}
        addedCodes={addedCodes}
        onAdd={addRow}
        onRemove={removeByCode}
        onClearAll={() => onChange([])}
      />
    </div>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────

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
  const [comparisonOpen, setComparisonOpen] = useState(false);

  const handleProcedureChange = (
    procedureId: string,
    rows: PrestacionRow[]
  ) => {
    onChange({ ...value, [procedureId]: rows });
  };

  const grandTotal = totalPrestaciones(value);
  const allRows = Object.values(value).flat();
  const activeProcs = procedures.filter(
    p => (value[p.procedureId]?.length ?? 0) > 0
  );

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

      {/* Subtotales por procedimiento + comparativa */}
      {allRows.length > 0 && (
        <div className="rounded-lg border border-border/50 bg-background overflow-hidden shadow-sm">
          {/* Header de sección */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border/30">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Subtotales por procedimiento
            </span>
            <button
              type="button"
              onClick={() => setComparisonOpen(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <BarChart2 className="h-3.5 w-3.5" />
              Ver por financiador
            </button>
          </div>
          {/* Filas por procedimiento */}
          {activeProcs.map(proc => {
            const rows = value[proc.procedureId] ?? [];
            const sub = rows.reduce((s, r) => s + calcSubtotal(r), 0);
            return (
              <div
                key={proc.procedureId}
                className="flex items-center justify-between px-4 py-2.5 text-sm border-b border-border/20 last:border-0"
              >
                <span className="text-foreground/80 truncate">
                  {proc.procedureName}
                </span>
                <span className="font-semibold text-foreground ml-4 shrink-0 tabular-nums">
                  $
                  {sub.toLocaleString('es-MX', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            );
          })}
        </div>
      )}

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

      <CoverageComparisonModal
        isOpen={comparisonOpen}
        onClose={() => setComparisonOpen(false)}
        procedures={procedures}
        value={value}
        currentCobertura={cobertura}
      />
    </div>
  );
};

export default EventoPrestacionStep;
