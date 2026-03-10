import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sparkles,
  TrendingUp,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import SmartProcedureSearch from './SmartProcedureSearch';
import SmartSurgeonSelector from './SmartSurgeonSelector';
import { ProcedureData } from '@/data/procedures';
import { SurgeonData } from '@/data/surgeons';
import { QuotationService } from '@/services/quotationService';

interface ProcedureEntry {
  id: string;
  procedure: string;
  procedureData: ProcedureData | null;
  estimatedCost: { min: number; max: number } | null;
}

// ── Encabezado de sección numerado ─────────────────────────────────────────
const StepHeader = ({
  step,
  title,
  subtitle,
  hasError,
}: {
  step: number;
  title: string;
  subtitle?: string;
  hasError?: boolean;
}) => (
  <div className="flex items-start gap-3">
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${hasError ? 'bg-destructive' : 'bg-primary'}`}
    >
      <span className="text-xs font-bold text-white">{step}</span>
    </div>
    <div>
      <p
        className={`text-base font-semibold leading-tight transition-colors ${hasError ? 'text-destructive' : 'text-foreground'}`}
      >
        {title}
        {hasError && (
          <span className="ml-2 text-xs font-normal">requerido</span>
        )}
      </p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      )}
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────────────────

const DRAFT_KEY = 'wuru_quote_draft';

const loadDraft = () => {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const QuotationForm = () => {
  const draft = loadDraft();

  const [formData, setFormData] = useState(
    draft?.formData ?? {
      hospital: '',
      doctor: '',
      patientType: '',
    }
  );
  const [procedures, setProcedures] = useState<ProcedureEntry[]>(
    draft?.procedures ?? [
      { id: '1', procedure: '', procedureData: null, estimatedCost: null },
    ]
  );
  const [hasDraft, setHasDraft] = useState(!!draft);
  const [draftExiting, setDraftExiting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [animatingInIds, setAnimatingInIds] = useState<Set<string>>(new Set());
  const [animatingOutIds, setAnimatingOutIds] = useState<Set<string>>(
    new Set()
  );
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  // Ref siempre actualizado — evita closures stale en handlers de click
  const activeCardIndexRef = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // % del ancho del carrusel que se reserva para el peek del card anterior
  const PEEK_PERCENT = 0.08;

  const checkScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    // Dot activo: tarjeta cuyo centro está más cercano al centro visible
    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActiveCardIndex(closest);
    activeCardIndexRef.current = closest;
  }, []);

  useEffect(() => {
    checkScroll();
  }, [procedures.length, checkScroll]);

  const scrollToCard = (i: number) => {
    const card = cardRefs.current[i];
    if (card && carouselRef.current) {
      const offset =
        i === 0
          ? 0
          : Math.round(carouselRef.current.clientWidth * PEEK_PERCENT);
      carouselRef.current.scrollTo({
        left: card.offsetLeft - offset,
        behavior: 'smooth',
      });
    }
  };

  const scrollCarousel = (dir: 'left' | 'right') => {
    const current = activeCardIndexRef.current;
    const target =
      dir === 'right'
        ? Math.min(current + 2, procedures.length - 1)
        : Math.max(current - 2, 0);
    scrollToCard(target);
  };
  const [selectedSurgeonData, setSelectedSurgeonData] =
    useState<SurgeonData | null>(draft?.selectedSurgeonData ?? null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto-save draft to sessionStorage on every change
  useEffect(() => {
    const isEmpty =
      !formData.hospital &&
      !formData.doctor &&
      !formData.patientType &&
      procedures.length === 1 &&
      !procedures[0].procedureData;

    if (isEmpty) {
      sessionStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
    } else {
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ formData, procedures, selectedSurgeonData })
      );
      setHasDraft(true);
    }
  }, [formData, procedures, selectedSurgeonData]);

  const clearDraft = () => {
    setDraftExiting(true);
    setTimeout(() => { // 225ms = button exit delay(75) + duration(150)
      sessionStorage.removeItem(DRAFT_KEY);
      setFormData({ hospital: '', doctor: '', patientType: '' });
      setProcedures([
        {
          id: crypto.randomUUID(),
          procedure: '',
          procedureData: null,
          estimatedCost: null,
        },
      ]);
      setSelectedSurgeonData(null);
      setSubmitted(false);
      setHasDraft(false);
      setDraftExiting(false);
    }, 225);
  };

  const addProcedure = () => {
    const newId = crypto.randomUUID();
    setAnimatingInIds(prev => new Set([...prev, newId]));
    setProcedures(prev => [
      ...prev,
      { id: newId, procedure: '', procedureData: null, estimatedCost: null },
    ]);
    setTimeout(() => {
      setAnimatingInIds(prev => { const s = new Set(prev); s.delete(newId); return s; });
    }, 350);
    setTimeout(() => {
      carouselRef.current?.scrollTo({
        left: carouselRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }, 60);
  };

  const removeProcedure = (id: string) => {
    setConfirmDeleteId(null);
    if (procedures.length === 1) {
      // Nuevo id: desmonta SmartProcedureSearch y lo remonta con estado limpio
      setProcedures([
        {
          id: crypto.randomUUID(),
          procedure: '',
          procedureData: null,
          estimatedCost: null,
        },
      ]);
      setFormData(prev => ({ ...prev, doctor: '' }));
      setSelectedSurgeonData(null);
      return;
    }
    // Ajustar activeCardIndex inmediatamente para evitar estado stale
    const removedIndex = procedures.findIndex(p => p.id === id);
    const current = activeCardIndexRef.current;
    if (removedIndex <= current && current > 0) {
      setActiveCardIndex(current - 1);
      activeCardIndexRef.current = current - 1;
    }
    // Animar salida y luego eliminar
    setAnimatingOutIds(prev => new Set([...prev, id]));
    setTimeout(() => {
      setProcedures(prev => prev.filter(p => p.id !== id));
      setAnimatingOutIds(prev => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
      setFormData(prev => ({ ...prev, doctor: '' }));
      setSelectedSurgeonData(null);
    }, 260);
  };

  const handleProcedureChange = (
    id: string,
    procedureName: string,
    procedureData?: ProcedureData
  ) => {
    setProcedures(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              procedure: procedureName,
              procedureData: procedureData || null,
              estimatedCost: procedureData?.estimatedCost || null,
            }
          : p
      )
    );
    setFormData(prev => ({ ...prev, doctor: '' }));
    setSelectedSurgeonData(null);
  };

  const handleSurgeonChange = (
    surgeonName: string,
    surgeonData?: SurgeonData
  ) => {
    setFormData(prev => ({ ...prev, doctor: surgeonName }));
    setSelectedSurgeonData(surgeonData || null);
  };

  const handleHospitalChange = (hospital: string) => {
    setFormData(prev => ({ ...prev, hospital, doctor: '' }));
    setSelectedSurgeonData(null);
  };

  const totalCostMin = procedures.reduce(
    (sum, p) => sum + (p.estimatedCost?.min || 0),
    0
  );
  const totalCostMax = procedures.reduce(
    (sum, p) => sum + (p.estimatedCost?.max || 0),
    0
  );
  const proceduresWithCost = procedures.filter(p => p.estimatedCost !== null);
  const primaryProcedureCategory =
    procedures.find(p => p.procedureData)?.procedureData?.category || '';

  const handleGenerate = async () => {
    const validProcedures = procedures.filter(p => p.procedureData !== null);
    setSubmitted(true);

    if (
      !formData.hospital ||
      validProcedures.length === 0 ||
      !formData.doctor ||
      !formData.patientType
    ) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor complete todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedSurgeonData) {
      toast({
        title: 'Error de datos',
        description: 'Faltan datos del médico seleccionado',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const firstProc = validProcedures[0].procedureData!;
      const quotationData = await QuotationService.createQuotation({
        hospital: formData.hospital,
        procedure_name: validProcedures
          .map(p => p.procedureData!.title)
          .join(' + '),
        procedure_code: validProcedures
          .map(p => p.procedureData!.code)
          .join(', '),
        procedure_category: firstProc.category,
        doctor_name: selectedSurgeonData.name,
        doctor_specialty: selectedSurgeonData.specialty,
        patient_type: formData.patientType as
          | 'particular'
          | 'eps'
          | 'prepagada'
          | 'soat',
        estimated_cost_min: totalCostMin,
        estimated_cost_max: totalCostMax,
        complexity: firstProc.complexity,
        duration: firstProc.estimatedDuration,
        status: 'pending',
        notes: 'Cotización generada automáticamente por IA',
      });

      const displayData = {
        hospital: formData.hospital,
        doctor: formData.doctor,
        patientType: formData.patientType,
        procedure: validProcedures.map(p => p.procedureData!.title).join(' + '),
        procedures: validProcedures,
        totalEstimatedCost: { min: totalCostMin, max: totalCostMax },
        estimatedCost: { min: totalCostMin, max: totalCostMax },
        quotationId: quotationData?.id,
      };
      localStorage.setItem('quotationData', JSON.stringify(displayData));
      sessionStorage.removeItem(DRAFT_KEY);

      toast({
        title: 'Cotización generada',
        description: 'IA ha procesado su solicitud exitosamente',
      });

      navigate('?view=result');
    } catch (error) {
      console.error('Error generating quotation:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar la cotización',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const hospitals = [
    'Hospital Ángeles Acoxpa (CDMX)',
    'Hospital Ángeles Centro Sur (CDMX)',
    'Hospital Ángeles Ciudad Juárez (Chihuahua)',
    'Hospital Ángeles Clínica Londres (CDMX)',
    'Hospital Ángeles Culiacán (Sinaloa)',
    'Hospital Ángeles Del Carmen (Guadalajara, Jalisco)',
    'Hospital Ángeles León (Guanajuato)',
    'Hospital Ángeles Lindavista (CDMX)',
    'Hospital Ángeles Lomas (CDMX / Huixquilucan)',
    'Hospital Ángeles Metropolitano (CDMX)',
    'Hospital Ángeles México (CDMX)',
    'Hospital Ángeles Mocel (CDMX)',
    'Hospital Ángeles Morelia (Michoacán)',
    'Hospital Ángeles Pedregal (CDMX)',
    'Hospital Ángeles Puebla (Puebla)',
    'Hospital Ángeles Querétaro (Querétaro)',
    'Hospital Ángeles Roma (CDMX)',
    'Hospital Ángeles Cuauhtémoc (Cuauhtémoc, Chih.)',
    'Hospital Ángeles Chihuahua (Chihuahua)',
  ];

  const isMultiple = procedures.length > 1;

  // Errores visibles solo tras intentar generar
  const errorHospital = submitted && !formData.hospital;
  const errorProcedure =
    submitted && procedures.filter(p => p.procedureData).length === 0;
  const errorDoctor = submitted && !formData.doctor;
  const errorPatientType = submitted && !formData.patientType;

  return (
    <div className="p-3 sm:p-4">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
        {/* Page header */}
        <div className="flex items-end justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-3xl font-bold text-primary-500">
              Nueva Cotización
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Genere una cotización quirúrgica con asistencia de IA
            </p>
          </div>
          {hasDraft && (
            <div className="flex items-center gap-6 shrink-0">
              <span className={`hidden sm:inline-flex items-center gap-1 text-sm font-medium text-green-500/60 ${draftExiting ? 'animate-out zoom-out-95 fade-out duration-150 fill-mode-forwards' : 'animate-in zoom-in-95 fade-in duration-200 fill-mode-backwards'}`}>
                <Save className="h-4 w-4" />
                Borrador ✓
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={`h-7 px-3 text-muted-foreground border-muted-foreground/30 hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10 text-xs ${draftExiting ? 'animate-out zoom-out-95 fade-out duration-150 delay-75 fill-mode-forwards' : 'animate-in zoom-in-95 fade-in duration-200 delay-100 fill-mode-backwards'}`}
                onClick={clearDraft}
              >
                <span className="hidden sm:inline">Borrar formulario</span>
                <span className="sm:hidden">Borrar</span>
                <X className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardContent className="p-0">
            {/* ── Paso 1: Hospital ─────────────────────────────── */}
            <div className="p-4 sm:p-6 space-y-4">
              <StepHeader
                step={1}
                title="Unidad Hospitalaria"
                subtitle="¿En qué hospital se realizará el procedimiento?"
                hasError={errorHospital}
              />
              <div className="relative">
                {formData.hospital && (
                  <button
                    type="button"
                    onClick={() => handleHospitalChange('')}
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-10 h-5 w-5 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/40 flex items-center justify-center transition-colors"
                  >
                    <X className="h-3 w-3 text-foreground" />
                  </button>
                )}
                <Select
                  value={formData.hospital}
                  onValueChange={handleHospitalChange}
                >
                  <SelectTrigger
                    className={`bg-blue-300/20 ${errorHospital ? 'border-destructive ring-1 ring-destructive' : ''}`}
                  >
                    <SelectValue placeholder="Seleccione el hospital...">
                      {formData.hospital ? (
                        <span className="font-bold text-primary-500">
                          {formData.hospital}
                        </span>
                      ) : (
                        'Seleccione el hospital...'
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-neutral-200">
                    {hospitals.map(hospital => (
                      <SelectItem key={hospital} value={hospital}>
                        {hospital}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* ── Paso 2: Procedimientos ───────────────────────── */}
            <div className="p-4 sm:p-6 space-y-4">
              <StepHeader
                step={2}
                title="Procedimientos Quirúrgicos"
                subtitle="Puede agregar uno o varios procedimientos a la cotización."
                hasError={errorProcedure}
              />

              {/* ── Carrusel horizontal ── */}
              {/* Fondo del track — contrasta con las cards blancas */}
              <div
                className={`relative bg-blue-50 rounded-2xl p-3 border transition-colors ${errorProcedure ? 'border-destructive' : 'border-primary/20'}`}
              >
                {/* Fades de borde */}
                {canScrollLeft && (
                  <div className="absolute left-3 top-3 bottom-6 w-12 bg-gradient-to-r from-blue-50 to-transparent z-10 pointer-events-none rounded-l-xl" />
                )}
                {canScrollRight && (
                  <div className="absolute right-3 top-3 bottom-6 w-12 bg-gradient-to-l from-blue-50 to-transparent z-10 pointer-events-none rounded-r-xl" />
                )}

                {/* Flechas de navegación */}
                {canScrollLeft && (
                  <button
                    type="button"
                    onClick={() => scrollCarousel('left')}
                    className="absolute left-1 top-1/2 -translate-y-1/2 z-20 h-7 w-7 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-neutral-50 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 text-foreground" />
                  </button>
                )}
                {canScrollRight && (
                  <button
                    type="button"
                    onClick={() => scrollCarousel('right')}
                    className="absolute right-1 top-1/2 -translate-y-1/2 z-20 h-7 w-7 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-neutral-50 transition-colors"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-foreground" />
                  </button>
                )}

                {/* Track scroll */}
                <div
                  ref={carouselRef}
                  onScroll={checkScroll}
                  className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scroll-smooth min-h-[320px]"
                  style={{
                    scrollbarWidth: 'none',
                    scrollPaddingLeft: `${PEEK_PERCENT * 100}%`,
                  }}
                >
                  {procedures.map((entry, index) => (
                    <div
                      key={entry.id}
                      ref={el => {
                        cardRefs.current[index] = el;
                      }}
                      className={`flex-shrink-0 w-[72%] md:w-[40%] md:min-w-[260px] snap-start bg-white border border-border rounded-xl shadow-sm flex flex-col ${
                        animatingInIds.has(entry.id)
                          ? 'animate-in slide-in-from-right-4 fade-in duration-300 fill-mode-backwards'
                          : animatingOutIds.has(entry.id)
                            ? 'animate-out slide-out-to-right-4 fade-out duration-200 fill-mode-forwards'
                            : ''
                      }`}
                      onClick={() => {
                        // Usa el ref para evitar closure stale
                        if (index !== activeCardIndexRef.current)
                          scrollToCard(index);
                      }}
                    >
                      {/* Header de tarjeta */}
                      <div className="h-10 flex items-center justify-between px-3 border-b border-border/60 rounded-t-xl">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-sm font-bold text-primary shrink-0">
                            {index + 1}
                          </span>
                          {entry.procedureData ? (
                            <>
                              <span className="text-sm font-medium text-foreground truncate">
                                {entry.procedureData.title}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs font-mono shrink-0"
                              >
                                {entry.procedureData.code}
                              </Badge>
                            </>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">
                              Sin seleccionar
                            </span>
                          )}
                        </div>

                        {(entry.procedureData || procedures.length > 1) &&
                          (confirmDeleteId === entry.id ? (
                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              <span className="text-xs text-destructive font-medium">
                                ¿Eliminar?
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5 text-xs"
                                onClick={() => setConfirmDeleteId(null)}
                              >
                                No
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="h-6 px-1.5 text-xs"
                                onClick={() => removeProcedure(entry.id)}
                              >
                                Sí
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 shrink-0 ml-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setConfirmDeleteId(entry.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          ))}
                      </div>

                      {/* Body */}
                      <div className="p-3 flex-1">
                        <SmartProcedureSearch
                          value={entry.procedure}
                          onChange={(name, data) =>
                            handleProcedureChange(entry.id, name, data)
                          }
                          className="relative"
                          showLabel={false}
                          fixedDropdown
                          initialProcedureData={entry.procedureData}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Botón agregar — compacto, siempre visible al final */}
                  <div
                    onClick={addProcedure}
                    className="flex-shrink-0 w-12 md:w-28 snap-start bg-white/60 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:border-primary/60 hover:bg-white transition-all flex items-center justify-center md:flex-col md:gap-2"
                  >
                    <div className="rounded-full border-2 border-dashed border-primary/30 p-2">
                      <Plus className="h-4 w-4 text-primary/50" />
                    </div>
                    <span className="hidden md:block text-[11px] text-primary/60 font-medium text-center leading-tight px-2">
                      Agregar
                    </span>
                  </div>
                </div>

                {/* ── Dots navigator ── */}
                <div className="flex items-center justify-center gap-1.5 mt-2 min-h-[8px]">
                  {procedures.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToCard(i)}
                      className={`rounded-full transition-all duration-200 ${
                        i === activeCardIndex
                          ? 'w-5 h-2 bg-primary'
                          : 'w-2 h-2 bg-neutral-400/40 hover:bg-primary/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {/* fin wrapper track */}

              {/* Total estimado */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Total estimado
                    {proceduresWithCost.length > 0 && (
                      <>
                        {' '}
                        ·{' '}
                        <span className="text-primary font-semibold">
                          {proceduresWithCost.length}{' '}
                          {proceduresWithCost.length === 1
                            ? 'procedimiento'
                            : 'procedimientos'}
                        </span>
                      </>
                    )}
                  </span>
                </div>
                <p className="text-lg font-bold text-primary">
                  {proceduresWithCost.length > 0
                    ? `$${totalCostMin.toLocaleString()} – $${totalCostMax.toLocaleString()}`
                    : '—'}
                </p>
              </div>
            </div>

            <Separator />

            {/* ── Paso 3: Médico ───────────────────────────────── */}
            <div className="p-4 sm:p-6 space-y-4">
              <StepHeader
                step={3}
                title="Médico Tratante"
                subtitle="Médico que realizará el procedimiento."
                hasError={errorDoctor}
              />
              <div
                className={`rounded-lg transition-colors ${errorDoctor ? 'ring-1 ring-destructive' : ''}`}
              >
                <SmartSurgeonSelector
                  value={formData.doctor}
                  onChange={handleSurgeonChange}
                  selectedHospital={formData.hospital}
                  selectedProcedureCategory={primaryProcedureCategory}
                  showLabel={false}
                  initialSurgeonData={selectedSurgeonData}
                />
              </div>
            </div>

            <Separator />

            {/* ── Paso 4: Tipo de paciente ─────────────────────── */}
            <div className="p-4 sm:p-6 space-y-4">
              <StepHeader
                step={4}
                title="Tipo de Paciente"
                subtitle="¿Cómo se cubrirán los gastos médicos?"
                hasError={errorPatientType}
              />
              <div className="relative">
                {formData.patientType && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData(prev => ({ ...prev, patientType: '' }))
                    }
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-10 h-5 w-5 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/40 flex items-center justify-center transition-colors"
                  >
                    <X className="h-3 w-3 text-foreground" />
                  </button>
                )}
                <Select
                  value={formData.patientType}
                  onValueChange={value =>
                    setFormData(prev => ({ ...prev, patientType: value }))
                  }
                >
                  <SelectTrigger
                    className={`bg-blue-300/20 ${errorPatientType ? 'border-destructive ring-1 ring-destructive' : ''}`}
                  >
                    <SelectValue placeholder="Seleccione tipo de paciente...">
                      {formData.patientType ? (
                        <span className="font-bold text-primary-500">
                          {
                            {
                              particular: 'Paciente Particular',
                              eps: 'EPS',
                              prepagada: 'Medicina Prepagada',
                              soat: 'SOAT',
                            }[formData.patientType]
                          }
                        </span>
                      ) : (
                        'Seleccione tipo de paciente...'
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-neutral-200">
                    <SelectItem value="particular">
                      Paciente Particular
                    </SelectItem>
                    <SelectItem value="eps">EPS</SelectItem>
                    <SelectItem value="prepagada">
                      Medicina Prepagada
                    </SelectItem>
                    <SelectItem value="soat">SOAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ── Botón generar ────────────────────────────────── */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                variant="hero"
                className="w-full text-base sm:text-lg py-4 sm:py-6 min-h-[52px] touch-manipulation"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white" />
                    <span className="truncate">
                      Analizando{' '}
                      {procedures.filter(p => p.procedureData).length > 1
                        ? `${procedures.filter(p => p.procedureData).length} procedimientos`
                        : procedures.find(p => p.procedureData)?.procedureData
                            ?.title || 'procedimiento'}{' '}
                      con IA...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Generar Cotización</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuotationForm;
