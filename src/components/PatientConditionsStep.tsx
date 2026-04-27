import { useState } from 'react';
import { ChevronDown, Stethoscope, ClipboardList, X, TrendingUp } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  CLINICAL_CRITERIA,
  POSTOP_TYPES,
  REQUIREMENTS,
  criterionImpact,
  requirementImpact,
  type PatientConditionsData,
} from '@/data/patientConditions';

interface Props {
  value: PatientConditionsData;
  onChange: (data: PatientConditionsData) => void;
  baseCost?: number;
  durationHours?: number;
}

// ── Helpers de costo ─────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

function criterionCostAmount(key: string, baseCost: number, durationHours: number): number {
  const c = CLINICAL_CRITERIA.find(c => c.key === key);
  return c ? criterionImpact(c, { baseCost, durationHours }) : 0;
}

function requirementCostAmount(
  key: string,
  ctx: { baseCost: number; durationHours: number; quantity: number }
): number {
  const r = REQUIREMENTS.find(r => r.key === key);
  return r ? requirementImpact(r, ctx) : 0;
}

function postopCostAmount(type: string, qty: number): number {
  const t = POSTOP_TYPES.find(t => t.key === type);
  if (!t || qty <= 0) return 0;
  return t.costPerUnit * qty;
}

// ── Cost pill ────────────────────────────────────────────────────────────────

const CostPill = ({ amount }: { amount: number }) =>
  amount > 0 ? (
    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5 shrink-0 whitespace-nowrap pointer-events-none">
      +${fmt(amount)}
    </span>
  ) : null;

// ── Accordion section ────────────────────────────────────────────────────────

