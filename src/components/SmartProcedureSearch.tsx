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
}

const SmartProcedureSearch: React.FC<SmartProcedureSearchProps> = ({ 
  value, 
  onChange, 
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<ProcedureData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureData | null>(null);
  const [typoSuggestions, setTypoSuggestions] = useState<string[]>([]);
  const [relatedProcedures, setRelatedProcedures] = useState<ProcedureData[]>([]);
  const [confidence, setConfidence] = useState(0);
  
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
      
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
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
    if (!query.trim()) {
      setSelectedProcedure(null);
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
        <Label htmlFor="procedure-search" className="text-base font-medium flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-wuru-purple" />
          <span>Procedimiento Quirúrgico</span>
          {confidence > 0 && (
            <Badge variant="secondary" className="ml-2 bg-wuru-purple/10 text-wuru-purple">
              IA: {confidence}% confianza
            </Badge>
          )}
        </Label>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            id="procedure-search"
            type="text"
            placeholder="Escriba el procedimiento (ej: apendicectomía, cesárea)..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => searchQuery && setIsOpen(true)}
            className="pl-10 bg-wuru-bg-tertiary border-border/50 focus:ring-wuru-purple text-base"
          />
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <Card 
          ref={dropdownRef}
          className="absolute z-50 w-full max-h-96 overflow-y-auto bg-popover border-border/50 shadow-xl"
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
                    className="p-3 hover:bg-wuru-bg-tertiary/50 cursor-pointer rounded-md border border-transparent hover:border-wuru-purple/20 transition-all"
                    onClick={() => handleSelectProcedure(procedure)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {procedure.code}
                          </Badge>
                          <Badge className={`text-xs ${getComplexityColor(procedure.complexity)}`}>
                            {procedure.complexity}
                          </Badge>
                        </div>
                        <p className="font-medium text-sm text-foreground truncate">
                          {procedure.title}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
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
                      <div className="text-right ml-3">
                        <p className="text-sm font-bold text-wuru-purple">
                          {formatCostRange(procedure.estimatedCost.min, procedure.estimatedCost.max)}
                        </p>
                        <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 ml-auto" />
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
                        className="cursor-pointer hover:bg-wuru-purple/10 hover:text-wuru-purple transition-colors"
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
        <Card className="bg-gradient-to-r from-wuru-purple/5 to-wuru-glow/5 border-wuru-purple/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline">{selectedProcedure.code}</Badge>
                  <Badge className="bg-gradient-primary text-white">
                    Seleccionado
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground">
                  {selectedProcedure.title}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-wuru-purple">
                  {formatCostRange(selectedProcedure.estimatedCost.min, selectedProcedure.estimatedCost.max)}
                </p>
                <p className="text-xs text-muted-foreground">Estimado</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center space-x-1">
                <Activity className="h-4 w-4 text-wuru-purple" />
                <span className="text-muted-foreground">Especialidad:</span>
                <span className="font-medium">{selectedProcedure.category}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-wuru-purple" />
                <span className="text-muted-foreground">Duración:</span>
                <span className="font-medium">{selectedProcedure.estimatedDuration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-wuru-purple" />
                <span className="text-muted-foreground">Complejidad:</span>
                <Badge className={`text-xs ${getComplexityColor(selectedProcedure.complexity)}`}>
                  {selectedProcedure.complexity}
                </Badge>
              </div>
              <div className="flex items-center space-x-1">
                <AlertTriangle className={`h-4 w-4 ${getRiskColor(selectedProcedure.riskLevel)}`} />
                <span className="text-muted-foreground">Riesgo:</span>
                <span className={`font-medium ${getRiskColor(selectedProcedure.riskLevel)}`}>
                  {selectedProcedure.riskLevel}
                </span>
              </div>
            </div>

            {/* Related Procedures */}
            {relatedProcedures.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-2">
                  Procedimientos relacionados:
                </p>
                <div className="flex flex-wrap gap-2">
                  {relatedProcedures.slice(0, 3).map((related) => (
                    <Badge
                      key={related.code}
                      variant="secondary"
                      className="cursor-pointer hover:bg-wuru-purple/10 hover:text-wuru-purple transition-colors text-xs"
                      onClick={() => handleSelectProcedure(related)}
                    >
                      {related.code}: {related.title.length > 30 
                        ? `${related.title.substring(0, 30)}...` 
                        : related.title
                      }
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