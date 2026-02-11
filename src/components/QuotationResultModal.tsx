import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
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
  Edit3,
  Save,
  Sparkles,
  Plus,
  X,
  Check,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QuotationService } from '@/services/quotationService';

interface QuotationData {
  id?: string;
  hospital: string;
  procedure: string;
  doctor: string;
  patientType: string;
  status?: string;
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
    total: 38000,
  },
  'Hernia inguinal': {
    insumos: 7000,
    hospitalizacion: 17000,
    honorarios: 15000,
    total: 39000,
  },
  'Colecistectomía laparoscópica': {
    insumos: 10000,
    hospitalizacion: 20000,
    honorarios: 20000,
    total: 50000,
  },
  'Cesárea': {
    insumos: 6000,
    hospitalizacion: 14000,
    honorarios: 15000,
    total: 35000,
  },
  'Reemplazo de cadera': {
    insumos: 50000,
    hospitalizacion: 70000,
    honorarios: 80000,
    total: 200000,
  },
  'Reemplazo de rodilla': {
    insumos: 45000,
    hospitalizacion: 65000,
    honorarios: 75000,
    total: 185000,
  },
  'Artroscopía de rodilla': {
    insumos: 12000,
    hospitalizacion: 25000,
    honorarios: 30000,
    total: 67000,
  },
  'Cesárea programada': {
    insumos: 6000,
    hospitalizacion: 14000,
    honorarios: 15000,
    total: 35000,
  },
  'Cirugía de columna lumbar (fusión)': {
    insumos: 40000,
    hospitalizacion: 80000,
    honorarios: 100000,
    total: 220000,
  },
  'Liposucción': {
    insumos: 8000,
    hospitalizacion: 40000,
    honorarios: 60000,
    total: 108000,
  },
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
    'Liposucción': 'cánulas, fajas postoperatorias',
  };
  return descriptions[procedure] || 'materiales quirúrgicos';
};

const QuotationResultModal = () => {
  const [quotationData, setQuotationData] = useState<QuotationData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCostId, setEditingCostId] = useState<string | null>(null);
  const [editingCostValue, setEditingCostValue] = useState('');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const isOpen = searchParams.get('view') === 'result';
  const isPending = quotationData?.status === 'pending';

  useEffect(() => {
    if (!isOpen) return;

    const stored = localStorage.getItem('quotationData');
    if (stored) {
      const data = JSON.parse(stored);
      setQuotationData(data);

      const procedureCosts = PROCEDURE_COSTS[data.procedure];

      if (procedureCosts) {
        const realServices: Service[] = [
          {
            id: '1',
            name: 'Insumos / Materiales',
            cost: procedureCosts.insumos,
            description: getInsumosDescription(data.procedure),
          },
          {
            id: '2',
            name: 'Hospitalización (estancia + quirófano)',
            cost: procedureCosts.hospitalizacion,
          },
          {
            id: '3',
            name: 'Honorarios médicos (cirujano + equipo)',
            cost: procedureCosts.honorarios,
          },
        ];
        setServices(realServices);
      } else {
        const fallbackServices: Service[] = [
          { id: '1', name: 'Insumos / Materiales', cost: 10000 },
          { id: '2', name: 'Hospitalización (estancia + quirófano)', cost: 25000 },
          { id: '3', name: 'Honorarios médicos (cirujano + equipo)', cost: 20000 },
        ];
        setServices(fallbackServices);
      }
    } else {
      setSearchParams({});
    }
  }, [isOpen, setSearchParams]);

  const totalCost = services.reduce((sum, service) => sum + service.cost, 0);

  const handleClose = () => {
    setIsEditing(false);
    setEditingCostId(null);
    setSearchParams({});
  };

  const handleSave = async () => {
    if (quotationData?.id && isPending) {
      const notesContent = services.map(s => `${s.name}: $${s.cost.toLocaleString()}`).join('; ');
      await QuotationService.updateQuotationStatus(quotationData.id, 'pending', notesContent);
    }
    toast({
      title: 'Cotización guardada',
      description: 'La cotización ha sido almacenada exitosamente',
    });
    navigate('/history');
  };

  const handleExport = () => {
    toast({
      title: 'Exportando cotización',
      description: 'El documento se descargará en breve...',
    });
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const startEditingCost = (service: Service) => {
    setEditingCostId(service.id);
    setEditingCostValue(String(service.cost));
  };

  const confirmEditCost = (id: string) => {
    const newCost = parseFloat(editingCostValue);
    if (!isNaN(newCost) && newCost >= 0) {
      setServices(prev =>
        prev.map(s => (s.id === id ? { ...s, cost: newCost } : s))
      );
    }
    setEditingCostId(null);
    setEditingCostValue('');
  };

  const cancelEditCost = () => {
    setEditingCostId(null);
    setEditingCostValue('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) handleClose(); }}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-primary-500">
            Cotización Generada
          </DialogTitle>
          <DialogDescription>
            Análisis inteligente completado
          </DialogDescription>
        </DialogHeader>

        {quotationData && (
          <div className="px-6 pb-0">
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Left Column - Classification + Case Details */}
              <div className="lg:col-span-1 space-y-4">
                {/* AI Classification */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span>Clasificación IA</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Código CIE-9</p>
                      <Badge variant="secondary" className="bg-neutral-50">
                        47.09
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Descripción</p>
                      <p className="text-sm">
                        {quotationData.procedure} - Procedimiento quirúrgico mínimamente invasivo
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Complejidad</p>
                      <Badge className="bg-primary">Media</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Case Details */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <FileText className="h-5 w-5 text-primary" />
                      <span>Datos del Caso</span>
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
                      <p className="text-sm text-muted-foreground">Tipo de paciente</p>
                      <Badge variant="outline">{quotationData.patientType}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Services + Total Cost */}
              <div className="lg:col-span-2 space-y-4">
                {/* Services List */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <Edit3 className="h-5 w-5 text-primary" />
                      <span>Prestaciones Sugeridas</span>
                    </CardTitle>
                    {isPending && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? 'Terminar edición' : 'Editar prestaciones'}
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {services.map(service => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-border/30"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{service.name}</p>
                            {service.description && (
                              <p className="text-sm text-muted-foreground">
                                ({service.description})
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            {editingCostId === service.id ? (
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-primary">$</span>
                                <Input
                                  type="number"
                                  value={editingCostValue}
                                  onChange={(e) => setEditingCostValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') confirmEditCost(service.id);
                                    if (e.key === 'Escape') cancelEditCost();
                                  }}
                                  className="w-28 h-8 text-right"
                                  autoFocus
                                />
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => confirmEditCost(service.id)}>
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={cancelEditCost}>
                                  <X className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            ) : (
                              <p
                                className={`font-bold text-primary ${isPending && isEditing ? 'cursor-pointer hover:underline' : ''}`}
                                onClick={() => { if (isPending && isEditing) startEditingCost(service); }}
                              >
                                ${service.cost.toLocaleString()}
                              </p>
                            )}
                            {isEditing && editingCostId !== service.id && (
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
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-medium text-primary-foreground/80">
                        Costo Total Estimado
                      </p>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                          ${totalCost.toLocaleString()}
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

        {/* Sticky footer with action buttons */}
        <div className="sticky bottom-0 bg-background border-t px-6 py-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleSave} variant="hero" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuotationResultModal;
