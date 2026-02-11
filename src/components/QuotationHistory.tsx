import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Filter,
  ArrowLeft,
  Download,
  Eye,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { QuotationService } from '@/services/quotationService';
import { type QuotationRecord } from '@/lib/supabase';

const QuotationHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [quotations, setQuotations] = useState<QuotationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    avgValue: 0
  });
  const navigate = useNavigate();

  // Load quotations from Supabase
  useEffect(() => {
    const loadQuotations = async () => {
      try {
        console.log('Loading quotations from Supabase...');
        setIsLoading(true);
        const [quotationsResult, statsResult] = await Promise.all([
          QuotationService.getQuotations(50, 0),
          QuotationService.getQuotationStats()
        ]);

        setQuotations(quotationsResult.quotations);
        setStats({
          total: statsResult.total,
          pending: statsResult.pending,
          approved: statsResult.approved,
          completed: statsResult.completed,
          avgValue: statsResult.avgValue
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
        QuotationService.getQuotationStats()
      ]);

      setQuotations(quotationsResult.quotations);
      setStats({
        total: statsResult.total,
        pending: statsResult.pending,
        approved: statsResult.approved,
        completed: statsResult.completed,
        avgValue: statsResult.avgValue
      });
    } catch (error) {
      console.error('Error refreshing quotations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayQuotations = quotations;

  const filteredQuotations = displayQuotations.filter(quote => {
    const searchFields = [
      quote.procedure_name || '',
      quote.doctor_name || '',
      quote.hospital || ''
    ].join(' ').toLowerCase();

    const matchesSearch = searchFields.includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || quote.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-600">Completada</Badge>;
      case 'approved':
        return <Badge className="bg-blue-600">Aprobada</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600">Rechazada</Badge>;
      case 'exported':
        return <Badge className="bg-blue-600">Exportada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const totalCotizaciones = stats.total || displayQuotations.length;
  const totalMonto = displayQuotations.reduce((sum, q) =>
    sum + ((q.estimated_cost_min + q.estimated_cost_max) / 2 || 0), 0);
  const avgMonto = totalCotizaciones > 0 ? totalMonto / totalCotizaciones : 0;

  return (
    <div>
      <div className="p-3 sm:p-4">
        <div className="max-w-[1200px] mx-auto space-y-4 sm:space-y-6">

        {/* Header - responsive stacked on mobile */}
        <div className="space-y-3">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-3xl font-bold text-primary-500">
              Historial de Cotizaciones
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Registro completo de cotizaciones generadas</p>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Volver al inicio</span>
              <span className="sm:hidden">Volver</span>
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={refreshData}
                variant="outline"
                size="sm"
              >
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
                  <p className="text-lg sm:text-2xl font-bold">{totalCotizaciones}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Cotizaciones</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:pt-6 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:space-x-3 text-center sm:text-left">
                <TrendingUp className="h-5 w-5 sm:h-8 sm:w-8 text-primary" />
                <div>
                  <p className="text-lg sm:text-2xl font-bold truncate">${totalMonto.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:pt-6 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:space-x-3 text-center sm:text-left">
                <Download className="h-5 w-5 sm:h-8 sm:w-8 text-primary" />
                <div>
                  <p className="text-lg sm:text-2xl font-bold truncate">${avgMonto.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Promedio</p>
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-md text-foreground text-sm"
                >
                  <option value="all">Todos</option>
                  <option value="completed">Completadas</option>
                  <option value="pending">Pendientes</option>
                  <option value="exported">Exportadas</option>
                </select>
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
                {quotations.length > 0 && `${quotations.length} registro${quotations.length !== 1 ? 's' : ''}`}
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
            {!isLoading && filteredQuotations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {quotations.length === 0 ? (
                  <div className="space-y-2">
                    <p>No hay cotizaciones en la base de datos</p>
                    <Button onClick={refreshData} variant="outline" size="sm">
                      Cargar datos
                    </Button>
                  </div>
                ) : (
                  "No se encontraron cotizaciones que coincidan con los filtros"
                )}
              </div>
            )}

            {/* Mobile: Card list */}
            {!isLoading && filteredQuotations.length > 0 && (
              <div className="space-y-3 lg:hidden">
                {filteredQuotations.map((quotation) => (
                  <div
                    key={quotation.id}
                    className="p-3 rounded-lg border border-border/30 bg-neutral-50 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{quotation.procedure_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{quotation.doctor_name}</p>
                      </div>
                      {getStatusBadge(quotation.status)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate max-w-[50%]">{quotation.hospital}</span>
                      <span>{new Date(quotation.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {quotation.patient_type}
                        </Badge>
                      </div>
                      <p className="font-bold text-primary text-sm">
                        ${((quotation.estimated_cost_min + quotation.estimated_cost_max) / 2).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex justify-end gap-1 pt-1 border-t border-border/20">
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Desktop: Table */}
            {!isLoading && filteredQuotations.length > 0 && (
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Fecha</TableHead>
                      <TableHead>Procedimiento</TableHead>
                      <TableHead>Médico</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Costo Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotations.map((quotation) => (
                      <TableRow key={quotation.id} className="border-border/30">
                        <TableCell className="font-medium">
                          {new Date(quotation.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{quotation.procedure_name}</TableCell>
                        <TableCell>{quotation.doctor_name}</TableCell>
                        <TableCell className="text-sm">{quotation.hospital}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {quotation.patient_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-primary">
                          ${((quotation.estimated_cost_min + quotation.estimated_cost_max) / 2).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(quotation.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
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
  </div>
);
};

export default QuotationHistory;
