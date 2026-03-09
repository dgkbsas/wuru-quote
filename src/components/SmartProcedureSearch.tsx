import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Clock,
  Activity,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Star
} from 'lucide-react';
import {
  PROCEDURES_DATABASE,
  ProcedureData,
  fuzzySearch,
  getSuggestions,
  getRelatedProcedures,
  getComplexityColor,
  getRiskColor
} from '@/data/procedures';

interface SmartProcedureSearchProps {
  value: string;
  onChange: (value: string, procedureData?: ProcedureData) => void;
  className?: string;
  label?: string;
  showLabel?: boolean;
  /** Usa position:fixed para el dropdown — necesario dentro de contenedores con overflow:auto */
  fixedDropdown?: boolean;
}

const SmartProcedureSearch: React.FC<SmartProcedureSearchProps> = ({
  value,
  onChange,
  className = '',
  label,
  showLabel = true,
  fixedDropdown = false,
}) => {
  const [searchQuery, setSearchQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<ProcedureData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureData | null>(null);
  const [typoSuggestions, setTypoSuggestions] = useState<string[]>([]);
  const [relatedProcedures, setRelatedProcedures] = useState<ProcedureData[]>([]);
  const [confidence, setConfidence] = useState(0);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = fuzzySearch(searchQuery, PROCEDURES_DATABASE);
      setSuggestions(results);

      // Calculate AI confidence based on match quality
      if (results.length > 0) {
        const topResult = results[0] as ProcedureData & { relevanceScore?: number };
        const maxScore = Math.max(...results.map((r: ProcedureData & { relevanceScore?: number }) => r.relevanceScore || 0));
        setConfidence(Math.min(95, Math.round((maxScore / 100) * 95)));
      } else {
        setConfidence(0);
      }

      // Get typo suggestions if no good matches
      if (results.length === 0 || (results[0] as ProcedureData & { relevanceScore?: number }).relevanceScore! < 20) {
        setTypoSuggestions(getSuggestions(searchQuery, PROCEDURES_DATABASE));
      } else {
        setTypoSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setTypoSuggestions([]);
      setConfidence(0);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedProcedure) {
      const related = getRelatedProcedures(selectedProcedure.code);
      setRelatedProcedures(related);
    } else {
      setRelatedProcedures([]);
    }
  }, [selectedProcedure]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      setIsOpen(true);
    } else {
      setSelectedProcedure(null);
      setIsOpen(false);
      onChange('');
    }
  };

  const handleSelectProcedure = (procedure: ProcedureData) => {
    setSearchQuery(procedure.title);
    setSelectedProcedure(procedure);
    setIsOpen(false);
    onChange(procedure.title, procedure);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setIsOpen(true);
  };

  const formatCostRange = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  // Recalcular posición fixed del dropdown cuando está abierto
  useEffect(() => {
    if (!fixedDropdown || !isOpen || !inputRef.current) return;
    const update = () => {
      const rect = inputRef.current!.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [fixedDropdown, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Input */}
      <div className="space-y-2">
        {showLabel && (
          <Label htmlFor="procedure-search" className="text-base font-medium flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>{label || 'Procedimiento Quirúrgico'}</span>
            {confidence > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs px-2 py-0.5 bg-primary/10 text-primary pointer-events-none">
                IA: {confidence}% confianza
              </Badge>
            )}
          </Label>
        )}

        <div className="relative" onClick={e => e.stopPropagation()}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            id="procedure-search"
            type="text"
            placeholder="Escriba el procedimiento (ej: apendicectomía, cesárea)..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => searchQuery && setIsOpen(true)}
            className={`pl-10 text-base bg-blue-50/60 ${selectedProcedure ? 'font-bold text-primary-500' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <Card
          ref={dropdownRef}
          className="z-50 max-h-80 sm:max-h-96 overflow-y-auto bg-popover border-neutral-200 shadow-xl"
          style={
            fixedDropdown
              ? { position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }
              : { position: 'absolute', width: '100%' }
          }
        >
          <CardContent className="p-0">
            {/* Main Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-muted-foreground mb-2 flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>Mejores coincidencias</span>
                </div>
                {suggestions.slice(0, 8).map((procedure, index) => (
                  <div
                    key={procedure.code}
                    className="p-3 sm:p-4 hover:bg-neutral-50 cursor-pointer rounded-md border border-transparent hover:border-primary/20 transition-all touch-manipulation"
                    onClick={() => handleSelectProcedure(procedure)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            {procedure.code}
                          </Badge>
                          <Badge className={`text-xs px-2 py-0.5 ${getComplexityColor(procedure.complexity)}`}>
                            {procedure.complexity}
                          </Badge>
                        </div>
                        <p className="font-medium text-sm sm:text-base text-foreground leading-tight mb-2">
                          {procedure.title}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{procedure.estimatedDuration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Activity className="h-3 w-3" />
                            <span>{procedure.category}</span>
                          </div>
                          <div className={`flex items-center space-x-1 ${getRiskColor(procedure.riskLevel)}`}>
                            <AlertTriangle className="h-3 w-3" />
                            <span>Riesgo {procedure.riskLevel}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:block sm:text-right sm:ml-3">
                        <p className="text-sm font-bold text-primary">
                          {formatCostRange(procedure.estimatedCost.min, procedure.estimatedCost.max)}
                        </p>
                        <ChevronRight className="h-4 w-4 text-muted-foreground sm:mt-1 sm:ml-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Typo Suggestions */}
            {typoSuggestions.length > 0 && (
              <>
                <Separator />
                <div className="p-2">
                  <div className="text-xs text-muted-foreground mb-2">
                    ¿Quisiste decir...?
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {typoSuggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs px-2 py-0.5 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* No Results */}
            {suggestions.length === 0 && typoSuggestions.length === 0 && searchQuery.trim() && (
              <div className="p-4 text-center text-muted-foreground">
                <Search className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No se encontraron procedimientos</p>
                <p className="text-xs mt-1">Intente con términos más generales</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Selected Procedure Details */}
      {selectedProcedure && (
        <Card className="bg-blue-50/50 border-primary/20">
          <CardContent className="p-4 space-y-3">

            {/* Fila de badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-mono text-xs px-2 py-0.5 pointer-events-none">
                {selectedProcedure.code}
              </Badge>
              <Badge variant="secondary" className="text-xs px-2 py-0.5 pointer-events-none">
                {selectedProcedure.category}
              </Badge>
            </div>

            {/* Título */}
            <h3 className="font-semibold text-foreground leading-snug">
              {selectedProcedure.title}
            </h3>

            {/* Costo prominente */}
            <div>
              <p className="text-xl font-bold text-primary leading-tight">
                {formatCostRange(selectedProcedure.estimatedCost.min, selectedProcedure.estimatedCost.max)}
              </p>
              <p className="text-xs text-muted-foreground">Costo estimado</p>
            </div>

            {/* Stats en columna */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border/30 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Duración:</span>
                <span className="font-medium">{selectedProcedure.estimatedDuration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Complejidad:</span>
                <Badge className={`text-xs px-2 py-0.5 text-white pointer-events-none ${
                  selectedProcedure.complexity === 'Alta' || selectedProcedure.complexity === 'Muy Alta' ? 'bg-red-500' :
                  selectedProcedure.complexity === 'Media' ? 'bg-orange-500' :
                  'bg-green-500'
                }`}>
                  {selectedProcedure.complexity}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Riesgo:</span>
                <Badge className={`text-xs px-2 py-0.5 text-white pointer-events-none ${
                  selectedProcedure.riskLevel === 'Alto' ? 'bg-red-500' :
                  selectedProcedure.riskLevel === 'Medio' ? 'bg-orange-500' :
                  'bg-green-500'
                }`}>
                  {selectedProcedure.riskLevel}
                </Badge>
              </div>
            </div>

            {/* Procedimientos relacionados */}
            {relatedProcedures.length > 0 && (
              <div className="pt-2 border-t border-border/30">
                <div className={`flex items-center gap-1.5 ${relatedProcedures.length >= 2 ? 'flex-nowrap overflow-hidden' : 'flex-wrap'}`}>
                  <span className="text-xs text-muted-foreground shrink-0">Relacionados:</span>
                  {relatedProcedures.slice(0, 3).map((related) => (
                    <Badge
                      key={related.code}
                      variant="secondary"
                      className="text-xs px-2 py-0.5 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors truncate"
                      title={`${related.code}: ${related.title}`}
                      onClick={() => handleSelectProcedure(related)}
                    >
                      {related.code}: {related.title.length > 20
                        ? `${related.title.substring(0, 20)}…`
                        : related.title}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartProcedureSearch;
