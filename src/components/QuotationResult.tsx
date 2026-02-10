import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Edit3, 
  Save, 
  ArrowLeft,
  Sparkles,
  Plus,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuotationData {
  hospital: string;
  procedure: string;
  doctor: string;
  patientType: string;
}

interface Service {
  id: string;
  name: string;
  cost: number;
  description?: string;
}

interface ProcedureCosts {
  insumos: number;
  hospitalizacion: number;
  honorarios: number;
  total: number;
}

const PROCEDURE_COSTS: Record<string, ProcedureCosts> = {
  'Apendicectomía': {
    insumos: 5000,
    hospitalizacion: 18000,
    honorarios: 15000,
    total: 38000
  },
  'Hernia inguinal': {
    insumos: 7000,
    hospitalizacion: 17000,
    honorarios: 15000,
    total: 39000
  },
  'Colecistectomía laparoscópica': {
    insumos: 10000,
    hospitalizacion: 20000,
    honorarios: 20000,
    total: 50000
  },
  'Cesárea': {
    insumos: 6000,
    hospitalizacion: 14000,
    honorarios: 15000,
    total: 35000
  },
  'Reemplazo de cadera': {
    insumos: 50000,
    hospitalizacion: 70000,
    honorarios: 80000,
    total: 200000
  },
  'Reemplazo de rodilla': {
    insumos: 45000,
    hospitalizacion: 65000,
    honorarios: 75000,
    total: 185000
  },
  'Artroscopía de rodilla': {
    insumos: 12000,
    hospitalizacion: 25000,
    honorarios: 30000,
    total: 67000
  },
  'Cesárea programada': {
    insumos: 6000,
    hospitalizacion: 14000,
    honorarios: 15000,
    total: 35000
  },
  'Cirugía de columna lumbar (fusión)': {
    insumos: 40000,
    hospitalizacion: 80000,
    honorarios: 100000,
    total: 220000
  },
  'Liposucción': {
    insumos: 8000,
    hospitalizacion: 40000,
    honorarios: 60000,
    total: 108000
  }
};

const getInsumosDescription = (procedure: string): string => {
  const descriptions: Record<string, string> = {
    'Apendicectomía': 'suturas, instrumental básico',
    'Hernia inguinal': 'malla, material quirúrgico',
    'Colecistectomía laparoscópica': 'trócares, suturas, instrumental',
    'Cesárea': 'suturas, insumos obstétricos',
    'Reemplazo de cadera': 'prótesis importada',
    'Reemplazo de rodilla': 'prótesis, cementos, instrumental',
    'Artroscopía de rodilla': 'cánulas, instrumental descartable',
    'Cesárea programada': 'suturas, insumos quirúrgicos',
    'Cirugía de columna lumbar (fusión)': 'tornillos, placas, instrumental',
    'Liposucción': 'cánulas, fajas postoperatorias'
  };
  return descriptions[procedure] || 'materiales quirúrgicos';
};

const QuotationResult = () => {
  const [quotationData, setQuotationData] = useState<QuotationData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('quotationData');
    if (stored) {
      const data = JSON.parse(stored);
      setQuotationData(data);
      
      // Generate real services based on procedure
      const procedureCosts = PROCEDURE_COSTS[data.procedure];
      
      if (procedureCosts) {
        const realServices: Service[] = [
          { 
            id: '1', 
            name: 'Insumos / Materiales', 
            cost: procedureCosts.insumos,
            description: getInsumosDescription(data.procedure)
          },
          { 
            id: '2', 
            name: 'Hospitalización (estancia + quirófano)', 
            cost: procedureCosts.hospitalizacion 
          },
          { 
            id: '3', 
            name: 'Honorarios médicos (cirujano + equipo)', 
            cost: procedureCosts.honorarios 
          }
        ];
        setServices(realServices);
      } else {
        // Fallback for procedures not in our database
        const fallbackServices: Service[] = [
          { id: '1', name: 'Insumos / Materiales', cost: 10000 },
          { id: '2', name: 'Hospitalización (estancia + quirófano)', cost: 25000 },
          { id: '3', name: 'Honorarios médicos (cirujano + equipo)', cost: 20000 }
        ];
        setServices(fallbackServices);
      }
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  const totalCost = services.reduce((sum, service) => sum + service.cost, 0);

  const handleSave = () => {
    toast({
      title: "Cotización guardada",
      description: "La cotización ha sido almacenada exitosamente",
    });
    navigate('/history');
  };

  const handleExport = () => {
    toast({
      title: "Exportando cotización",
      description: "El documento se descargará en breve...",
    });
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  if (!quotationData) return null;

  return (
    <div>
      <div className="p-4">
        <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al formulario</span>
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-500">
              Cotización Generada
            </h1>
            <p className="text-muted-foreground">Análisis inteligente completado</p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={handleSave} variant="hero">
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column - Procedure Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Procedure Classification */}
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Clasificación IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Código CIE-9</p>
                  <Badge variant="secondary" className="bg-neutral-50">
                    47.09
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Descripción</p>
                  <p className="text-sm">
                    {quotationData.procedure} - Procedimiento quirúrgico mínimamente invasivo
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Complejidad</p>
                  <Badge className="bg-primary">Media</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Case Details */}
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Datos del Caso</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Hospital</p>
                  <p className="font-medium">{quotationData.hospital}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Médico</p>
                  <p className="font-medium">{quotationData.doctor}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de paciente</p>
                  <Badge variant="outline">
                    {quotationData.patientType}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Services & Cost */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Services List */}
            <Card className="">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Edit3 className="h-5 w-5 text-primary" />
                  <span>Prestaciones Sugeridas</span>
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Terminar edición' : 'Editar prestaciones'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {services.map((service) => (
                    <div 
                      key={service.id}
                      className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-border/30"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{service.name}</p>
                        {service.description && (
                          <p className="text-sm text-muted-foreground">({service.description})</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <p className="font-bold text-primary">
                          ${service.cost.toLocaleString()}
                        </p>
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeService(service.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isEditing && (
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed border-2 border-primary/30 hover:border-primary/50 text-primary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar prestación
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Total Cost */}
            <Card className="bg-primary border-primary/50 shadow-brand">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium text-primary-foreground/80">
                    Costo Total Estimado
                  </p>
                  <p className="text-4xl font-bold text-white">
                    ${totalCost.toLocaleString()}
                  </p>
                  <p className="text-sm text-primary-foreground/60">
                    Cotización generada con IA • Fecha: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
             </Card>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};

export default QuotationResult;