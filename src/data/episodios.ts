export interface PrestacionItem {
  code: string;
  name: string;
  unidad: string;
  precioS4: number;
  /** Porcentaje de episodios en que aparece esta prestación (0-100) */
  frecuencia: number;
  /** Cantidad promedio usada por episodio (conteo de líneas en los .txt) */
  cantidadSugerida: number;
}

export interface EpisodioData {
  /** Nombre del procedimiento en el sistema hospitalario */
  procedureName: string;
  /** Palabras clave para hacer match con procedimientos del buscador */
  keywords: string[];
  totalEpisodios: number;
  /** Prestaciones presentes en la mayoría de los episodios (>50%) */
  prestacionesComunes: PrestacionItem[];
  /** Prestaciones que aparecen en una parte de los episodios (≤50%) */
  prestacionesDiferenciales: PrestacionItem[];
}

export const EPISODIOS_DB: EpisodioData[] = [
  {
    procedureName: 'ARTROSCOPIA DE RODILLA DERECHA',
    keywords: ['artroscop'],
    totalEpisodios: 6,
    prestacionesComunes: [
      { code: 'ATM-100004', name: 'ATENCION ESPECIALIZADA HOSPITALIZACION', unidad: 'ATM', precioS4: 385.45, frecuencia: 100, cantidadSugerida: 2 },
      { code: 'APB-100003', name: 'BOMBA DE INFUSION 1 CANAL (USO)', unidad: 'APB', precioS4: 1957.18, frecuencia: 100, cantidadSugerida: 2 },
      { code: 'APB-100149', name: 'INSTRUMENTAL QUIRURGICO (USO)', unidad: 'APB', precioS4: 1764.85, frecuencia: 100, cantidadSugerida: 1 },
      { code: 'APB-100189', name: 'MONITOR ANESTESICO (USO)', unidad: 'APB', precioS4: 2505.41, frecuencia: 100, cantidadSugerida: 1 },
      { code: '2000011781', name: 'BOLSA RECOL FLUID FLEX 3000C 1330170 C5', unidad: 'INS', precioS4: 3215.05, frecuencia: 100, cantidadSugerida: 1 },
      { code: '2000258149', name: 'EQP INFUSOMAT PLUS 4058828 C100', unidad: 'INS', precioS4: 952.57, frecuencia: 100, cantidadSugerida: 2 },
      { code: '2000010560', name: 'ESPON GASA EST28X24 10X10 3500052 C1', unidad: 'INS', precioS4: 166.78, frecuencia: 100, cantidadSugerida: 2 },
      { code: '2000025519', name: 'JUEGO ROPA DESECH MESA QX A31G46 C1', unidad: 'INS', precioS4: 156.15, frecuencia: 100, cantidadSugerida: 1 },
      { code: '2000276513', name: 'KIT P/INSTLACION CAT PERIF CHG 901173', unidad: 'INS', precioS4: 224.17, frecuencia: 100, cantidadSugerida: 1 },
      { code: '2000223731', name: 'SENSOR OXIMETRIA PULSO AD 4000 C1', unidad: 'INS', precioS4: 1495.38, frecuencia: 100, cantidadSugerida: 1 },
      { code: '2000025767', name: 'SOL CLORURO SODIO 0.9% 3000 4006697 C6', unidad: 'INS', precioS4: 1350.40, frecuencia: 100, cantidadSugerida: 1 },
      { code: '2000026021', name: 'SOL HARTMAN FLEXOVAL 1000 4000089 C1', unidad: 'INS', precioS4: 108.54, frecuencia: 100, cantidadSugerida: 2 },
      { code: '2000029528', name: 'TORUNDA ALCOHOL SWABS 326899 C100', unidad: 'INS', precioS4: 19.54, frecuencia: 100, cantidadSugerida: 4 },
      { code: '2000025612', name: 'BATA QX EST C/TOALLA CIRUJ HALYARD 90012', unidad: 'INS', precioS4: 949.00, frecuencia: 83, cantidadSugerida: 1 },
      { code: 'ADM-100018', name: 'CARGO USO DE HAB ESTANDAR (DIA)', unidad: 'ADM', precioS4: 6314.27, frecuencia: 83, cantidadSugerida: 2 },
    ],
    prestacionesDiferenciales: [
      { code: 'CIR-100115', name: 'CIRUGIA ORTOPEDIA 1 HR', unidad: 'CIR', precioS4: 20207.09, frecuencia: 50, cantidadSugerida: 1 },
      { code: 'APR-100046', name: 'OXIGENOTERAPIA 12-24 HORAS', unidad: 'APR', precioS4: 2004.03, frecuencia: 50, cantidadSugerida: 1 },
      { code: 'LAB-705303', name: 'QUIMICA SANGUINEA (50 ELEMENTOS)', unidad: 'LAB', precioS4: 3331.99, frecuencia: 50, cantidadSugerida: 1 },
      { code: 'CIR-100102', name: 'SERVICIO DE ASEPSIA Y CURACION', unidad: 'CIR', precioS4: 2397.20, frecuencia: 50, cantidadSugerida: 1 },
      { code: '1000000624', name: 'INHIBITRON SOL INY FCO AMP 40MG/10ML', unidad: 'INS', precioS4: 621.41, frecuencia: 50, cantidadSugerida: 1 },
      { code: '2000029998', name: 'COMPRESA VIEN PREL 45X70 T28X24E S/C C1', unidad: 'INS', precioS4: 487.86, frecuencia: 50, cantidadSugerida: 1 },
      { code: '2000228749', name: 'GUANTE QX ESTERIL LTX L.POLV 8 MSG2280', unidad: 'INS', precioS4: 171.46, frecuencia: 50, cantidadSugerida: 1 },
      { code: '2000117443', name: 'CANULA NASAL PRONGS RECTAS 2.1M 1103 C1', unidad: 'INS', precioS4: 91.43, frecuencia: 50, cantidadSugerida: 1 },
      { code: 'MDF0162170', name: 'PISACAINA AL 2% (AMP.) 200 MG/10 ML', unidad: 'INS', precioS4: 68.94, frecuencia: 50, cantidadSugerida: 1 },
      { code: '2000261983', name: 'GUANTE LATEX CIRUGIA 8 AMB ELITE', unidad: 'INS', precioS4: 45.64, frecuencia: 50, cantidadSugerida: 1 },
      { code: '2000275166', name: 'JER 21X32 5ML BD 990408', unidad: 'INS', precioS4: 32.47, frecuencia: 50, cantidadSugerida: 1 },
      { code: '2000020031', name: 'CAT PER INSYTE 22GX25MM 388312 C50', unidad: 'INS', precioS4: 85.35, frecuencia: 50, cantidadSugerida: 1 },
    ],
  },
  {
    procedureName: 'COLECISTECTOMIA POR LAPAROSCOPIA',
    keywords: ['colecist', 'laparoscop', 'vesicula', 'vesícula', 'biliar'],
    totalEpisodios: 10,
    prestacionesComunes: [
      { code: 'ATM-100004', name: 'ATENCION ESPECIALIZADA HOSPITALIZACION', unidad: 'ATM', precioS4: 372.95, frecuencia: 80, cantidadSugerida: 4 },
      { code: 'APB-100003', name: 'BOMBA DE INFUSION 1 CANAL (USO)', unidad: 'APB', precioS4: 1893.69, frecuencia: 80, cantidadSugerida: 4 },
      { code: 'APB-100189', name: 'MONITOR ANESTESICO (USO)', unidad: 'APB', precioS4: 2403.45, frecuencia: 80, cantidadSugerida: 1 },
      { code: 'ADM-100018', name: 'CARGO USO DE HAB ESTANDAR (DIA)', unidad: 'ADM', precioS4: 6107.34, frecuencia: 80, cantidadSugerida: 4 },
      { code: 'CIR-100651', name: 'SERV DE ANESTESIA GENERAL', unidad: 'CIR', precioS4: 0.01, frecuencia: 80, cantidadSugerida: 1 },
      { code: 'MDA0019551', name: 'CIRCUITO UNIVERS. ANESTESIA 9F365-80XHAP', unidad: 'INS', precioS4: 1533.96, frecuencia: 80, cantidadSugerida: 1 },
      { code: '2000258149', name: 'EQP INFUSOMAT PLUS 4058828 C100', unidad: 'INS', precioS4: 868.04, frecuencia: 90, cantidadSugerida: 2 },
      { code: '2000275600', name: 'FLEBOPLAST BC PLUS 0-150 4053947', unidad: 'INS', precioS4: 1104.16, frecuencia: 90, cantidadSugerida: 2 },
      { code: '2000223731', name: 'SENSOR OXIMETRIA PULSO AD 4000 C1', unidad: 'INS', precioS4: 1470.15, frecuencia: 90, cantidadSugerida: 1 },
      { code: '2000011780', name: 'BOLSA RECOL FLUID FLEX 1500C 1330150 C5', unidad: 'INS', precioS4: 744.79, frecuencia: 80, cantidadSugerida: 1 },
      { code: '2000012415', name: 'CANULA YANKAHUER S/VAL SCC WL431002 C50', unidad: 'INS', precioS4: 75.66, frecuencia: 80, cantidadSugerida: 1 },
      { code: '2000029998', name: 'COMPRESA VIEN PREL 45X70 T28X24E S/C C1', unidad: 'INS', precioS4: 452.82, frecuencia: 80, cantidadSugerida: 1 },
      { code: '1000000395', name: 'DYNASTAT SOL INY FCO AMP 40MG', unidad: 'INS', precioS4: 981.66, frecuencia: 80, cantidadSugerida: 5 },
      { code: 'MDA0618060', name: 'ELECTRODO ADULTO P/MONITOREO 2239', unidad: 'INS', precioS4: 120.05, frecuencia: 80, cantidadSugerida: 1 },
      { code: '2000267198', name: 'ESPON GASA C/R EST 10X10 T28X24 4000674', unidad: 'INS', precioS4: 139.84, frecuencia: 80, cantidadSugerida: 1 },
    ],
    prestacionesDiferenciales: [
      { code: 'CIR-100053', name: 'GAS ANESTESICO 1/2 HORA CIR', unidad: 'CIR', precioS4: 4118.62, frecuencia: 50, cantidadSugerida: 1 },
      { code: 'CIR-100093', name: 'MAQUINA DE ANESTESIA 1/2 HORA ADICIONAL', unidad: 'CIR', precioS4: 643.65, frecuencia: 50, cantidadSugerida: 1 },
      { code: '1000007873', name: 'CEFTREX FCO AMP 1G IV', unidad: 'INS', precioS4: 1587.86, frecuencia: 50, cantidadSugerida: 1 },
      { code: '2000000342', name: 'CAMARA HUMID AUTO 18006 IN2310030 C1', unidad: 'INS', precioS4: 1648.91, frecuencia: 50, cantidadSugerida: 1 },
      { code: '2000011204', name: 'EQP TUR EN Y L/IRRIGACION 2C4041 C12', unidad: 'INS', precioS4: 443.42, frecuencia: 50, cantidadSugerida: 1 },
      { code: 'MDF0143010', name: 'ALIN AMP 8MG/2ML', unidad: 'INS', precioS4: 365.38, frecuencia: 50, cantidadSugerida: 1 },
      { code: '2000258969', name: 'TOALLA READY PREPCHG 2% 10.5X12.1', unidad: 'INS', precioS4: 327.05, frecuencia: 50, cantidadSugerida: 1 },
      { code: '2000025758', name: 'CLORURO DE SODIO 100ML 1547', unidad: 'INS', precioS4: 142.24, frecuencia: 50, cantidadSugerida: 1 },
      { code: '2000261982', name: 'GUANTE LATEX CIRUGIA 7.5 AMB ELITE', unidad: 'INS', precioS4: 57.79, frecuencia: 50, cantidadSugerida: 1 },
      { code: '2000259346', name: 'HOJA BISTURI NO 15 SENSIMEDICAL', unidad: 'INS', precioS4: 14.60, frecuencia: 50, cantidadSugerida: 1 },
      { code: 'MDA4271370', name: 'JERINGA DESECHABLE 3 ML 21X32 302539', unidad: 'INS', precioS4: 22.00, frecuencia: 50, cantidadSugerida: 1 },
      { code: '2000268307', name: 'JERINGA DESECHABLE S/AGUJA 20ML 990687', unidad: 'INS', precioS4: 42.69, frecuencia: 50, cantidadSugerida: 1 },
    ],
  },
  {
    procedureName: 'LASIK AMBOS OJOS',
    keywords: ['lasik', 'oftalmol', 'cornea', 'córnea', 'femtolasik', 'laser ocular', 'láser ocular'],
    totalEpisodios: 10,
    prestacionesComunes: [
      { code: '2000025612', name: 'BATA QX EST C/TOALLA CIRUJ HALYARD 90012', unidad: 'INS', precioS4: 460.36, frecuencia: 60, cantidadSugerida: 1 },
      { code: '2000010560', name: 'ESPON GASA EST28X24 10X10 3500052 C1', unidad: 'INS', precioS4: 126.02, frecuencia: 60, cantidadSugerida: 1 },
      { code: '2000040578', name: 'GOGLES OFTALMICOS S/C C50', unidad: 'INS', precioS4: 313.51, frecuencia: 60, cantidadSugerida: 1 },
      { code: '2000026032', name: 'SOLUCION BSS 15ML OFTALMICO', unidad: 'INS', precioS4: 640.02, frecuencia: 60, cantidadSugerida: 1 },
    ],
    prestacionesDiferenciales: [
      { code: 'DXO-100142', name: 'LICENCIA FEMTOLASIK', unidad: 'DXO', precioS4: 5347.52, frecuencia: 40, cantidadSugerida: 1 },
      { code: 'DXO-100046', name: 'SERVICIO PARA CIRUGIA OFTALMOLOGICA', unidad: 'DXO', precioS4: 3305.10, frecuencia: 40, cantidadSugerida: 1 },
      { code: '2000273227', name: 'CABEZA/NAVAJA DES 90 MICRA 19393/90', unidad: 'INS', precioS4: 7982.86, frecuencia: 20, cantidadSugerida: 1 },
      { code: '2000273229', name: 'TUBERIA ASPIRACION DES EVOLUTION 19138', unidad: 'INS', precioS4: 5615.18, frecuencia: 20, cantidadSugerida: 1 },
      { code: '2000277605', name: 'MICROESPONJA PVA 20SOBR 5 PZ CU K20-5010', unidad: 'INS', precioS4: 334.99, frecuencia: 50, cantidadSugerida: 1 },
      { code: 'ATM-100004', name: 'ATENCION ESPECIALIZADA HOSPITALIZACION', unidad: 'ATM', precioS4: 384.61, frecuencia: 30, cantidadSugerida: 1 },
      { code: 'APB-100003', name: 'BOMBA DE INFUSION 1 CANAL (USO)', unidad: 'APB', precioS4: 1812.55, frecuencia: 30, cantidadSugerida: 1 },
      { code: '2000228748', name: 'GUANTE QUIR. LATEX ESTERIL 7.0 MSG2270', unidad: 'INS', precioS4: 107.62, frecuencia: 30, cantidadSugerida: 1 },
      { code: '2000026041', name: 'AGUA IRRIGACION 1000ML 4000258 C1', unidad: 'INS', precioS4: 119.12, frecuencia: 20, cantidadSugerida: 1 },
      { code: '2000026048', name: 'AGUA IRRIGACION 500ML 4000255 C1', unidad: 'INS', precioS4: 101.53, frecuencia: 20, cantidadSugerida: 1 },
      { code: '2000075448', name: 'GUANTE LIB/LATEX 6.5 8513 C50', unidad: 'INS', precioS4: 243.59, frecuencia: 20, cantidadSugerida: 1 },
      { code: '1000005227', name: 'TYLEX TAB 750MG', unidad: 'INS', precioS4: 57.75, frecuencia: 20, cantidadSugerida: 1 },
    ],
  },
];

/**
 * Busca episodios que coincidan con el título de un procedimiento quirúrgico.
 * Retorna null si no hay match.
 */
export function findEpisodiosByProcedure(procedureTitle: string): EpisodioData | null {
  const lower = procedureTitle.toLowerCase();
  for (const ep of EPISODIOS_DB) {
    if (ep.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      return ep;
    }
  }
  return null;
}
