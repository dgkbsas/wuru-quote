import React, { useState, useEffect, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  MapPin, 
  Award, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Filter,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { 
  SurgeonData,
  filterSurgeonsByHospitalAndProcedure,
  getAvailableSurgeonsCount
} from '@/data/surgeons';

interface SmartSurgeonSelectorProps {
  value: string;
  onChange: (surgeonName: string, surgeonData?: SurgeonData) => void;
  selectedHospital: string;
  selectedProcedureCategory: string;
  className?: string;
}

const SmartSurgeonSelector: React.FC<SmartSurgeonSelectorProps> = ({ 
  value, 
  onChange, 
  selectedHospital,
  selectedProcedureCategory,
  className = '' 
}) => {
  const [availableSurgeons, setAvailableSurgeons] = useState<SurgeonData[]>([]);
  const [selectedSurgeon, setSelectedSurgeon] = useState<SurgeonData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<{
    total: number;
    filtered: number;
    criteria: string[];
    previousFiltered: number;
  }>({ total: 0, filtered: 0, criteria: [], previousFiltered: 0 });

  // Memoize the filtered surgeons for better performance
  const filteredSurgeons = useMemo(() => {
    return filterSurgeonsByHospitalAndProcedure(selectedHospital, selectedProcedureCategory);
  }, [selectedHospital, selectedProcedureCategory]);

  useEffect(() => {
    // Show loading state for immediate visual feedback
    setIsRefreshing(true);
    
    // Simulate brief loading for smooth UX transition
    const timer = setTimeout(() => {
      setAvailableSurgeons(filteredSurgeons);
      
      // Update filter status with change detection
      const criteria: string[] = [];
      if (selectedHospital) criteria.push(`Hospital: ${selectedHospital.replace('Hospital Ángeles ', '')}`);
      if (selectedProcedureCategory) criteria.push(`Especialidad: ${selectedProcedureCategory}`);
      
      const totalCount = getAvailableSurgeonsCount('', ''); // Total without filters
      
      setFilterStatus(prevStatus => ({
        total: totalCount,
        filtered: filteredSurgeons.length,
        criteria,
        previousFiltered: prevStatus.filtered
      }));

      // Clear selection if current surgeon is not in filtered list
      if (selectedSurgeon && !filteredSurgeons.find(s => s.id === selectedSurgeon.id)) {
        setSelectedSurgeon(null);
        onChange('');
      }
      
      setIsRefreshing(false);
    }, 200); // Brief delay for smooth visual transition

    return () => clearTimeout(timer);
  }, [filteredSurgeons, selectedHospital, selectedProcedureCategory, selectedSurgeon, onChange]);

  const handleSurgeonSelect = (surgeonId: string) => {
    const surgeon = availableSurgeons.find(s => s.id === surgeonId);
    if (surgeon) {
      setSelectedSurgeon(surgeon);
      onChange(surgeon.name, surgeon);
    }
  };

  const getAvailabilityColor = (count: number): string => {
    if (count === 0) return 'text-red-600';
    if (count < 3) return 'text-orange-600';
    if (count < 6) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getAvailabilityStatus = (count: number): { icon: React.ReactNode; text: string; color: string } => {
    if (count === 0) {
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        text: 'No disponible',
        color: 'text-red-600'
      };
    }
    if (count < 3) {
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        text: 'Disponibilidad limitada',
        color: 'text-orange-600'
      };
    }
    return {
      icon: <CheckCircle className="h-4 w-4" />,
      text: 'Buena disponibilidad',
      color: 'text-green-600'
    };
  };

  const availabilityStatus = getAvailabilityStatus(availableSurgeons.length);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Smart Filter Status */}
      <div className="bg-gradient-to-r from-wuru-purple/10 to-wuru-glow/10 p-3 rounded-lg border border-wuru-purple/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 text-wuru-purple animate-spin" />
            ) : (
              <Filter className="h-4 w-4 text-wuru-purple" />
            )}
            <span className="text-sm font-medium text-foreground">
              {isRefreshing ? 'Actualizando Filtros...' : 'Filtros Inteligentes Activos'}
            </span>
            {!isRefreshing && filterStatus.filtered !== filterStatus.previousFiltered && filterStatus.previousFiltered > 0 && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 animate-pulse">
                Actualizado
              </Badge>
            )}
          </div>
          <div className={`flex items-center space-x-1 ${availabilityStatus.color}`}>
            {availabilityStatus.icon}
            <span className="text-sm font-medium">{availabilityStatus.text}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <span className="text-muted-foreground">Disponibles:</span>
            <span className={`font-bold transition-all duration-300 ${getAvailabilityColor(availableSurgeons.length)}`}>
              {isRefreshing ? (
                <Loader2 className="h-3 w-3 animate-spin inline" />
              ) : (
                <>
                  {availableSurgeons.length}
                  {filterStatus.filtered !== filterStatus.previousFiltered && filterStatus.previousFiltered > 0 && (
                    <span className="ml-1 text-xs">
                      ({filterStatus.filtered > filterStatus.previousFiltered ? '+' : ''}
                      {filterStatus.filtered - filterStatus.previousFiltered})
                    </span>
                  )}
                </>
              )}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-medium">{filterStatus.total}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-muted-foreground">Filtrados:</span>
            <span className="font-bold text-wuru-purple transition-all duration-300">
              {isRefreshing ? (
                <Loader2 className="h-3 w-3 animate-spin inline" />
              ) : (
                `${Math.round((availableSurgeons.length / filterStatus.total) * 100)}%`
              )}
            </span>
          </div>
        </div>

        {filterStatus.criteria.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {filterStatus.criteria.map((criterion, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-wuru-purple/10 text-wuru-purple">
                {criterion}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Main Surgeon Selection */}
      <div className="space-y-2">
        <Label htmlFor="surgeon-select" className="text-base font-medium flex items-center space-x-2">
          <User className="h-4 w-4 text-wuru-purple" />
          <span>Médico Tratante</span>
          {availableSurgeons.length > 0 && (
            <Badge className="bg-gradient-primary text-white text-xs">
              {availableSurgeons.length} disponibles
            </Badge>
          )}
        </Label>

        {isRefreshing ? (
          <div className="p-4 bg-gradient-to-r from-wuru-purple/5 to-wuru-glow/5 border border-wuru-purple/20 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-wuru-purple">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span className="font-medium">Actualizando lista de cirujanos...</span>
            </div>
          </div>
        ) : availableSurgeons.length === 0 ? (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">No hay cirujanos disponibles</p>
                <p className="text-sm text-orange-600 mt-1">
                  {!selectedHospital && !selectedProcedureCategory 
                    ? "Seleccione un hospital y procedimiento para ver cirujanos disponibles"
                    : "Intente seleccionar un hospital diferente o un tipo de procedimiento distinto"
                  }
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <Select 
              value={selectedSurgeon?.id || ''} 
              onValueChange={handleSurgeonSelect}
              disabled={isRefreshing}
            >
              <SelectTrigger className="bg-wuru-bg-tertiary border-border/50 focus:ring-wuru-purple transition-all duration-300">
                <SelectValue placeholder="Seleccione el médico especialista..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/50 max-h-80">
                {availableSurgeons.map((surgeon, index) => (
                  <SelectItem 
                    key={surgeon.id} 
                    value={surgeon.id} 
                    className="py-3 transition-all duration-200 hover:bg-wuru-purple/5"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{surgeon.name}</span>
                        <Badge variant="outline" className="text-xs ml-2">
                          {surgeon.experience}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Award className="h-3 w-3" />
                          <span>{surgeon.specialty}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{surgeon.city}</span>
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filterStatus.filtered !== filterStatus.previousFiltered && filterStatus.previousFiltered > 0 && !isRefreshing && (
              <div className="absolute -top-2 -right-2">
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 animate-bounce">
                  ✓
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Surgeon Details */}
      {selectedSurgeon && (
        <Card className="bg-gradient-to-r from-wuru-purple/5 to-wuru-glow/5 border-wuru-purple/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{selectedSurgeon.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedSurgeon.specialty}</p>
              </div>
              <Badge className="bg-gradient-primary text-white">
                Seleccionado
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-wuru-purple" />
                <div>
                  <span className="text-muted-foreground">Ubicación:</span>
                  <p className="font-medium">{selectedSurgeon.city}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-wuru-purple" />
                <div>
                  <span className="text-muted-foreground">Experiencia:</span>
                  <p className="font-medium">{selectedSurgeon.experience}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border/30">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-4 w-4 text-wuru-purple" />
                <span className="text-sm text-muted-foreground">Certificaciones:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedSurgeon.certifications.map((cert, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-wuru-purple/10 text-wuru-purple"
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Compatibility indicator */}
            <div className="mt-3 pt-3 border-t border-border/30">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  ✓ Compatible con el procedimiento seleccionado
                </span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Especialidades: {selectedSurgeon.procedureCategories.join(', ')}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartSurgeonSelector;