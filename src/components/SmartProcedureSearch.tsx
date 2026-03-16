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
  Star,
} from 'lucide-react';
import {
  PROCEDURES_DATABASE,
  ProcedureData,
  fuzzySearch,
  getSuggestions,
  getRelatedProcedures,
  getComplexityColor,
  getRiskColor,
} from '@/data/procedures';
import { StatusPill, complexityVariant, riskVariant } from '@/components/ui/status-pill';
import { findEpisodiosByProcedure } from '@/data/episodios';

interface SmartProcedureSearchProps {
  value: string;
  onChange: (value: string, procedureData?: ProcedureData) => void;
  className?: string;
  label?: string;
  showLabel?: boolean;
  /** Usa position:fixed para el dropdown — necesario dentro de contenedores con overflow:auto */
  fixedDropdown?: boolean;
  /** Data inicial para restaurar desde borrador */
  initialProcedureData?: ProcedureData | null;
}

const SmartProcedureSearch: React.FC<SmartProcedureSearchProps> = ({
  value,
  onChange,
  className = '',
  label,
  showLabel = true,
  fixedDropdown = false,
  initialProcedureData = null,
}) => {
  const [searchQuery, setSearchQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<ProcedureData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] =
    useState<ProcedureData | null>(initialProcedureData);
  const [typoSuggestions, setTypoSuggestions] = useState<string[]>([]);
  const [relatedProcedures, setRelatedProcedures] = useState<ProcedureData[]>(
    []
  );
  const [confidence, setConfidence] = useState(0);
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = fuzzySearch(searchQuery, PROCEDURES_DATABASE);
      setSuggestions(results);

      // Calculate AI confidence based on match quality
      if (results.length > 0) {
        const topResult = results[0] as ProcedureData & {
          relevanceScore?: number;
        };
        const maxScore = Math.max(
          ...results.map(
            (r: ProcedureData & { relevanceScore?: number }) =>
              r.relevanceScore || 0
          )
        );
        setConfidence(Math.min(95, Math.round((maxScore / 100) * 95)));
      } else {
        setConfidence(0);
      }

      // Get typo suggestions if no good matches
      if (
        results.length === 0 ||
        (results[0] as ProcedureData & { relevanceScore?: number })
          .relevanceScore! < 20
      ) {
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

  // Sync internal state when value is cleared externally
  useEffect(() => {
    if (!value) {
      setSearchQuery('');
      setSelectedProcedure(null);
    }
  }, [value]);

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

  const formatCost = (min: number, max: number) => {
    const avg = Math.round((min + max) / 2);
    return `$${avg.toLocaleString()}`;
  };

  // Recalcular posición fixed del dropdown cuando está abierto
  useEffect(() => {
    if (!fixedDropdown || !isOpen || !inputRef.current) return;
    const update = () => {
      const rect = inputRef.current!.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
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
          <Label
            htmlFor="procedure-search"
            className="text-base font-medium flex items-center space-x-2"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>{label || 'Procedimiento Quirúrgico'}</span>
            {confidence > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 text-xs px-2 py-0.5 bg-primary/10 text-primary pointer-events-none"
              >
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
            className={`pl-10 text-base bg-blue-300/20 ${selectedProcedure ? 'font-bold text-primary-500' : ''}`}
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
              ? {
                  position: 'fixed',
                  top: dropdownPos.top,
                  left: dropdownPos.left,
                  width: dropdownPos.width,
                }
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
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0.5"
                          >
                            {procedure.code}
                          </Badge>
                          <StatusPill label={procedure.category} variant="blue" />
                          {(() => {
                            const ep = findEpisodiosByProcedure(procedure.title);
                            return ep ? (
                              <StatusPill label={`${ep.totalEpisodios} episodios`} variant="primary" />
                            ) : null;
                          })()}
                        </div>
                        <p className="font-medium text-sm sm:text-base text-foreground leading-tight mb-2">
                          {procedure.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <StatusPill label={`Complejidad ${procedure.complexity}`} variant={complexityVariant(procedure.complexity)} />
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            <Clock className="h-3 w-3 shrink-0" />
                            <span>{procedure.estimatedDuration}</span>
                          </div>
                          <StatusPill label={`Riesgo ${procedure.riskLevel}`} variant={riskVariant(procedure.riskLevel)} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:block sm:text-right sm:ml-3">
                        <p className="text-sm font-bold text-primary">
                          {formatCost(
                            procedure.estimatedCost.min,
                            procedure.estimatedCost.max
                          )}
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
            {suggestions.length === 0 &&
              typoSuggestions.length === 0 &&
              searchQuery.trim() && (
                <div className="p-4 text-center text-muted-foreground">
                  <Search className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No se encontraron procedimientos</p>
                  <p className="text-xs mt-1">
                    Intente con términos más generales
                  </p>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Selected Procedure Details */}
      {selectedProcedure && (() => {
        const episodio = findEpisodiosByProcedure(selectedProcedure.title);
        return (
        <Card className="bg-white border-border shadow-sm rounded-xl">
          <CardContent className="p-4 space-y-3">
            {/* Fila de badges + costo */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="font-mono text-xs px-2 py-0.5 pointer-events-none"
                >
                  {selectedProcedure.code}
                </Badge>
                <StatusPill label={selectedProcedure.category} variant="blue" />
                {episodio && (
                  <StatusPill
                    label={`${episodio.totalEpisodios} episodios`}
                    variant="teal"
                  />
                )}
              </div>
              <div className="flex items-baseline gap-1.5 shrink-0">
                <p className="text-xl font-bold text-primary leading-tight">
                  {formatCost(
                    selectedProcedure.estimatedCost.min,
                    selectedProcedure.estimatedCost.max
                  )}
                </p>
                <p className="text-xs text-muted-foreground">est.</p>
              </div>
            </div>

            {/* Título */}
            <h3 className="font-semibold text-foreground leading-snug">
              {selectedProcedure.title}
            </h3>

            {/* Stats en fila */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 border-t border-border/30 text-xs text-muted-foreground">
              <div className="flex items-center gap-1 whitespace-nowrap">
                <Clock className="h-3 w-3 shrink-0" />
                <span>{selectedProcedure.estimatedDuration}</span>
              </div>
              <StatusPill label={`Complejidad ${selectedProcedure.complexity}`} variant={complexityVariant(selectedProcedure.complexity)} />
              <StatusPill label={`Riesgo ${selectedProcedure.riskLevel}`} variant={riskVariant(selectedProcedure.riskLevel)} />
            </div>

            {/* Procedimientos relacionados — comentado temporalmente */}
            {/* {relatedProcedures.length > 0 && (
              <div className="pt-2 border-t border-border/30">
                <div className="flex flex-wrap md:flex-nowrap md:overflow-hidden items-center gap-1.5">
                  <span className="text-xs text-muted-foreground shrink-0">
                    Relacionados:
                  </span>
                  {relatedProcedures.slice(0, 3).map(related => (
                    <Badge
                      key={related.code}
                      variant="secondary"
                      className="text-xs px-2 py-0.5 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors truncate"
                      title={`${related.code}: ${related.title}`}
                      onClick={() => handleSelectProcedure(related)}
                    >
                      {related.code}:{' '}
                      {related.title.length > 20
                        ? `${related.title.substring(0, 20)}…`
                        : related.title}
                    </Badge>
                  ))}
                </div>
              </div>
            )} */}
          </CardContent>
        </Card>
        );
      })()}
    </div>
  );
};

export default SmartProcedureSearch;
