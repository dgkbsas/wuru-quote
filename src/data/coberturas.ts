/**
 * Tabla de descuentos por tipo de cobertura / financiador.
 * Clave: patientType — valor: mapa de unidad → % de descuento.
 * Los códigos de unidad corresponden al campo `unidad` de PrestacionItem.
 */
export const DESCUENTOS_COBERTURA: Record<string, Record<string, number>> = {
  particular: {
    // Sin descuento
  },
  allianz: {
    ATM: 40,
    CIR: 35,
    APB: 25,
    APR: 25,
    ADM: 30,
    INS: 20,
    LAB: 30,
    DXO: 30,
  },
  gnp: {
    ATM: 20,
    CIR: 15,
    APB: 10,
    APR: 10,
    ADM: 15,
    INS: 10,
    LAB: 20,
    DXO: 15,
  },
  mapfre: {
    ATM: 30,
    CIR: 25,
    APB: 20,
    APR: 20,
    ADM: 20,
    INS: 15,
    LAB: 25,
    DXO: 20,
  },
};

export const FINANCIADOR_LABELS: Record<string, string> = {
  particular: 'PACIENTE PARTICULAR',
  allianz:    'ALLIANZ',
  gnp:        'GRUPO NACIONAL PROVINCIAL',
  mapfre:     'MAPFRE',
};

export const FINANCIADOR_SHORT_LABELS: Record<string, string> = {
  particular: 'PARTICULAR',
  allianz:    'ALLIANZ',
  gnp:        'GNP',
  mapfre:     'MAPFRE',
};

/** Devuelve el % de descuento para una unidad dado el tipo de cobertura. */
export function getDescuento(cobertura: string, unidad: string): number {
  return DESCUENTOS_COBERTURA[cobertura]?.[unidad] ?? 0;
}
