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
  Sparkles,
  BookmarkCheck,
  ChevronDown,
  XCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QuotationService } from '@/services/quotationService';
import {
  StatusPill,
  complexityVariant,
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

              {/* Left Column */}
              <div className="lg:col-span-1 space-y-4">

                {/* Clasificación IA */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Clasificación IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {quotationData.procedures && quotationData.procedures.length > 0 ? (
                      quotationData.procedures.map((entry, idx) =>
                        entry.procedureData && (
                          <div key={idx} className={idx > 0 ? 'pt-3 border-t border-border/30' : ''}>
                            {quotationData.procedures!.length > 1 && (
                              <p className="text-xs text-muted-foreground mb-1">Procedimiento {idx + 1}</p>
                            )}
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <StatusPill label={entry.procedureData.code} variant="gray" />
                              <StatusPill
                                label={entry.procedureData.complexity}
                                variant={complexityVariant(entry.procedureData.complexity)}
                              />
                            </div>
                            <p className="text-sm font-medium">{entry.procedureData.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {entry.procedureData.category} · {entry.procedureData.estimatedDuration}
                            </p>
                            {entry.estimatedCost && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Est. ${entry.estimatedCost.min.toLocaleString()} – ${entry.estimatedCost.max.toLocaleString()}
                              </p>
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <div>
                        <p className="text-sm">{quotationData.procedure}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Datos del Caso */}
                <Card>
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
                      <p className="text-sm text-muted-foreground">Tipo de cobertura / Financiador</p>
                      <StatusPill label={quotationData.patientType} variant="blue" className="mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-4">

                {hasPrestaciones ? (
                  /* Real prestaciones grouped by procedure — scrollable + accordion */
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Prestaciones</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="max-h-[420px] overflow-y-auto divide-y divide-border/40">
                        {(quotationData.procedures ?? []).map(entry => {
                          const rows = prestacionesByProc[entry.id] ?? [];
                          if (rows.length === 0) return (
                            <div key={entry.id} className="flex items-center gap-2 px-4 py-3 bg-red-50/60">
                              <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                              <div>
                                <p className="text-sm font-semibold text-foreground leading-tight">
                                  {entry.procedureData?.title ?? entry.procedure}
                                </p>
                                <p className="text-xs text-red-400 mt-0.5">0 episodios · Sin datos registrados</p>
                              </div>
                            </div>
                          );
                          const habituales = rows.filter(r => r.tipo === 'habitual');
                          const diferenciales = rows.filter(r => r.tipo === 'diferencial');
                          const subtotal = rows.reduce((s, r) => s + storedSubtotal(r), 0);
                          const isOpen = openProcs[entry.id] ?? false;
                          return (
                            <div key={entry.id}>
                              {/* Accordion header */}
                              <button
                                type="button"
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors text-left"
                                onClick={() => setOpenProcs(prev => ({ ...prev, [entry.id]: !isOpen }))}
                              >
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-semibold text-foreground">
                                    {entry.procedureData?.title ?? entry.procedure}
                                  </span>
                                  <StatusPill label={`${habituales.length} hab.`} variant="emerald" />
                                  {diferenciales.length > 0 && (
                                    <StatusPill label={`${diferenciales.length} dif.`} variant="amber" />
                                  )}
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="text-sm font-semibold text-primary">
                                    ${subtotal.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                                  </span>
                                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </div>
                              </button>

                              {/* Accordion body */}
                              {isOpen && (
                                <div className="px-4 pb-4 space-y-3">
                                  {habituales.length > 0 && (
                                    <div>
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <StatusPill label="Habituales" variant="emerald" />
                                        <span className="text-xs text-muted-foreground">{habituales.length} prestaciones</span>
                                      </div>
                                      {habituales.map(row => (
                                        <PrestacionLine key={row.rowId} row={row} />
                                      ))}
                                    </div>
                                  )}
                                  {diferenciales.length > 0 && (
                                    <div>
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <StatusPill label="Diferenciales" variant="amber" />
                                        <span className="text-xs text-muted-foreground">{diferenciales.length} prestaciones</span>
                                      </div>
                                      {diferenciales.map(row => (
                                        <PrestacionLine key={row.rowId} row={row} />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  /* Fallback: no prestaciones data */
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
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-medium text-primary-foreground/80">Costo Total</p>
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
