import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Calculator,
  Sparkles,
  TrendingUp,
  Clock,
  Activity,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import SmartProcedureSearch from './SmartProcedureSearch';
import SmartSurgeonSelector from './SmartSurgeonSelector';
import { ProcedureData } from '@/data/procedures';
import { SurgeonData } from '@/data/surgeons';
import { QuotationService } from '@/services/quotationService';

const QuotationForm = () => {
  const [formData, setFormData] = useState({
    hospital: '',
    procedure: '',
    doctor: '',
    patientType: '',
  });
  const [selectedProcedureData, setSelectedProcedureData] =
    useState<ProcedureData | null>(null);
  const [selectedSurgeonData, setSelectedSurgeonData] =
    useState<SurgeonData | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProcedureChange = (
    procedureName: string,
    procedureData?: ProcedureData
  ) => {
    setFormData(prev => ({ ...prev, procedure: procedureName }));
    setSelectedProcedureData(procedureData || null);
    if (procedureData) {
      setEstimatedCost(procedureData.estimatedCost);
    } else {
      setEstimatedCost(null);
    }

    // Clear surgeon selection when procedure changes to trigger re-filtering
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
    setFormData(prev => ({ ...prev, hospital, doctor: '' })); // Clear doctor when hospital changes
    setSelectedSurgeonData(null);
  };

  const handleGenerate = async () => {
    if (
      !formData.hospital ||
      !formData.procedure ||
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

    if (!selectedProcedureData || !selectedSurgeonData || !estimatedCost) {
      toast({
        title: 'Error de datos',
        description: 'Faltan datos del procedimiento o cirujano seleccionado',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const quotationData = await QuotationService.createQuotation({
        hospital: formData.hospital,
        procedure_name: selectedProcedureData.title,
        procedure_code: selectedProcedureData.code,
        procedure_category: selectedProcedureData.category,
        doctor_name: selectedSurgeonData.name,
        doctor_specialty: selectedSurgeonData.specialty,
        patient_type: formData.patientType as
          | 'particular'
          | 'eps'
          | 'prepagada'
          | 'soat',
        estimated_cost_min: estimatedCost.min,
        estimated_cost_max: estimatedCost.max,
        complexity: selectedProcedureData.complexity,
        duration: selectedProcedureData.estimatedDuration,
        status: 'pending',
        notes: 'Cotización generada automáticamente por IA',
      });

      const displayData = {
        ...formData,
        procedureData: selectedProcedureData,
        surgeonData: selectedSurgeonData,
        estimatedCost,
        quotationId: quotationData?.id,
      };
      localStorage.setItem('quotationData', JSON.stringify(displayData));

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

  // Procedures now handled by SmartProcedureSearch component
  // Surgeons now handled by SmartSurgeonSelector component

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

  return (
    <div>
      <div className="p-4 sm:p-6">
        <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">
          {/* Main Form Card */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl font-semibold flex items-center space-x-2">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <span>Nueva Cotización</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
              {/* Hospital Selection */}
              <div className="space-y-2">
                <Label htmlFor="hospital" className="text-base font-medium">
                  Unidad Hospitalaria
                </Label>
                <Select
                  value={formData.hospital}
                  onValueChange={handleHospitalChange}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Seleccione el hospital..." />
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

              {/* Smart Procedure Search */}
              <SmartProcedureSearch
                value={formData.procedure}
                onChange={handleProcedureChange}
                className="relative"
              />

              {/* Real-time Cost Estimation */}
              {estimatedCost && (
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-primary/20">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      <span className="font-medium text-foreground text-sm sm:text-base">
                        Estimación Inteligente
                      </span>
                      <Badge className="bg-primary text-white text-xs">
                        IA Activa
                      </Badge>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg sm:text-xl font-bold text-primary">
                        ${estimatedCost.min.toLocaleString()} - $
                        {estimatedCost.max.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Rango estimado
                      </p>
                    </div>
                  </div>
                  {selectedProcedureData && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">
                            Duración:
                          </span>
                          <span className="font-medium">
                            {selectedProcedureData.estimatedDuration}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Activity className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">
                            Complejidad:
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {selectedProcedureData.complexity}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className="text-xs">
                            CIE-9: {selectedProcedureData.code}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Smart Surgeon Selection */}
              <SmartSurgeonSelector
                value={formData.doctor}
                onChange={handleSurgeonChange}
                selectedHospital={formData.hospital}
                selectedProcedureCategory={
                  selectedProcedureData?.category || ''
                }
                className="relative"
              />

              {/* Patient Type */}
              <div className="space-y-2">
                <Label htmlFor="patientType" className="text-base font-medium">
                  Tipo de Paciente
                </Label>
                <Select
                  value={formData.patientType}
                  onValueChange={value =>
                    setFormData(prev => ({ ...prev, patientType: value }))
                  }
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Seleccione tipo de paciente..." />
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

              {/* Generate Button */}
              <div className="pt-4 sm:pt-6">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  variant="hero"
                  className="w-full text-base sm:text-lg py-4 sm:py-6 min-h-[52px] touch-manipulation"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span className="truncate">
                        Analizando{' '}
                        {selectedProcedureData?.title || 'procedimiento'} con
                        IA...
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
    </div>
  );
};

export default QuotationForm;