const Section = ({
  title,
  icon: Icon,
  badge,
  costImpact,
  open,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ElementType;
  badge?: number;
  costImpact?: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'w-full flex items-center justify-between px-4 py-3 bg-blue-50/60 hover:bg-blue-50 transition-colors text-left',
        open && 'border-b border-border'
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary shrink-0" />
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {badge !== undefined && badge > 0 && (
          <Badge variant="secondary" className="text-xs h-5 px-1.5 bg-primary/10 text-primary border-0">
            {badge} seleccionado{badge !== 1 ? 's' : ''}
          </Badge>
        )}
        {!open && costImpact !== undefined && costImpact > 0 && (
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5 whitespace-nowrap">
            +${fmt(costImpact)}
          </span>
        )}
      </div>
      <ChevronDown
        className={cn(
          'h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0',
          open && 'rotate-180'
        )}
      />
    </button>
    <div
      className={cn(
        'grid transition-all duration-200 ease-in-out',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="p-4">{children}</div>
      </div>
    </div>
  </div>
);

// ── Checkbox item ────────────────────────────────────────────────────────────

const CheckItem = ({
  id,
  label,
  checked,
  costAmount,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  costAmount?: number;
  onCheckedChange: (checked: boolean) => void;
}) => (
  <div
    className={cn(
      'flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors select-none',
      checked
        ? 'border-primary/40 bg-primary/5'
        : 'border-border bg-background hover:bg-neutral-50'
    )}
    onClick={() => onCheckedChange(!checked)}
  >
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="pointer-events-none shrink-0"
    />
    <Label
      htmlFor={id}
      className="text-sm font-medium cursor-pointer pointer-events-none flex-1"
    >
      {label}
    </Label>
    {checked && costAmount !== undefined && costAmount > 0 && (
      <CostPill amount={costAmount} />
    )}
  </div>
);

// ────────────────────────────────────────────────────────────────────────────

const PatientConditionsStep = ({ value, onChange, baseCost = 0, durationHours = 0 }: Props) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    clinical: false,
    requirements: false,
  });

  const toggle = (key: string) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleCriterion = (key: string) => {
    const next = value.clinicalCriteria.includes(key)
      ? value.clinicalCriteria.filter(k => k !== key)
      : [...value.clinicalCriteria, key];
    onChange({ ...value, clinicalCriteria: next });
  };

  const toggleRequirement = (key: string) => {
    const next = value.requirements.includes(key)
      ? value.requirements.filter(k => k !== key)
      : [...value.requirements, key];
    onChange({ ...value, requirements: next });
  };

  const setReqQty = (key: string, qty: number) => {
    onChange({
      ...value,
      requirementQuantities: { ...value.requirementQuantities, [key]: Math.max(1, qty) },
    });
  };

  const postopUnit = POSTOP_TYPES.find(t => t.key === value.postopType)?.unit ?? 'días';
  const postopCost = postopCostAmount(value.postopType, value.postopQuantity);

  const costCtx = { baseCost, durationHours };

  // Costo total de criterios clínicos seleccionados
  const clinicalTotal = value.clinicalCriteria.reduce(
    (sum, key) => sum + criterionCostAmount(key, baseCost, durationHours),
    0
  );

  // Costo total de requerimientos seleccionados + postop
  const reqTotal =
    postopCost +
    value.requirements.reduce((sum, key) => {
      const qty = value.requirementQuantities[key] ?? 1;
      return sum + requirementCostAmount(key, { ...costCtx, quantity: qty });
    }, 0);

  const totalImpact = clinicalTotal + reqTotal;

  const reqBadge = (value.postopType ? 1 : 0) + value.requirements.length;

  return (
    <div className="space-y-3">
      {/* ── Criterios clínicos ──────────────────────────────────────── */}
      <Section
        title="Criterios clínicos relevantes"
        icon={Stethoscope}
        badge={value.clinicalCriteria.length}
        costImpact={clinicalTotal}
        open={openSections.clinical}
        onToggle={() => toggle('clinical')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {CLINICAL_CRITERIA.map(c => (
            <CheckItem
              key={c.key}
              id={`criterion-${c.key}`}
              label={c.label}
              checked={value.clinicalCriteria.includes(c.key)}
              costAmount={criterionCostAmount(c.key, baseCost, durationHours)}
              onCheckedChange={() => toggleCriterion(c.key)}
            />
          ))}
        </div>
      </Section>

      {/* ── Requerimientos ──────────────────────────────────────────── */}
      <Section
        title="Requerimientos"
        icon={ClipboardList}
        badge={reqBadge}
        costImpact={reqTotal}
        open={openSections.requirements}
        onToggle={() => toggle('requirements')}
      >
        <div className="space-y-4">
          {/* Internación posoperatoria */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Internación posoperatoria
            </p>
            <div className="flex gap-3 items-center flex-wrap">
              <div className="flex-1 min-w-[160px] relative">
                {value.postopType && (
                  <button
                    type="button"
                    onClick={() => onChange({ ...value, postopType: '', postopQuantity: 0 })}
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-10 h-5 w-5 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/40 flex items-center justify-center transition-colors"
                  >
                    <X className="h-3 w-3 text-foreground" />
                  </button>
                )}
                <Select
                  value={value.postopType}
                  onValueChange={v =>
                    onChange({ ...value, postopType: v, postopQuantity: 0 })
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Tipo de posoperatorio" />
                  </SelectTrigger>
                  <SelectContent>
                    {POSTOP_TYPES.map(t => (
                      <SelectItem key={t.key} value={t.key}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {value.postopType && (
                <div className="w-32 shrink-0">
                  <div className="relative flex items-center border border-border rounded-md bg-background overflow-hidden">
                    <Input
                      type="number"
                      min={0}
                      value={value.postopQuantity || ''}
                      onChange={e =>
                        onChange({
                          ...value,
                          postopQuantity: Math.max(0, parseInt(e.target.value) || 0),
                        })
                      }
                      className="border-0 pr-12 text-center focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                    <span className="absolute right-2.5 text-xs text-muted-foreground pointer-events-none">
                      {postopUnit}
                    </span>
                  </div>
                </div>
              )}
              {postopCost > 0 && <CostPill amount={postopCost} />}
            </div>
          </div>

          {/* Requiere */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Requiere
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {REQUIREMENTS.map(r => (
                <div key={r.key} className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors select-none',
                      value.requirements.includes(r.key)
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-border bg-background hover:bg-neutral-50'
                    )}
                    onClick={() => toggleRequirement(r.key)}
                  >
                    <Checkbox
                      id={`req-${r.key}`}
                      checked={value.requirements.includes(r.key)}
                      onCheckedChange={() => toggleRequirement(r.key)}
                      className="pointer-events-none shrink-0"
                    />
                    <Label
                      htmlFor={`req-${r.key}`}
                      className="text-sm font-medium cursor-pointer pointer-events-none flex-1"
                    >
                      {r.label}
                    </Label>
                    {value.requirements.includes(r.key) && (
                      <CostPill amount={requirementCostAmount(r.key, {
                        ...costCtx,
                        quantity: value.requirementQuantities[r.key] ?? 1,
                      })} />
                    )}
                  </div>
                  {r.pricing.mode === 'per_unit' && value.requirements.includes(r.key) && (
                    <div className="w-20 shrink-0">
                      <Input
                        type="number"
                        min={1}
                        value={value.requirementQuantities[r.key] ?? ''}
                        onChange={e => setReqQty(r.key, parseInt(e.target.value) || 1)}
                        className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="1"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Total impacto ────────────────────────────────────────────── */}
      {totalImpact > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="text-sm font-medium text-emerald-800">
              Impacto en costo
            </span>
          </div>
          <span className="text-sm font-bold text-emerald-700">
            +${fmt(totalImpact)}
          </span>
        </div>
      )}
    </div>
  );
};

export default PatientConditionsStep;
