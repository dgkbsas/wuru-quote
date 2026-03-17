import { cn } from '@/lib/utils';

export type StatusPillVariant =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'emerald'
  | 'amber'
  | 'teal'
  | 'blue'
  | 'sky'
  | 'gray'
  | 'primary';

const VARIANT_CLASSES: Record<StatusPillVariant, string> = {
  red:     'bg-red-100     text-red-800     border border-red-400',
  orange:  'bg-orange-100  text-orange-800  border border-orange-400',
  yellow:  'bg-yellow-100  text-yellow-800  border border-yellow-400',
  emerald: 'bg-emerald-100 text-emerald-800 border border-emerald-400',
  amber:   'bg-amber-100   text-amber-800   border border-amber-400',
  teal:    'bg-teal-100    text-teal-800    border border-teal-400',
  blue:    'bg-blue-100    text-blue-800    border border-blue-400',
  sky:     'bg-sky-100     text-sky-700     border border-sky-300',
  gray:    'bg-gray-100    text-gray-700    border border-gray-400',
  primary: 'bg-primary     text-white       border border-primary',
};

interface StatusPillProps {
  label: string;
  variant: StatusPillVariant;
  className?: string;
}

export const StatusPill = ({ label, variant, className }: StatusPillProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap',
      VARIANT_CLASSES[variant],
      className
    )}
  >
    {label}
  </span>
);

// ── Helpers de mapeo ─────────────────────────────────────────────────────────

export function complexityVariant(
  complexity: 'Baja' | 'Media' | 'Alta' | 'Muy Alta' | string
): StatusPillVariant {
  switch (complexity) {
    case 'Baja':     return 'emerald';
    case 'Media':    return 'yellow';
    case 'Alta':     return 'orange';
    case 'Muy Alta': return 'red';
    default:         return 'gray';
  }
}

export function riskVariant(
  risk: 'Bajo' | 'Medio' | 'Alto' | string
): StatusPillVariant {
  switch (risk) {
    case 'Bajo':  return 'emerald';
    case 'Medio': return 'yellow';
    case 'Alto':  return 'red';
    default:      return 'gray';
  }
}

export function prestacionTipoVariant(
  tipo: 'habitual' | 'diferencial' | 'catalogo' | string
): StatusPillVariant {
  if (tipo === 'diferencial') return 'amber';
  if (tipo === 'catalogo') return 'sky';
  return 'emerald';
}

export function descuentoVariant(pct: number): StatusPillVariant {
  if (pct <= 0)  return 'gray';
  if (pct <= 5)  return 'yellow';
  if (pct <= 10) return 'teal';
  if (pct <= 15) return 'emerald';
  if (pct <= 20) return 'blue';
  return 'amber';
}

export function availabilityVariant(count: number): StatusPillVariant {
  if (count === 0) return 'red';
  if (count < 3)   return 'orange';
  return 'teal';
}
