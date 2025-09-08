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
import Navigation from './Navigation';
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
        console.log('📊 Loading quotations from Supabase...');
        setIsLoading(true);
        const [quotationsResult, statsResult] = await Promise.all([
          QuotationService.getQuotations(50, 0), // Get last 50 quotations
          QuotationService.getQuotationStats()
        ]);
        
        console.log('📊 Quotations loaded:', quotationsResult.quotations.length);
        console.log('📊 Raw quotations data:', quotationsResult.quotations);
        console.log('📊 Stats:', statsResult);
        
        setQuotations(quotationsResult.quotations);
        setStats({
          total: statsResult.total,
          pending: statsResult.pending,
          approved: statsResult.approved,
          completed: statsResult.completed,
          avgValue: statsResult.avgValue
        });
      } catch (error) {
        console.error('❌ Error loading quotations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuotations();
  }, []);

  // Add function to refresh data
  const refreshData = async () => {
    try {
      console.log('🔄 Refreshing quotations data...');
      setIsLoading(true);
      const [quotationsResult, statsResult] = await Promise.all([
        QuotationService.getQuotations(50, 0),
        QuotationService.getQuotationStats()
      ]);
      
      console.log('📊 Refreshed quotations:', quotationsResult.quotations.length);
      
      setQuotations(quotationsResult.quotations);
      setStats({
        total: statsResult.total,
        pending: statsResult.pending,
        approved: statsResult.approved,
        completed: statsResult.completed,
        avgValue: statsResult.avgValue
      });
    } catch (error) {
      console.error('❌ Error refreshing quotations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Expose refresh function to window for debugging
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).refreshQuotations = refreshData;
  }, [refreshData]);

  // Mock historical data (keep as fallback)
  const mockQuotations: QuotationRecord[] = [
    {
      id: '001',
      date: '2024-01-15',
      procedure: 'Apendicectomía laparoscópica',
      doctor: 'Dr. Carlos Andrés Herrera',
      hospital: 'Hospital Pablo Tobón Uribe',
      patientType: 'EPS',
      totalCost: 5920000,
      status: 'completed'
    },
    {
      id: '002', 
      date: '2024-01-14',
      procedure: 'Colecistectomía laparoscópica',
      doctor: 'Dra. María Fernanda García',
      hospital: 'Clínica Las Américas',
      patientType: 'Prepagada',
      totalCost: 7350000,
      status: 'exported'
    },
    {
      id: '003',
      date: '2024-01-12',
      procedure: 'Herniorrafia inguinal',
      doctor: 'Dr. Ricardo Alejandro Morales',
      hospital: 'Hospital Universitario San Vicente Fundación',
      patientType: 'Particular',
      totalCost: 4280000,
      status: 'pending'
    },
    {
      id: '004',
      date: '2024-01-11',
      procedure: 'Bypass gástrico laparoscópico',
      doctor: 'Dr. Luis Eduardo Ramírez',
      hospital: 'Clínica Medellín',
      patientType: 'Prepagada',
      totalCost: 18500000,
      status: 'completed'
    },
    {
      id: '005',
      date: '2024-01-10',
      procedure: 'Tiroidectomía total',
      doctor: 'Dra. Ana Sofía Jiménez',
      hospital: 'Hospital General de Medellín',
      patientType: 'EPS',
      totalCost: 8750000,
      status: 'exported'
    },
    {
      id: '006',
      date: '2024-01-09',
      procedure: 'Resección de tumor cerebral',
      doctor: 'Dr. Fernando Andrés Silva',
      hospital: 'Instituto Neurológico de Colombia',
      patientType: 'Particular',
      totalCost: 25800000,
      status: 'completed'
    },
    {
      id: '007',
      date: '2024-01-08',
      procedure: 'Artroscopia de rodilla',
      doctor: 'Dr. Miguel Ángel Vargas',
      hospital: 'Clínica El Rosario',
      patientType: 'Prepagada',
      totalCost: 6200000,
      status: 'pending'
    },
    {
      id: '008',
      date: '2024-01-07',
      procedure: 'Cesárea electiva',
      doctor: 'Dra. Carmen Lucía Ospina',
      hospital: 'Clínica del Prado',
      patientType: 'EPS',
      totalCost: 3850000,
      status: 'completed'
    },
    {
      id: '009',
      date: '2024-01-06',
      procedure: 'Cateterismo cardíaco',
      doctor: 'Dr. Jairo Alberto Cardona',
      hospital: 'Clínica CardioVID',
      patientType: 'Prepagada',
      totalCost: 12400000,
      status: 'exported'
    },
    {
      id: '010',
      date: '2024-01-05',
      procedure: 'Trasplante renal',
      doctor: 'Dr. Rodrigo Esteban Mejía',
      hospital: 'Hospital Pablo Tobón Uribe',
      patientType: 'Particular',
      totalCost: 45000000,
      status: 'pending'
    }
  ];

  // Always use real quotations from Supabase, only fallback if there's an error loading
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
        return <Badge className="bg-purple-600">Exportada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const totalCotizaciones = stats.total || displayQuotations.length;
  const totalMonto = stats.totalValue || displayQuotations.reduce((sum, q) => 
    sum + ((q.estimated_cost_min + q.estimated_cost_max) / 2 || 0), 0);
  const avgMonto = totalCotizaciones > 0 ? totalMonto / totalCotizaciones : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-wuru-bg-primary to-wuru-bg-secondary">
      <Navigation />
      <div className="p-4">
        <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al inicio</span>
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Historial de Cotizaciones
            </h1>
            <p className="text-muted-foreground">Registro completo de cotizaciones generadas</p>
          </div>
          
          
          <div className="flex space-x-2">
            <Button 
              onClick={refreshData}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Actualizar</span>
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="hero"
            >
              Nueva Cotización
            </Button>
          </div>
        </div>


        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-wuru-purple" />
                <div>
                  <p className="text-2xl font-bold">{totalCotizaciones}</p>
                  <p className="text-sm text-muted-foreground">Cotizaciones</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-wuru-purple" />
                <div>
                  <p className="text-2xl font-bold">${totalMonto.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Facturado</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Download className="h-8 w-8 text-wuru-purple" />
                <div>
                  <p className="text-2xl font-bold">${avgMonto.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Promedio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-wuru-purple" />
                <span>Filtros y Búsqueda</span>
              </CardTitle>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar procedimiento o médico..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-wuru-bg-tertiary border-border/50 w-full sm:w-80"
                  />
                </div>
                
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-wuru-bg-tertiary border border-border/50 rounded-md text-foreground"
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

        {/* History Table */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Cotizaciones Recientes</span>
              <span className="text-sm text-muted-foreground">
                {quotations.length > 0 && `${quotations.length} registro${quotations.length !== 1 ? 's' : ''}`}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-wuru-purple"></div>
                          <span>Cargando cotizaciones...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredQuotations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuotations.map((quotation) => (
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
                        <TableCell className="font-bold text-wuru-purple">
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);
};

export default QuotationHistory;