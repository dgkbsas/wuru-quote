import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calculator, Sparkles, TrendingUp, Clock, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navigation from './Navigation';
import SmartProcedureSearch from './SmartProcedureSearch';
import SmartSurgeonSelector from './SmartSurgeonSelector';
import { ProcedureData } from '@/data/procedures';
import { SurgeonData } from '@/data/surgeons';

const QuotationForm = () => {
  const [formData, setFormData] = useState({
    hospital: '',
    procedure: '',
    doctor: '',
    patientType: ''
  });
  const [selectedProcedureData, setSelectedProcedureData] = useState<ProcedureData | null>(null);
  const [selectedSurgeonData, setSelectedSurgeonData] = useState<SurgeonData | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<{min: number, max: number} | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProcedureChange = (procedureName: string, procedureData?: ProcedureData) => {
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

  const handleSurgeonChange = (surgeonName: string, surgeonData?: SurgeonData) => {
    setFormData(prev => ({ ...prev, doctor: surgeonName }));
    setSelectedSurgeonData(surgeonData || null);
  };

  const handleHospitalChange = (hospital: string) => {
    setFormData(prev => ({ ...prev, hospital, doctor: '' })); // Clear doctor when hospital changes
    setSelectedSurgeonData(null);
  };

  const handleGenerate = async () => {
    if (!formData.hospital || !formData.procedure || !formData.doctor || !formData.patientType) {
      toast({
        title: "Campos incompletos",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store form data, procedure data, and surgeon data in localStorage for the result page
    const quotationData = {
      ...formData,
      procedureData: selectedProcedureData,
      surgeonData: selectedSurgeonData,
      estimatedCost
    };
    localStorage.setItem('quotationData', JSON.stringify(quotationData));
    
    toast({
      title: "Cotización generada",
      description: "IA ha procesado su solicitud exitosamente",
    });
    
    navigate('/result');
    setIsGenerating(false);
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
    'Hospital Ángeles Chihuahua (Chihuahua)'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wuru-bg-primary to-wuru-bg-secondary">
      <Navigation />
      <div className="p-4">
        <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center space-x-3">
            <Calculator className="h-8 w-8 text-wuru-purple" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Cotizador Quirúrgico
            </h1>
            <Sparkles className="h-8 w-8 text-wuru-glow" />
          </div>
          <p className="text-muted-foreground text-lg">
            Generación inteligente de cotizaciones médicas
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="bg-gradient-card border-border/50 shadow-elevated backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center space-x-2">
              <Search className="h-6 w-6 text-wuru-purple" />
              <span>Nueva Cotización</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Hospital Selection */}
            <div className="space-y-2">
              <Label htmlFor="hospital" className="text-base font-medium">
                Unidad Hospitalaria
              </Label>
              <Select value={formData.hospital} onValueChange={handleHospitalChange}>
                <SelectTrigger className="bg-wuru-bg-tertiary border-border/50 focus:ring-wuru-purple">
                  <SelectValue placeholder="Seleccione el hospital..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/50">
                  {hospitals.map((hospital) => (
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
              <div className="bg-gradient-to-r from-wuru-purple/10 to-wuru-glow/10 p-4 rounded-lg border border-wuru-purple/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-wuru-purple" />
                    <span className="font-medium text-foreground">Estimación Inteligente</span>
                    <Badge className="bg-gradient-primary text-white text-xs">
                      IA Activa
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-wuru-purple">
                      ${estimatedCost.min.toLocaleString()} - ${estimatedCost.max.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Rango estimado</p>
                  </div>
                </div>
                {selectedProcedureData && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-wuru-purple" />
                        <span className="text-muted-foreground">Duración:</span>
                        <span className="font-medium">{selectedProcedureData.estimatedDuration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Activity className="h-4 w-4 text-wuru-purple" />
                        <span className="text-muted-foreground">Complejidad:</span>
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
              selectedProcedureCategory={selectedProcedureData?.category || ''}
              className="relative"
            />

            {/* Patient Type */}
            <div className="space-y-2">
              <Label htmlFor="patientType" className="text-base font-medium">
                Tipo de Paciente
              </Label>
              <Select value={formData.patientType} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, patientType: value }))
              }>
                <SelectTrigger className="bg-wuru-bg-tertiary border-border/50 focus:ring-wuru-purple">
                  <SelectValue placeholder="Seleccione tipo de paciente..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/50">
                  <SelectItem value="particular">Paciente Particular</SelectItem>
                  <SelectItem value="eps">EPS</SelectItem>
                  <SelectItem value="prepagada">Medicina Prepagada</SelectItem>
                  <SelectItem value="soat">SOAT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <div className="pt-4">
            <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                variant="hero"
                className="w-full text-lg py-6"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analizando {selectedProcedureData?.title || 'procedimiento'} con IA...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5" />
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