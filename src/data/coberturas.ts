/**
 * Tabla de descuentos por tipo de cobertura / financiador.
 * Clave: patientType — valor: mapa de unidad → % de descuento.
 * Los códigos de unidad corresponden al campo `unidad` de PrestacionItem.
 */
export const DESCUENTOS_COBERTURA: Record<string, Record<string, number>> = {
  particular: {
    // Sin descuento
  },
  eps: {
    ATM: 40, // Atención médica
    CIR: 35, // Cirugía
    APB: 25, // Aparatos y equipos
    APR: 25, // Aparatos y equipos (variante)
    ADM: 30, // Administración / honorarios
    INS: 20, // Insumos
    LAB: 30, // Laboratorio
    DXO: 30, // Diagnóstico / servicios
  },
  prepagada: {
    ATM: 20,
    CIR: 15,
    APB: 10,
    APR: 10,
    ADM: 15,
    INS: 10,
    LAB: 20,
    DXO: 15,
  },
  soat: {
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

/** Devuelve el % de descuento para una unidad dado el tipo de cobertura. */
export function getDescuento(cobertura: string, unidad: string): number {
  return DESCUENTOS_COBERTURA[cobertura]?.[unidad] ?? 0;
}
