import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  FileText,
  Download,
  Save,
  BookmarkCheck,
  ChevronDown,
  XCircle,
  Clock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QuotationService } from '@/services/quotationService';
import {
  StatusPill,
  complexityVariant,
  riskVariant,
} from '@/components/ui/status-pill';
import type { StoredPrestacionRow, StoredPrestaciones } from '@/types/quotation';

interface ProcedureEntry {
  id: string;
  procedure: string;
  procedureData: {
    title: string;
    code: string;
    complexity: string;
    estimatedDuration: string;
    category: string;
    estimatedCost: { min: number; max: number };
    riskLevel?: string;
  } | null;
  estimatedCost: { min: number; max: number } | null;
}

interface QuotationData {
  id?: string;
  hospital: string;
  procedure: string;
  procedures?: ProcedureEntry[];
  totalEstimatedCost?: { min: number; max: number };
  doctor: string;
  patientType: string;
  status?: string;
  prestaciones?: StoredPrestaciones;
}

// ── Helper: subtotal de un StoredPrestacionRow ──────────────────────────────
function storedSubtotal(row: StoredPrestacionRow): number {
  return row.precioS4 * (1 - row.descuento / 100) * row.cantidad;
}

// ── Pill de descuento violeta ───────────────────────────────────────────────
const DESCUENTO_CLASSES: [number, string][] = [
  [0,        'bg-gray-100   text-gray-600   border-gray-400'],
  [5,        'bg-violet-100 text-violet-800 border-violet-300'],
  [10,       'bg-violet-300 text-violet-900 border-violet-400'],
  [15,       'bg-violet-500 text-white      border-violet-600'],
  [20,       'bg-violet-700 text-white      border-violet-800'],
  [Infinity, 'bg-violet-900 text-white      border-violet-900'],
];
const DiscountPill = ({ pct }: { pct: number }) => {
  const cls = DESCUENTO_CLASSES.find(([max]) => pct <= max)![1];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap border ${cls}`}>
      {pct > 0 ? `${pct}%` : '—'}
    </span>
  );
};

// ── Línea de prestación compacta ───────────────────────────────────────────
const PrestacionLine = ({ row }: { row: StoredPrestacionRow }) => (
  <div className="flex items-center gap-2 py-1.5 border-b border-border/30 last:border-0 text-xs">
    <span className="font-mono text-muted-foreground w-[90px] shrink-0 truncate">{row.code}</span>
    <span className="flex-1 text-foreground truncate">{row.name}</span>
    <DiscountPill pct={row.descuento} />
    <span className="text-muted-foreground w-12 text-right shrink-0">×{row.cantidad}</span>
    <span className="font-semibold text-primary w-20 text-right shrink-0">
      ${storedSubtotal(row).toLocaleString('es-MX', { maximumFractionDigits: 0 })}
    </span>
  </div>
);

const QuotationResultModal = () => {
  const [quotationData, setQuotationData] = useState<QuotationData | null>(null);
  const [openProcs, setOpenProcs] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const isOpen = searchParams.get('view') === 'result';

  useEffect(() => {
    if (!isOpen) return;
    const stored = localStorage.getItem('quotationData');
    if (stored) {
      setQuotationData(JSON.parse(stored));
    } else {
      setSearchParams({});
    }
  }, [isOpen, setSearchParams]);

  const handleClose = () => setSearchParams({});

  // Compute total from real prestaciones if available, else from procedure costs
  const prestacionesTotal = (() => {
    if (!quotationData?.prestaciones) return 0;
    return Object.values(quotationData.prestaciones)
      .flat()
      .reduce((s, r) => s + storedSubtotal(r), 0);
  })();

  const procedureCostTotal = (() => {
    if (!quotationData?.procedures?.length) return 0;
    return quotationData.procedures.reduce(
      (s, p) => s + ((p.estimatedCost?.min ?? 0) + (p.estimatedCost?.max ?? 0)) / 2,
      0
    );
  })();

  const totalCost = prestacionesTotal > 0
    ? prestacionesTotal
    : procedureCostTotal || quotationData?.totalEstimatedCost
      ? ((quotationData?.totalEstimatedCost?.min ?? 0) + (quotationData?.totalEstimatedCost?.max ?? 0)) / 2
      : 0;

  const recordId = quotationData?.id;

  const handleSaveDraft = async () => {
    if (recordId) {
      await QuotationService.updateQuotationStatus(recordId, 'draft');
    }
    toast({ title: 'Borrador guardado', description: 'Puedes retomarlo desde el historial' });
    navigate('/history');
  };

  const handleGenerateQuotation = async () => {
    if (recordId) {
      await QuotationService.updateQuotationStatus(recordId, 'pending', 'Cotización confirmada');
    }
    toast({ title: 'Cotización generada', description: 'La cotización ha sido registrada' });
    navigate('/history');
  };

  const handleExport = () => {
    toast({ title: 'Exportando cotización', description: 'El documento se descargará en breve...' });
  };

  // Group prestaciones by procedure ID
  const prestacionesByProc: StoredPrestaciones = quotationData?.prestaciones ?? {};
  // Show prestaciones section if there are procedures (even if some have 0 rows — shown as "no episodios")
  const hasPrestaciones = (quotationData?.procedures?.length ?? 0) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-primary-500">
            Cotización Generada
          </DialogTitle>
          <DialogDescription>Análisis inteligente completado</DialogDescription>
        </DialogHeader>

        {quotationData && (
          <div className="px-6 pb-0">
            <div className="grid lg:grid-cols-3 gap-4">

              {/* Left Column — Datos del Caso only */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-5 w-5 text-primary" />
                      Datos del Caso
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Hospital</p>
                      <p className="font-medium text-sm">{quotationData.hospital}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Médico</p>
                      <p className="font-medium text-sm">{quotationData.doctor}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Cobertura / Financiador</p>
                      <StatusPill label={quotationData.patientType} variant="blue" className="mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-4">

                {hasPrestaciones ? (
                  <Card>
                    <CardHeader className="pb-0 px-4 pt-4">
                      <CardTitle className="text-base">Prestaciones por procedimiento</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 mt-3">
                      <div className="max-h-[440px] overflow-y-auto">
                        {(quotationData.procedures ?? []).map(entry => {
                          const rows = prestacionesByProc[entry.id] ?? [];
                          const procTitle = entry.procedureData?.title ?? entry.procedure;
                          const procCostAvg = entry.estimatedCost
                            ? (entry.estimatedCost.min + entry.estimatedCost.max) / 2
                            : 0;

                          // No episodios card
                          if (rows.length === 0) return (
                            <div key={entry.id} className="flex items-start gap-3 px-4 py-3 border-b border-border/40 bg-red-50/50">
                              <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0 space-y-1.5">
                                <p className="text-sm font-semibold text-foreground leading-snug">{procTitle}</p>
                                {entry.procedureData && (
                                  <div className="flex flex-wrap gap-1.5">
                                    <StatusPill label={`cod. ${entry.procedureData.code}`} variant="gray" />
                                    <StatusPill label={entry.procedureData.category} variant="blue" />
                                    <StatusPill label={entry.procedureData.complexity} variant={complexityVariant(entry.procedureData.complexity)} />
                                  </div>
                                )}
                                <p className="text-xs text-red-400">0 episodios · Sin datos registrados</p>
                              </div>
                              {procCostAvg > 0 && (
                                <div className="text-right shrink-0">
                                  <p className="text-[10px] text-muted-foreground">Proc. est.</p>
                                  <p className="text-sm font-semibold text-foreground">
                                    ${procCostAvg.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                                  </p>
                                </div>
                              )}
                            </div>
                          );

                          const habituales = rows.filter(r => r.tipo === 'habitual');
                          const diferenciales = rows.filter(r => r.tipo === 'diferencial');
                          const prestSubtotal = rows.reduce((s, r) => s + storedSubtotal(r), 0);
                          const isOpen = openProcs[entry.id] ?? false;

                          return (
                            <div key={entry.id} className="border-b border-border/40 last:border-0">
                              {/* ── Accordion header ── */}
                              <button
                                type="button"
                                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${isOpen ? 'bg-muted/20' : 'hover:bg-muted/10'}`}
                                onClick={() => setOpenProcs(prev => ({ ...prev, [entry.id]: !isOpen }))}
                              >
                                <ChevronDown className={`h-4 w-4 text-muted-foreground mt-1 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />

                                {/* Centre: title + all meta pills */}
                                <div className="flex-1 min-w-0 space-y-1.5">
                                  <p className="text-sm font-semibold text-foreground leading-snug">{procTitle}</p>

                                  {/* Classification row */}
                                  {entry.procedureData && (
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <StatusPill label={`cod. ${entry.procedureData.code}`} variant="gray" />
                                      <StatusPill label={entry.procedureData.category} variant="blue" />
                                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {entry.procedureData.estimatedDuration}
                                      </span>
                                      <StatusPill label={entry.procedureData.complexity} variant={complexityVariant(entry.procedureData.complexity)} />
                                      {entry.procedureData.riskLevel && (
                                        <StatusPill label={`Riesgo ${entry.procedureData.riskLevel}`} variant={riskVariant(entry.procedureData.riskLevel)} />
                                      )}
                                    </div>
                                  )}

                                  {/* Prestaciones count row */}
                                  <div className="flex flex-wrap gap-1.5">
                                    <StatusPill label={`${habituales.length} habituales`} variant="emerald" />
                                    {diferenciales.length > 0 && (
                                      <StatusPill label={`${diferenciales.length} diferenciales`} variant="amber" />
                                    )}
                                  </div>
                                </div>

                                {/* Right: cost block */}
                                <div className="shrink-0 text-right space-y-1">
                                  {procCostAvg > 0 && (
                                    <div>
                                      <p className="text-[10px] text-muted-foreground leading-none">Proc. est.</p>
                                      <p className="text-xs font-medium text-foreground">
                                        ${procCostAvg.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                                      </p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-[10px] text-muted-foreground leading-none">Prestaciones</p>
                                    <p className="text-sm font-bold text-primary">
                                      ${prestSubtotal.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                                    </p>
                                  </div>
                                </div>
                              </button>

                              {/* ── Accordion body (smooth grid animation) ── */}
                              <div className={`grid transition-all duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                <div className="overflow-hidden">
                                  <div className="px-4 pt-1 pb-4 space-y-4 bg-muted/5">
                                    {habituales.length > 0 && (
                                      <div>
                                        <div className="flex items-center gap-2 mb-2">
                                          <StatusPill label="Habituales" variant="emerald" />
                                          <span className="text-xs text-muted-foreground">{habituales.length} prestaciones</span>
                                        </div>
                                        <div className="rounded-md border border-border/40 overflow-hidden">
                                          {habituales.map(row => (
                                            <PrestacionLine key={row.rowId} row={row} />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {diferenciales.length > 0 && (
                                      <div>
                                        <div className="flex items-center gap-2 mb-2">
                                          <StatusPill label="Diferenciales" variant="amber" />
                                          <span className="text-xs text-muted-foreground">{diferenciales.length} prestaciones</span>
                                        </div>
                                        <div className="rounded-md border border-border/40 overflow-hidden">
                                          {diferenciales.map(row => (
                                            <PrestacionLine key={row.rowId} row={row} />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {/* Subtotal row */}
                                    <div className="flex justify-end items-center gap-2 pt-1 border-t border-border/30">
                                      <span className="text-xs text-muted-foreground">Subtotal prestaciones:</span>
                                      <span className="text-sm font-bold text-primary">
                                        ${prestSubtotal.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                                      </span>
                                      {procCostAvg > 0 && (
                                        <>
                                          <span className="text-xs text-muted-foreground ml-2">+ Proc. est.:</span>
                                          <span className="text-sm font-semibold text-foreground">
                                            ${procCostAvg.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Costo estimado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        No se registraron prestaciones para esta cotización.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Total Cost */}
                <Card className="bg-primary border-primary/50 shadow-brand">
                  <CardContent className="py-4 px-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-medium text-primary-foreground/80">Costo Total</p>
                        {prestacionesTotal > 0 && procedureCostTotal > 0 && (
                          <p className="text-xs text-primary-foreground/60 mt-0.5">
                            Prest.: ${prestacionesTotal.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                            {' · '}
                            Proc.: ${procedureCostTotal.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                          ${totalCost.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-primary-foreground/60">
                          Cotización IA &bull; {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Sticky footer */}
        <div className="sticky bottom-0 bg-background border-t px-6 py-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveDraft}>
            <BookmarkCheck className="h-4 w-4 mr-2" />
            Guardar borrador
          </Button>
          <Button onClick={handleGenerateQuotation} variant="hero" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Generar cotización
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuotationResultModal;
