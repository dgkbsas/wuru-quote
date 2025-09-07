import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calculator, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from './Navigation';

const QuotationForm = () => {
  const [formData, setFormData] = useState({
    hospital: '',
    procedure: '',
    doctor: '',
    patientType: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    
    // Store form data in localStorage for the result page
    localStorage.setItem('quotationData', JSON.stringify(formData));
    
    toast({
      title: "Cotización generada",
      description: "IA ha procesado su solicitud exitosamente",
    });
    
    navigate('/result');
    setIsGenerating(false);
  };

  const procedures = [
    'Apendicectomía laparoscópica',
    'Colecistectomía laparoscópica', 
    'Herniorrafia inguinal',
    'Artroscopia de rodilla',
    'Cesárea programada',
    'Histerectomía abdominal',
    'Bypass gástrico',
    'Septoplastia',
    'Mastectomía radical'
  ];

  const doctors = [
    'Dr. Carlos Mendoza - Cirugía General',
    'Dra. Ana López - Ginecología',
    'Dr. Ricardo Torres - Ortopedia',
    'Dra. Patricia Silva - Cirugía Bariátrica',
    'Dr. Miguel Herrera - Otorrinolaringología'
  ];

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
              <Select value={formData.hospital} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, hospital: value }))
              }>
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

            {/* Procedure Input with Predictive Search */}
            <div className="space-y-2">
              <Label htmlFor="procedure" className="text-base font-medium">
                Procedimiento Quirúrgico
              </Label>
              <Select value={formData.procedure} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, procedure: value }))
              }>
                <SelectTrigger className="bg-wuru-bg-tertiary border-border/50 focus:ring-wuru-purple">
                  <SelectValue placeholder="Escriba el procedimiento..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/50">
                  {procedures.map((procedure) => (
                    <SelectItem key={procedure} value={procedure}>
                      {procedure}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Selection */}
            <div className="space-y-2">
              <Label htmlFor="doctor" className="text-base font-medium">
                Médico Tratante
              </Label>
              <Select value={formData.doctor} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, doctor: value }))
              }>
                <SelectTrigger className="bg-wuru-bg-tertiary border-border/50 focus:ring-wuru-purple">
                  <SelectValue placeholder="Seleccione el médico..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/50">
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                    <span>Generando cotización con IA...</span>
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