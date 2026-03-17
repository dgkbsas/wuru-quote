import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  Trash2,
  ChevronDown,
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from 'lucide-react';
import { QuotationService } from '@/services/quotationService';
import { type QuotationRecord } from '@/types/quotation';
import { useToast } from '@/hooks/use-toast';
import { StatusPill, complexityVariant } from '@/components/ui/status-pill';
import { PROCEDURES_DATABASE } from '@/data/procedures';
import { hospitalShortName } from '@/data/surgeons';

type SortDir = 'asc' | 'desc';
type SortKey =
  | 'fecha'
  | 'procedimiento'
  | 'medico'
  | 'hospital'
  | 'cobertura'
  | 'costo'
  | 'estado';
type SortEntry = { key: SortKey; dir: SortDir };

const STATUS_OPTIONS: { value: QuotationRecord['status']; label: string }[] = [
  { value: 'draft', label: 'Borrador' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'approved', label: 'Aprobada' },
  { value: 'rejected', label: 'Rechazada' },
  { value: 'completed', label: 'Completada' },
];

const QuotationHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortKeys, setSortKeys] = useState<SortEntry[]>([
    { key: 'fecha', dir: 'desc' },
  ]);
  const [quotations, setQuotations] = useState<QuotationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<QuotationRecord | null>(
    null
  );
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    avgValue: 0,
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Refresh data when modal closes (modal sets ?view=result)
  const modalWasOpen = useRef(false);
  const isModalOpen = searchParams.get('view') === 'result';
  useEffect(() => {
    if (modalWasOpen.current && !isModalOpen) {
      refreshData();
    }
    modalWasOpen.current = isModalOpen;
  }, [isModalOpen]);

  useEffect(() => {
    const loadQuotations = async () => {
      try {
        setIsLoading(true);
        const [quotationsResult, statsResult] = await Promise.all([
          QuotationService.getQuotations(50, 0),
          QuotationService.getQuotationStats(),
        ]);

        setQuotations(quotationsResult.quotations);
        setStats({
          total: statsResult.total,
          pending: statsResult.pending,
          approved: statsResult.approved,
          completed: statsResult.completed,
          avgValue: statsResult.avgValue,
        });
      } catch (error) {
        console.error('Error loading quotations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuotations();
  }, []);

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [quotationsResult, statsResult] = await Promise.all([
        QuotationService.getQuotations(50, 0),
        QuotationService.getQuotationStats(),
      ]);

      setQuotations(quotationsResult.quotations);
      setStats({
        total: statsResult.total,
        pending: statsResult.pending,
        approved: statsResult.approved,
        completed: statsResult.completed,
        avgValue: statsResult.avgValue,
      });
    } catch (error) {
      console.error('Error refreshing quotations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: QuotationRecord['status']
  ) => {
    // Optimistic update
    setQuotations(prev =>
      prev.map(q => (q.id === id ? { ...q, status: newStatus } : q))
    );
    try {
      await QuotationService.updateQuotationStatus(id, newStatus);
      toast({
        title: 'Estado actualizado',
        description: `Cotización marcada como ${STATUS_OPTIONS.find(s => s.value === newStatus)?.label}`,
      });
    } catch {
      // Revert on error
      refreshData();
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    // Optimistic remove
    setQuotations(prev => prev.filter(q => q.id !== id));
    try {
      await QuotationService.deleteQuotation(id);
      toast({
        title: 'Cotización eliminada',
        description: 'La cotización fue eliminada exitosamente',
      });
    } catch {
      refreshData();
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la cotización',
        variant: 'destructive',
      });
    }
  };

  const displayQuotations = quotations;

  const filteredQuotations = displayQuotations.filter(quote => {
    const searchFields = [
      quote.procedure_name || '',
      quote.doctor_name || '',
      quote.hospital || '',
    ]
      .join(' ')
      .toLowerCase();

    const matchesSearch = searchFields.includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || quote.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const sortedQuotations = [...filteredQuotations].sort((a, b) => {
    for (const { key, dir } of sortKeys) {
      let cmp = 0;
      switch (key) {
        case 'fecha':
          cmp =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'procedimiento':
          cmp = a.procedure_name.localeCompare(b.procedure_name, 'es');
          break;
        case 'medico':
          cmp = a.doctor_name.localeCompare(b.doctor_name, 'es');
          break;
        case 'hospital':
          cmp = a.hospital.localeCompare(b.hospital, 'es');
          break;
        case 'cobertura':
          cmp = a.patient_type.localeCompare(b.patient_type, 'es');
          break;
        case 'costo':
          cmp =
            (a.estimated_cost_min + a.estimated_cost_max) / 2 -
            (b.estimated_cost_min + b.estimated_cost_max) / 2;
          break;
        case 'estado': {
          const ORDER: Record<string, number> = {
            draft: 0,
            pending: 1,
            approved: 2,
            rejected: 3,
            completed: 4,
            exported: 5,
          };
          cmp = (ORDER[a.status] ?? 99) - (ORDER[b.status] ?? 99);
          break;
        }
      }
      if (cmp !== 0) return dir === 'asc' ? cmp : -cmp;
    }
    return 0;
  });

  const handleView = (quotation: QuotationRecord) => {
    const displayData = {
      id: quotation.id,
      hospital: quotation.hospital,
      procedure: quotation.procedure_name,
      doctor: quotation.doctor_name,
      patientType: quotation.patient_type,
      status: quotation.status,
      isViewOnly: true,
      totalEstimatedCost: {
        min: quotation.estimated_cost_min,
        max: quotation.estimated_cost_max,
      },
      estimatedCost: {
        min: quotation.estimated_cost_min,
        max: quotation.estimated_cost_max,
      },
      procedures: quotation.procedures?.length
        ? quotation.procedures.map(p => {
            const db = PROCEDURES_DATABASE.find(d => d.code === p.code);
            return {
              id: p.id,
              procedure: p.title,
              procedureData: db
                ? {
                    title: db.title,
                    code: db.code,
                    complexity: db.complexity,
                    estimatedDuration: db.estimatedDuration,
                    category: db.category,
                    estimatedCost: db.estimatedCost,
                    riskLevel: db.riskLevel,
                  }
                : {
                    title: p.title,
                    code: p.code,
                    complexity: quotation.complexity,
                    estimatedDuration: quotation.duration,
                    category: p.category,
                    estimatedCost: {
                      min: quotation.estimated_cost_min,
                      max: quotation.estimated_cost_max,
                    },
                  },
              estimatedCost: db
                ? db.estimatedCost
                : {
                    min: quotation.estimated_cost_min,
                    max: quotation.estimated_cost_max,
                  },
            };
          })
        : [
            {
              id: quotation.id,
              procedure: quotation.procedure_name,
              procedureData: {
                title: quotation.procedure_name,
                code: quotation.procedure_code,
                complexity: quotation.complexity,
                estimatedDuration: quotation.duration,
                category: quotation.procedure_category,
                estimatedCost: {
                  min: quotation.estimated_cost_min,
                  max: quotation.estimated_cost_max,
                },
              },
              estimatedCost: {
                min: quotation.estimated_cost_min,
                max: quotation.estimated_cost_max,
              },
            },
          ],
      prestaciones: quotation.prestaciones,
    };
    localStorage.setItem('quotationData', JSON.stringify(displayData));
    navigate('?view=result');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <StatusPill label="Completada" variant="emerald" />;
      case 'approved':
        return <StatusPill label="Aprobada" variant="blue" />;
      case 'pending':
        return <StatusPill label="Pendiente" variant="yellow" />;
      case 'rejected':
        return <StatusPill label="Rechazada" variant="red" />;
      case 'exported':
        return <StatusPill label="Exportada" variant="teal" />;
      case 'draft':
        return <StatusPill label="Borrador" variant="gray" />;
      default:
        return <StatusPill label="Desconocido" variant="gray" />;
    }
  };

  const renderStatusDropdown = (quotation: QuotationRecord) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="shrink-0 flex items-center gap-1 px-1 pr-2 py-1 rounded-full border border-border bg-blue-300/20 hover:bg-blue-300/30 transition-colors cursor-pointer">
            {getStatusBadge(quotation.status)}
            <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {STATUS_OPTIONS.filter(opt => opt.value !== quotation.status).map(
            opt => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => handleStatusChange(quotation.id, opt.value)}
              >
                {getStatusBadge(opt.value)}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const handleSort = (key: SortKey, e: React.MouseEvent) => {
    if (e.shiftKey) {
      setSortKeys(prev => {
        const existing = prev.find(s => s.key === key);
        if (existing) {
          return prev.map(s =>
            s.key === key ? { ...s, dir: s.dir === 'asc' ? 'desc' : 'asc' } : s
          );
        }
        return [...prev, { key, dir: 'asc' }];
      });
    } else {
      setSortKeys(prev => {
        const existing = prev.find(s => s.key === key);
        if (existing && prev.length === 1) {
          return [{ key, dir: existing.dir === 'asc' ? 'desc' : 'asc' }];
        }
        return [{ key, dir: 'asc' }];
      });
    }
  };

  const totalCotizaciones = stats.total || displayQuotations.length;
  const totalMonto = displayQuotations.reduce(
    (sum, q) => sum + ((q.estimated_cost_min + q.estimated_cost_max) / 2 || 0),
    0
  );
  const avgMonto = totalCotizaciones > 0 ? totalMonto / totalCotizaciones : 0;

  return (
    <div>
      <div className="p-3 sm:p-4">
        <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
          {/* Header - responsive stacked on mobile */}
          <div className="space-y-3 flex justify-between items-center ">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-3xl font-bold text-primary-500">
                Historial de Cotizaciones
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Registro completo de cotizaciones generadas
              </p>
            </div>

            <div className="flex items-center justify-end">
              <div className="flex gap-2">
                <Button onClick={refreshData} variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Actualizar</span>
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="hero"
                  size="sm"
                >
                  <span className="hidden sm:inline">Nueva Cotización</span>
                  <span className="sm:hidden">Nueva</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Card>
              <CardContent className="p-3 sm:pt-6 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:space-x-3 text-center sm:text-left">
                  <Calendar className="h-5 w-5 sm:h-8 sm:w-8 text-primary" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold">
                      {totalCotizaciones}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Cotizaciones
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:pt-6 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:space-x-3 text-center sm:text-left">
                  <TrendingUp className="h-5 w-5 sm:h-8 sm:w-8 text-primary" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      $
                      {totalMonto.toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Total
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:pt-6 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:space-x-3 text-center sm:text-left">
                  <Download className="h-5 w-5 sm:h-8 sm:w-8 text-primary" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold truncate">
                      $
                      {avgMonto.toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Promedio
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <div className="flex flex-col gap-3">
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span>Filtros y Búsqueda</span>
                </CardTitle>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10 pr-8 w-full bg-blue-300/20"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/40 flex items-center justify-center transition-colors"
                      >
                        <X className="h-3 w-3 text-foreground" />
                      </button>
                    )}
                  </div>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="sm:w-40 bg-blue-300/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="draft">Borradores</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="approved">Aprobadas</SelectItem>
                      <SelectItem value="completed">Completadas</SelectItem>
                      <SelectItem value="rejected">Rechazadas</SelectItem>
                      <SelectItem value="exported">Exportadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Cotizaciones - Table on desktop, Cards on mobile */}
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span>Cotizaciones Recientes</span>
                <span className="text-sm text-muted-foreground font-normal">
                  {quotations.length > 0 &&
                    `${quotations.length} registro${quotations.length !== 1 ? 's' : ''}`}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              {/* Loading state */}
              {isLoading && (
                <div className="flex items-center justify-center space-x-2 py-8">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <span>Cargando cotizaciones...</span>
                </div>
              )}

              {/* Empty state */}
              {!isLoading && sortedQuotations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {quotations.length === 0 ? (
                    <div className="space-y-2">
                      <p>No hay cotizaciones en la base de datos</p>
                      <Button onClick={refreshData} variant="outline" size="sm">
                        Cargar datos
                      </Button>
                    </div>
                  ) : (
                    'No se encontraron cotizaciones que coincidan con los filtros'
                  )}
                </div>
              )}

              {/* Mobile: sort bar */}
              {!isLoading && sortedQuotations.length > 0 && (
                <div className="flex items-center gap-2 lg:hidden mb-2">
                  <Select
                    value={sortKeys[0]?.key ?? 'fecha'}
                    onValueChange={key =>
                      setSortKeys([
                        {
                          key: key as SortKey,
                          dir: sortKeys[0]?.dir ?? 'desc',
                        },
                      ])
                    }
                  >
                    <SelectTrigger className="flex-1 h-8 text-xs bg-blue-300/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fecha">Fecha</SelectItem>
                      <SelectItem value="procedimiento">
                        Procedimiento
                      </SelectItem>
                      <SelectItem value="medico">Médico</SelectItem>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="cobertura">Cobertura</SelectItem>
                      <SelectItem value="costo">Costo</SelectItem>
                      <SelectItem value="estado">Estado</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() =>
                      setSortKeys(prev => [
                        {
                          key: prev[0]?.key ?? 'fecha',
                          dir: prev[0]?.dir === 'asc' ? 'desc' : 'asc',
                        },
                      ])
                    }
                    className="h-8 w-8 flex items-center justify-center rounded border border-border bg-blue-300/20 hover:bg-blue-300/30 transition-colors shrink-0"
                    title={
                      sortKeys[0]?.dir === 'asc' ? 'Ascendente' : 'Descendente'
                    }
                  >
                    {(sortKeys[0]?.key === 'fecha' ? sortKeys[0]?.dir === 'desc' : sortKeys[0]?.dir === 'asc') ? (
                      <ArrowDown className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <ArrowUp className="h-3.5 w-3.5 text-primary" />
                    )}
                  </button>
                </div>
              )}

              {/* Mobile: Card list */}
              {!isLoading && sortedQuotations.length > 0 && (
                <div className="space-y-3 lg:hidden">
                  {sortedQuotations.map(quotation => (
                    <div
                      key={quotation.id}
                      className="flex gap-3 p-3 rounded-lg border border-border/30 bg-neutral-50"
                    >
                      {/* Left: main info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-[10px] text-muted-foreground tabular-nums">
                          {new Date(quotation.created_at).toLocaleDateString(
                            'es-MX',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            }
                          )}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {(quotation.procedures &&
                          quotation.procedures.length > 0
                            ? quotation.procedures.map(p => p.title)
                            : quotation.procedure_name.split(' + ')
                          ).map((title, i) => (
                            <StatusPill key={i} label={title} variant="blue" />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {quotation.doctor_name} · {quotation.hospital}
                        </p>
                        <StatusPill
                          label={quotation.patient_type}
                          variant="gray"
                        />
                      </div>

                      {/* Right: estado + costo + acciones */}
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        {renderStatusDropdown(quotation)}
                        <p className="font-bold text-primary text-sm tabular-nums">
                          $
                          {(
                            (quotation.estimated_cost_min +
                              quotation.estimated_cost_max) /
                            2
                          ).toLocaleString('es-MX', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 bg-blue-300/20 hover:bg-blue-300/30"
                            onClick={() => handleView(quotation)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 bg-blue-300/20 hover:bg-blue-300/30"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 bg-blue-300/20 hover:bg-red-50 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(quotation)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Desktop: Table */}
              {!isLoading && sortedQuotations.length > 0 && (
                <div className="hidden lg:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50">
                        {(
                          [
                            { key: 'fecha', label: 'Fecha', align: '' },
                            {
                              key: 'procedimiento',
                              label: 'Procedimiento',
                              align: '',
                            },
                            { key: 'medico', label: 'Médico', align: '' },
                            { key: 'hospital', label: 'Hospital', align: '' },
                            {
                              key: 'cobertura',
                              label: 'Cobertura',
                              align: 'text-center',
                            },
                            {
                              key: 'costo',
                              label: 'Costo Total',
                              align: 'text-right',
                            },
                            {
                              key: 'estado',
                              label: 'Estado',
                              align: 'text-center',
                            },
                          ] as { key: SortKey; label: string; align: string }[]
                        ).map(({ key, label, align }) => {
                          const entry = sortKeys.find(s => s.key === key);
                          const idx = sortKeys.findIndex(s => s.key === key);
                          return (
                            <TableHead
                              key={key}
                              className={`${align} select-none cursor-pointer hover:bg-muted/40 transition-colors`}
                              onClick={e => handleSort(key, e)}
                              title="Shift+clic para orden múltiple"
                            >
                              <span className="inline-flex items-center gap-1">
                                {label}
                                {entry ? (
                                  // fecha: natural=desc(newest first)→↓; otros: natural=asc→↓
                                  (key === 'fecha' ? entry.dir === 'desc' : entry.dir === 'asc') ? (
                                    <ArrowDown className="h-3 w-3 text-primary shrink-0" />
                                  ) : (
                                    <ArrowUp className="h-3 w-3 text-primary shrink-0" />
                                  )
                                ) : (
                                  <ArrowUpDown className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                                )}
                                {sortKeys.length > 1 && entry && (
                                  <span className="text-[9px] font-bold text-white bg-primary rounded-full w-3.5 h-3.5 flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                )}
                              </span>
                            </TableHead>
                          );
                        })}
                        <TableHead className="text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedQuotations.map(quotation => (
                        <TableRow
                          key={quotation.id}
                          className="border-border/30"
                        >
                          <TableCell className="font-medium">
                            {new Date(quotation.created_at).toLocaleDateString(
                              'es-MX',
                              {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              }
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {(quotation.procedures &&
                              quotation.procedures.length > 0
                                ? quotation.procedures.map(p => p.title)
                                : quotation.procedure_name.split(' + ')
                              ).map((title, i) => (
                                <StatusPill
                                  key={i}
                                  label={title}
                                  variant="blue"
                                />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{quotation.doctor_name}</TableCell>
                          <TableCell className="text-sm">
                            {hospitalShortName(quotation.hospital)}
                          </TableCell>
                          <TableCell className="text-center">
                            <StatusPill
                              label={quotation.patient_type}
                              variant="gray"
                            />
                          </TableCell>
                          <TableCell className="text-right font-bold text-primary tabular-nums">
                            $
                            {(
                              (quotation.estimated_cost_min +
                                quotation.estimated_cost_max) /
                              2
                            ).toLocaleString('es-MX', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell className="text-center">
                            {renderStatusDropdown(quotation)}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="bg-blue-300/20 hover:bg-blue-300/30"
                                onClick={() => handleView(quotation)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="bg-blue-300/20 hover:bg-blue-300/30"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="bg-blue-300/20 hover:bg-red-50 text-destructive hover:text-destructive"
                                onClick={() => setDeleteTarget(quotation)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={open => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar cotización</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la
              cotización
              {deleteTarget && ` de "${deleteTarget.procedure_name}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuotationHistory;
