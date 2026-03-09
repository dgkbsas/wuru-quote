import React, { useState, useEffect, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  MapPin,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Loader2,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  SurgeonData,
  filterSurgeonsByHospitalAndProcedure,
  getAvailableSurgeonsCount,
} from '@/data/surgeons';

interface SmartSurgeonSelectorProps {
  value: string;
  onChange: (surgeonName: string, surgeonData?: SurgeonData) => void;
  selectedHospital: string;
  selectedProcedureCategory: string;
  className?: string;
  showLabel?: boolean;
}

const SmartSurgeonSelector: React.FC<SmartSurgeonSelectorProps> = ({
  value,
  onChange,
  selectedHospital,
  selectedProcedureCategory,
  className = '',
  showLabel = true,
}) => {
  const [availableSurgeons, setAvailableSurgeons] = useState<SurgeonData[]>([]);
  const [selectedSurgeon, setSelectedSurgeon] = useState<SurgeonData | null>(
    null
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<{
    total: number;
    filtered: number;
    criteria: string[];
    previousFiltered: number;
  }>({ total: 0, filtered: 0, criteria: [], previousFiltered: 0 });

  // Memoize the filtered surgeons for better performance
  const filteredSurgeons = useMemo(() => {
    return filterSurgeonsByHospitalAndProcedure(
      selectedHospital,
      selectedProcedureCategory
    );
  }, [selectedHospital, selectedProcedureCategory]);

  useEffect(() => {
    // Show loading state for immediate visual feedback
    setIsRefreshing(true);

    // Simulate brief loading for smooth UX transition
    const timer = setTimeout(() => {
      setAvailableSurgeons(filteredSurgeons);

      // Update filter status with change detection
      const criteria: string[] = [];
      if (selectedHospital)
        criteria.push(
          `Hospital: ${selectedHospital.replace('Hospital Ángeles ', '')}`
        );
      if (selectedProcedureCategory)
        criteria.push(`Especialidad: ${selectedProcedureCategory}`);

      const totalCount = getAvailableSurgeonsCount('', ''); // Total without filters

      setFilterStatus(prevStatus => ({
        total: totalCount,
        filtered: filteredSurgeons.length,
        criteria,
        previousFiltered: prevStatus.filtered,
      }));

      // Clear selection if current surgeon is not in filtered list
      if (
        selectedSurgeon &&
        !filteredSurgeons.find(s => s.id === selectedSurgeon.id)
      ) {
        setSelectedSurgeon(null);
        onChange('');
      }

      setIsRefreshing(false);
    }, 200); // Brief delay for smooth visual transition

    return () => clearTimeout(timer);
  }, [
    filteredSurgeons,
    selectedHospital,
    selectedProcedureCategory,
    selectedSurgeon,
    onChange,
  ]);

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

  const getAvailabilityStatus = (
    count: number
  ): { icon: React.ReactNode; text: string; color: string } => {
    if (count === 0) {
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        text: 'No disponible',
        color: 'text-red-600',
      };
    }
    if (count < 3) {
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        text: 'Disponibilidad limitada',
        color: 'text-orange-600',
      };
    }
    return {
      icon: <CheckCircle className="h-4 w-4" />,
      text: 'Buena disponibilidad',
      color: 'text-green-600',
    };
  };

  const availabilityStatus = getAvailabilityStatus(availableSurgeons.length);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Smart Filter Status */}
      <div className="bg-blue-50 p-3 rounded-lg border border-primary/20">
        <div className="flex items-center space-x-2 mb-4">
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          ) : (
            <Filter className="h-4 w-4 text-primary" />
          )}
          <span className="text-sm font-medium text-foreground">
            {isRefreshing
              ? 'Actualizando Filtros...'
              : 'Filtros Inteligentes Activos'}
          </span>
          {!isRefreshing &&
            filterStatus.filtered !== filterStatus.previousFiltered &&
            filterStatus.previousFiltered > 0 && (
              <Badge
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-green-100 text-green-700 animate-pulse pointer-events-none"
              >
                Actualizado
              </Badge>
            )}
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center gap-x-8 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Compatibles:</span>
            {isRefreshing ? (
              <Loader2 className="h-3 w-3 animate-spin inline" />
            ) : (
              <span
                className={`font-bold transition-all duration-300 ${getAvailabilityColor(availableSurgeons.length)}`}
              >
                {String(availableSurgeons.length).padStart(2, '0')}
              </span>
            )}
            {!isRefreshing && (
              <>
                <span className="text-xs text-muted-foreground">
                  {availableSurgeons.length === 1
                    ? 'profesional'
                    : 'profesionales'}
                </span>
                <Badge
                  variant="secondary"
                  className={`text-xs px-2 py-0.5 flex items-center gap-1 text-white pointer-events-none ${
                    availableSurgeons.length === 0
                      ? 'bg-red-500'
                      : availableSurgeons.length < 3
                        ? 'bg-orange-500'
                        : 'bg-green-500'
                  }`}
                >
                  {availabilityStatus.icon}
                  {availabilityStatus.text}
                </Badge>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Total profesionales:</span>
            <span className="font-medium">{filterStatus.total}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Filtrado:</span>
            <span className="font-bold text-primary transition-all duration-300">
              {isRefreshing ? (
                <Loader2 className="h-3 w-3 animate-spin inline" />
              ) : (
                `${Math.round((availableSurgeons.length / filterStatus.total) * 100)}%`
              )}
            </span>
          </div>
        </div>

        {filterStatus.criteria.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {filterStatus.criteria.map((criterion, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-primary/10 text-primary pointer-events-none"
              >
                {criterion}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Main Surgeon Selection */}
      <div className="space-y-2">
        {showLabel && (
          <Label
            htmlFor="surgeon-select"
            className="text-base font-medium flex items-center space-x-2"
          >
            <User className="h-4 w-4 text-primary" />
            <span>Médico Tratante</span>
            {availableSurgeons.length > 0 && (
              <Badge className="text-xs px-2 py-0.5 bg-primary text-white pointer-events-none">
                {availableSurgeons.length} profesionales
              </Badge>
            )}
          </Label>
        )}

        {isRefreshing ? (
          <div className="p-4 bg-blue-50/50 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-primary">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span className="font-medium">
                Actualizando lista de médicos...
              </span>
            </div>
          </div>
        ) : availableSurgeons.length === 0 ? (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">No hay médicos disponibles</p>
                <p className="text-sm text-orange-600 mt-1">
                  {!selectedHospital && !selectedProcedureCategory
                    ? 'Seleccione un hospital y procedimiento para ver médicos disponibles'
                    : 'Intente seleccionar un hospital diferente o un tipo de procedimiento distinto'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            {selectedSurgeon && (
              <button
                type="button"
                onClick={() => { setSelectedSurgeon(null); onChange(''); }}
                className="absolute right-8 top-1/2 -translate-y-1/2 z-10 h-5 w-5 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/40 flex items-center justify-center transition-colors"
              >
                <X className="h-3 w-3 text-foreground" />
              </button>
            )}
            <Select
              value={selectedSurgeon?.id || ''}
              onValueChange={handleSurgeonSelect}
              disabled={isRefreshing}
            >
              <SelectTrigger className="bg-blue-300/20 transition-all duration-300">
                <SelectValue placeholder="Seleccione el médico especialista...">
                  {selectedSurgeon ? (
                    <span className="font-bold text-primary-500">
                      {selectedSurgeon.name}
                    </span>
                  ) : (
                    'Seleccione el médico especialista...'
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-popover border-neutral-200 max-h-80">
                {availableSurgeons.map((surgeon, index) => (
                  <SelectItem
                    key={surgeon.id}
                    value={surgeon.id}
                    className="py-3 transition-all duration-200 hover:bg-primary/5"
                    style={{ animationDelay: `${index * 50}ms` }}
                    textValue={surgeon.name}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          {surgeon.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5 ml-2 pointer-events-none"
                        >
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
          </div>
        )}
      </div>

      {/* Selected Surgeon Details */}
      {selectedSurgeon && (
        <Card className="bg-blue-50/50 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">
                  {selectedSurgeon.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedSurgeon.specialty}
                </p>
              </div>
              <Badge className="text-xs px-2 py-0.5 bg-primary text-white pointer-events-none">
                Seleccionado
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-muted-foreground">Ubicación:</span>
                <span className="font-medium">{selectedSurgeon.city}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-muted-foreground">Experiencia:</span>
                <span className="font-medium">
                  {selectedSurgeon.experience}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Award className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-muted-foreground">Certificaciones:</span>
                {selectedSurgeon.certifications.map((cert, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-primary/10 text-primary pointer-events-none"
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Compatibility indicator */}
            <div className="mt-3 border-t border-border/30">
              <div className="flex items-center space-x-2">
                <Badge className="text-xs px-2 py-0.5 flex items-center gap-1 text-white bg-green-500 pointer-events-none">
                  <CheckCircle className="h-3 w-3" />
                  Compatible con el procedimiento seleccionado
                </Badge>
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
