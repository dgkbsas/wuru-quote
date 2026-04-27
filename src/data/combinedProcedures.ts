import { PrestacionItem } from './episodios';

export interface CombinedProcedureData {
  id: string;
  title: string;
  constituentCodes: string[];
  constituentTitles: string[];
  searchTerms: string[];
  specialties: string[];
  estimatedDuration: string;
  complexity: 'Baja' | 'Media' | 'Alta' | 'Muy Alta';
  estimatedCost: { min: number; max: number };
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
  totalEpisodios: number;
  prestacionesComunes: PrestacionItem[];
  prestacionesDiferenciales: PrestacionItem[];
}

export const COMBINED_PROCEDURES_DB: CombinedProcedureData[] = [
  {
    id: 'combo-colecist-colangio',
    title: 'Colecistectomía Laparoscópica + Colangiografía Intraoperatoria',
    constituentCodes: ['51.23', '87.71'],
    constituentTitles: ['Colecistectomía laparoscópica', 'Tomografía computarizada de abdomen'],
    searchTerms: ['colecist', 'vesícula', 'vesicula', 'biliar', 'colangio', 'laparoscop'],
    specialties: ['Cirugía General'],
    estimatedDuration: '2-3 horas',
    complexity: 'Media',
    estimatedCost: { min: 72000, max: 118000 },
    riskLevel: 'Medio',
    totalEpisodios: 8,
    prestacionesComunes: [
      { code: 'ATM-100004', name: 'ATENCION ESPECIALIZADA HOSPITALIZACION', unidad: 'ATM', precioS4: 385.45, frecuencia: 90, cantidadSugerida: 4 },
      { code: 'APB-100003', name: 'BOMBA DE INFUSION 1 CANAL (USO)', unidad: 'APB', precioS4: 1893.69, frecuencia: 90, cantidadSugerida: 3 },
      { code: 'APB-100189', name: 'MONITOR ANESTESICO (USO)', unidad: 'APB', precioS4: 2403.45, frecuencia: 90, cantidadSugerida: 1 },
      { code: 'ADM-100018', name: 'CARGO USO DE HAB ESTANDAR (DIA)', unidad: 'ADM', precioS4: 6200.00, frecuencia: 90, cantidadSugerida: 3 },
      { code: 'CIR-100651', name: 'SERV DE ANESTESIA GENERAL', unidad: 'CIR', precioS4: 0.01, frecuencia: 90, cantidadSugerida: 1 },
      { code: 'MDA0019551', name: 'CIRCUITO UNIVERS. ANESTESIA 9F365-80XHAP', unidad: 'INS', precioS4: 1533.96, frecuencia: 90, cantidadSugerida: 1 },
      { code: '2000258149', name: 'EQP INFUSOMAT PLUS 4058828 C100', unidad: 'INS', precioS4: 868.04, frecuencia: 90, cantidadSugerida: 2 },
      { code: '2000223731', name: 'SENSOR OXIMETRIA PULSO AD 4000 C1', unidad: 'INS', precioS4: 1470.15, frecuencia: 90, cantidadSugerida: 1 },
      { code: '2000029998', name: 'COMPRESA VIEN PREL 45X70 T28X24E S/C C1', unidad: 'INS', precioS4: 452.82, frecuencia: 90, cantidadSugerida: 1 },
      { code: '1000000395', name: 'DYNASTAT SOL INY FCO AMP 40MG', unidad: 'INS', precioS4: 981.66, frecuencia: 88, cantidadSugerida: 4 },
      { code: 'DXO-100060', name: 'COLANGIOGRAFIA INTRAOPERATORIA', unidad: 'DXO', precioS4: 6500.00, frecuencia: 85, cantidadSugerida: 1 },
      { code: 'CIR-100053', name: 'GAS ANESTESICO 1/2 HORA CIR', unidad: 'CIR', precioS4: 4118.62, frecuencia: 85, cantidadSugerida: 2 },
    ],
    prestacionesDiferenciales: [
      { code: '1000007873', name: 'CEFTREX FCO AMP 1G IV', unidad: 'INS', precioS4: 1587.86, frecuencia: 45, cantidadSugerida: 1 },
      { code: '2000267198', name: 'ESPON GASA C/R EST 10X10 T28X24 4000674', unidad: 'INS', precioS4: 139.84, frecuencia: 45, cantidadSugerida: 2 },
      { code: 'MDA0618060', name: 'ELECTRODO ADULTO P/MONITOREO 2239', unidad: 'INS', precioS4: 120.05, frecuencia: 40, cantidadSugerida: 1 },
      { code: '2000275600', name: 'FLEBOPLAST BC PLUS 0-150 4053947', unidad: 'INS', precioS4: 1104.16, frecuencia: 40, cantidadSugerida: 2 },
      { code: '2000259346', name: 'HOJA BISTURI NO 15 SENSIMEDICAL', unidad: 'INS', precioS4: 14.60, frecuencia: 35, cantidadSugerida: 2 },
    ],
  },
  {
    id: 'combo-hernia-bilateral',
    title: 'Reparación de Hernia Inguinal + Hernia Femoral Bilateral',
    constituentCodes: ['53.01', '53.41'],
    constituentTitles: ['Reparación de hernia inguinal, unilateral', 'Reparación de hernia femoral, unilateral'],
    searchTerms: ['hernia', 'inguinal', 'femoral', 'bilateral', 'herniorrafia', 'malla', 'plastia'],
    specialties: ['Cirugía General'],
    estimatedDuration: '2-3 horas',
    complexity: 'Media',
    estimatedCost: { min: 62000, max: 98000 },
    riskLevel: 'Bajo',
    totalEpisodios: 12,
    prestacionesComunes: [
      { code: 'ATM-100004', name: 'ATENCION ESPECIALIZADA HOSPITALIZACION', unidad: 'ATM', precioS4: 370.00, frecuencia: 92, cantidadSugerida: 2 },
      { code: 'APB-100003', name: 'BOMBA DE INFUSION 1 CANAL (USO)', unidad: 'APB', precioS4: 1850.00, frecuencia: 92, cantidadSugerida: 2 },
      { code: 'APB-100189', name: 'MONITOR ANESTESICO (USO)', unidad: 'APB', precioS4: 2350.00, frecuencia: 92, cantidadSugerida: 1 },
      { code: 'ADM-100018', name: 'CARGO USO DE HAB ESTANDAR (DIA)', unidad: 'ADM', precioS4: 6000.00, frecuencia: 92, cantidadSugerida: 2 },
      { code: 'CIR-100651', name: 'SERV DE ANESTESIA GENERAL', unidad: 'CIR', precioS4: 0.01, frecuencia: 92, cantidadSugerida: 1 },
      { code: '2000025519', name: 'JUEGO ROPA DESECH MESA QX A31G46 C1', unidad: 'INS', precioS4: 156.15, frecuencia: 92, cantidadSugerida: 1 },
      { code: '2000025612', name: 'BATA QX EST C/TOALLA CIRUJ HALYARD 90012', unidad: 'INS', precioS4: 949.00, frecuencia: 92, cantidadSugerida: 1 },
      { code: '2000010560', name: 'ESPON GASA EST28X24 10X10 3500052 C1', unidad: 'INS', precioS4: 166.78, frecuencia: 92, cantidadSugerida: 2 },
      { code: '2000223731', name: 'SENSOR OXIMETRIA PULSO AD 4000 C1', unidad: 'INS', precioS4: 1470.15, frecuencia: 92, cantidadSugerida: 1 },
      { code: 'CIR-100115', name: 'CIRUGIA GENERAL 1 HR', unidad: 'CIR', precioS4: 18500.00, frecuencia: 90, cantidadSugerida: 1 },
      { code: 'APR-100046', name: 'OXIGENOTERAPIA 12-24 HORAS', unidad: 'APR', precioS4: 2004.03, frecuencia: 80, cantidadSugerida: 1 },
      { code: 'INS-200001', name: 'MALLA QUIRURGICA POLIPROPILENO 10X15CM', unidad: 'INS', precioS4: 3200.00, frecuencia: 88, cantidadSugerida: 2 },
    ],
    prestacionesDiferenciales: [
      { code: 'LAB-705303', name: 'QUIMICA SANGUINEA (50 ELEMENTOS)', unidad: 'LAB', precioS4: 3331.99, frecuencia: 50, cantidadSugerida: 1 },
      { code: 'MDF0162170', name: 'PISACAINA AL 2% (AMP.) 200 MG/10 ML', unidad: 'INS', precioS4: 68.94, frecuencia: 45, cantidadSugerida: 2 },
      { code: '2000261983', name: 'GUANTE LATEX CIRUGIA 8 AMB ELITE', unidad: 'INS', precioS4: 45.64, frecuencia: 40, cantidadSugerida: 2 },
      { code: '2000268307', name: 'JERINGA DESECHABLE S/AGUJA 20ML 990687', unidad: 'INS', precioS4: 42.69, frecuencia: 40, cantidadSugerida: 2 },
    ],
  },
  {
    id: 'combo-cesarea-ligadura',
    title: 'Cesárea Cervical Baja + Ligadura Tubárica',
    constituentCodes: ['72.1', '66.01'],
    constituentTitles: ['Operación cesárea, cervical baja', 'Esterilización, ligadura tubárica'],
    searchTerms: ['cesarea', 'cesárea', 'ligadura', 'tubárica', 'esterilizacion', 'parto', 'anticoncep', 'tubos'],
    specialties: ['Obstetricia', 'Ginecología'],
    estimatedDuration: '1.5-2.5 horas',
    complexity: 'Media',
    estimatedCost: { min: 65000, max: 105000 },
    riskLevel: 'Medio',
    totalEpisodios: 15,
    prestacionesComunes: [
      { code: 'ATM-100004', name: 'ATENCION ESPECIALIZADA HOSPITALIZACION', unidad: 'ATM', precioS4: 390.00, frecuencia: 93, cantidadSugerida: 4 },
      { code: 'APB-100003', name: 'BOMBA DE INFUSION 1 CANAL (USO)', unidad: 'APB', precioS4: 1950.00, frecuencia: 93, cantidadSugerida: 3 },
      { code: 'APB-100189', name: 'MONITOR ANESTESICO (USO)', unidad: 'APB', precioS4: 2450.00, frecuencia: 93, cantidadSugerida: 1 },
      { code: 'ADM-100018', name: 'CARGO USO DE HAB ESTANDAR (DIA)', unidad: 'ADM', precioS4: 6300.00, frecuencia: 93, cantidadSugerida: 3 },
      { code: 'CIR-100651', name: 'SERV DE ANESTESIA GENERAL', unidad: 'CIR', precioS4: 0.01, frecuencia: 93, cantidadSugerida: 1 },
      { code: '2000025519', name: 'JUEGO ROPA DESECH MESA QX A31G46 C1', unidad: 'INS', precioS4: 156.15, frecuencia: 93, cantidadSugerida: 1 },
      { code: '2000025612', name: 'BATA QX EST C/TOALLA CIRUJ HALYARD 90012', unidad: 'INS', precioS4: 949.00, frecuencia: 93, cantidadSugerida: 2 },
      { code: '2000276513', name: 'KIT P/INSTLACION CAT PERIF CHG 901173', unidad: 'INS', precioS4: 224.17, frecuencia: 93, cantidadSugerida: 1 },
      { code: '2000258149', name: 'EQP INFUSOMAT PLUS 4058828 C100', unidad: 'INS', precioS4: 952.57, frecuencia: 93, cantidadSugerida: 2 },
      { code: '2000223731', name: 'SENSOR OXIMETRIA PULSO AD 4000 C1', unidad: 'INS', precioS4: 1495.38, frecuencia: 93, cantidadSugerida: 1 },
      { code: 'CIR-100220', name: 'CIRUGIA OBSTETRICA C/LIGADURA TUBARIA', unidad: 'CIR', precioS4: 22500.00, frecuencia: 90, cantidadSugerida: 1 },
      { code: 'ADM-100025', name: 'CARGO HAB RECIEN NACIDO (DIA)', unidad: 'ADM', precioS4: 4100.00, frecuencia: 88, cantidadSugerida: 2 },
    ],
    prestacionesDiferenciales: [
      { code: '2000026021', name: 'SOL HARTMAN FLEXOVAL 1000 4000089 C1', unidad: 'INS', precioS4: 108.54, frecuencia: 50, cantidadSugerida: 3 },
      { code: 'MDF0162170', name: 'PISACAINA AL 2% (AMP.) 200 MG/10 ML', unidad: 'INS', precioS4: 68.94, frecuencia: 50, cantidadSugerida: 2 },
      { code: '1000000395', name: 'DYNASTAT SOL INY FCO AMP 40MG', unidad: 'INS', precioS4: 981.66, frecuencia: 45, cantidadSugerida: 2 },
      { code: '2000029528', name: 'TORUNDA ALCOHOL SWABS 326899 C100', unidad: 'INS', precioS4: 19.54, frecuencia: 45, cantidadSugerida: 4 },
    ],
  },
  {
    id: 'combo-cateterismo-stent',
    title: 'Cateterismo Cardíaco Izquierdo + Stent Coronario Liberador',
    constituentCodes: ['37.22', '36.07'],
    constituentTitles: ['Cateterismo cardíaco izquierdo', 'Inserción de stent coronario con liberación de fármacos'],
    searchTerms: ['cateterismo', 'stent', 'coronario', 'angioplastia', 'corazon', 'corazón', 'cardiolog', 'cateter'],
    specialties: ['Cardiología'],
    estimatedDuration: '2-4 horas',
    complexity: 'Alta',
    estimatedCost: { min: 225000, max: 385000 },
    riskLevel: 'Medio',
    totalEpisodios: 5,
    prestacionesComunes: [
      { code: 'ATM-100004', name: 'ATENCION ESPECIALIZADA HOSPITALIZACION', unidad: 'ATM', precioS4: 395.00, frecuencia: 90, cantidadSugerida: 3 },
      { code: 'APB-100003', name: 'BOMBA DE INFUSION 1 CANAL (USO)', unidad: 'APB', precioS4: 1980.00, frecuencia: 90, cantidadSugerida: 2 },
      { code: 'APB-100189', name: 'MONITOR ANESTESICO (USO)', unidad: 'APB', precioS4: 2500.00, frecuencia: 90, cantidadSugerida: 1 },
      { code: 'ADM-100018', name: 'CARGO USO DE HAB ESTANDAR (DIA)', unidad: 'ADM', precioS4: 6400.00, frecuencia: 90, cantidadSugerida: 2 },
      { code: 'CIR-100651', name: 'SERV DE ANESTESIA GENERAL', unidad: 'CIR', precioS4: 0.01, frecuencia: 90, cantidadSugerida: 1 },
      { code: '2000258149', name: 'EQP INFUSOMAT PLUS 4058828 C100', unidad: 'INS', precioS4: 952.57, frecuencia: 90, cantidadSugerida: 2 },
      { code: '2000223731', name: 'SENSOR OXIMETRIA PULSO AD 4000 C1', unidad: 'INS', precioS4: 1495.38, frecuencia: 90, cantidadSugerida: 1 },
      { code: 'CIR-100300', name: 'HEMODINAMICA CATETERISMO DIAGNOSTICO', unidad: 'CIR', precioS4: 28000.00, frecuencia: 90, cantidadSugerida: 1 },
      { code: 'INS-300001', name: 'STENT CORONARIO LIBERADOR DE FARMACOS', unidad: 'INS', precioS4: 45000.00, frecuencia: 88, cantidadSugerida: 1 },
      { code: 'DXO-100080', name: 'FLUOROSCOPIA HEMODINAMICA', unidad: 'DXO', precioS4: 8500.00, frecuencia: 85, cantidadSugerida: 1 },
    ],
    prestacionesDiferenciales: [
      { code: 'INS-300002', name: 'STENT CORONARIO LIBERADOR 2DO VASO', unidad: 'INS', precioS4: 45000.00, frecuencia: 40, cantidadSugerida: 1 },
      { code: 'LAB-705303', name: 'QUIMICA SANGUINEA (50 ELEMENTOS)', unidad: 'LAB', precioS4: 3331.99, frecuencia: 40, cantidadSugerida: 1 },
      { code: '2000276513', name: 'KIT P/INSTLACION CAT PERIF CHG 901173', unidad: 'INS', precioS4: 224.17, frecuencia: 35, cantidadSugerida: 1 },
      { code: 'MDF0162170', name: 'PISACAINA AL 2% (AMP.) 200 MG/10 ML', unidad: 'INS', precioS4: 68.94, frecuencia: 35, cantidadSugerida: 2 },
    ],
  },
  {
    id: 'combo-apendice-lavado',
    title: 'Apendicectomía Laparoscópica + Lavado Peritoneal',
    constituentCodes: ['47.01', '54.21'],
    constituentTitles: ['Apendicectomía laparoscópica', 'Laparoscopia'],
    searchTerms: ['apendic', 'apendicectomia', 'peritoneal', 'lavado', 'peritonitis', 'laparoscop', 'abdomen'],
    specialties: ['Cirugía General'],
    estimatedDuration: '2-3 horas',
    complexity: 'Media',
    estimatedCost: { min: 55000, max: 90000 },
    riskLevel: 'Medio',
    totalEpisodios: 7,
    prestacionesComunes: [
      { code: 'ATM-100004', name: 'ATENCION ESPECIALIZADA HOSPITALIZACION', unidad: 'ATM', precioS4: 385.45, frecuencia: 90, cantidadSugerida: 3 },
      { code: 'APB-100003', name: 'BOMBA DE INFUSION 1 CANAL (USO)', unidad: 'APB', precioS4: 1957.18, frecuencia: 90, cantidadSugerida: 2 },
      { code: 'APB-100149', name: 'INSTRUMENTAL QUIRURGICO (USO)', unidad: 'APB', precioS4: 1764.85, frecuencia: 90, cantidadSugerida: 1 },
      { code: 'APB-100189', name: 'MONITOR ANESTESICO (USO)', unidad: 'APB', precioS4: 2505.41, frecuencia: 90, cantidadSugerida: 1 },
      { code: 'ADM-100018', name: 'CARGO USO DE HAB ESTANDAR (DIA)', unidad: 'ADM', precioS4: 6314.27, frecuencia: 90, cantidadSugerida: 3 },
      { code: 'CIR-100651', name: 'SERV DE ANESTESIA GENERAL', unidad: 'CIR', precioS4: 0.01, frecuencia: 90, cantidadSugerida: 1 },
      { code: '2000011781', name: 'BOLSA RECOL FLUID FLEX 3000C 1330170 C5', unidad: 'INS', precioS4: 3215.05, frecuencia: 90, cantidadSugerida: 2 },
      { code: '2000258149', name: 'EQP INFUSOMAT PLUS 4058828 C100', unidad: 'INS', precioS4: 952.57, frecuencia: 90, cantidadSugerida: 2 },
      { code: '2000223731', name: 'SENSOR OXIMETRIA PULSO AD 4000 C1', unidad: 'INS', precioS4: 1495.38, frecuencia: 90, cantidadSugerida: 1 },
      { code: '2000025767', name: 'SOL CLORURO SODIO 0.9% 3000 4006697 C6', unidad: 'INS', precioS4: 1350.40, frecuencia: 90, cantidadSugerida: 3 },
      { code: 'CIR-100115', name: 'CIRUGIA GENERAL 1 HR', unidad: 'CIR', precioS4: 18500.00, frecuencia: 88, cantidadSugerida: 1 },
      { code: 'APR-100046', name: 'OXIGENOTERAPIA 12-24 HORAS', unidad: 'APR', precioS4: 2004.03, frecuencia: 80, cantidadSugerida: 1 },
    ],
    prestacionesDiferenciales: [
      { code: 'LAB-705303', name: 'QUIMICA SANGUINEA (50 ELEMENTOS)', unidad: 'LAB', precioS4: 3331.99, frecuencia: 50, cantidadSugerida: 1 },
      { code: '2000029528', name: 'TORUNDA ALCOHOL SWABS 326899 C100', unidad: 'INS', precioS4: 19.54, frecuencia: 50, cantidadSugerida: 4 },
      { code: '2000261983', name: 'GUANTE LATEX CIRUGIA 8 AMB ELITE', unidad: 'INS', precioS4: 45.64, frecuencia: 45, cantidadSugerida: 2 },
      { code: 'MDA4271370', name: 'JERINGA DESECHABLE 3 ML 21X32 302539', unidad: 'INS', precioS4: 22.00, frecuencia: 40, cantidadSugerida: 3 },
      { code: '1000007873', name: 'CEFTREX FCO AMP 1G IV', unidad: 'INS', precioS4: 1587.86, frecuencia: 40, cantidadSugerida: 1 },
    ],
  },
];

export function searchCombinedProcedures(query: string): CombinedProcedureData[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();

  const scored = COMBINED_PROCEDURES_DB.map(combo => {
    let score = 0;
    if (combo.title.toLowerCase().includes(q)) score += 100;
    const termMatches = combo.searchTerms.filter(t => t.toLowerCase().includes(q) || q.includes(t.toLowerCase()));
    score += termMatches.length * 20;
    combo.specialties.forEach(s => { if (s.toLowerCase().includes(q)) score += 10; });
    q.split(' ').forEach(word => {
      if (word.length > 2 && combo.title.toLowerCase().includes(word)) score += 5;
    });
    return { combo, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.combo);
}

/** Returns a combination when ALL its constituent codes are present in `selectedCodes`. */
export function findCombinationByConstituents(selectedCodes: string[]): CombinedProcedureData | null {
  if (selectedCodes.length < 2) return null;
  const selected = new Set(selectedCodes);
  const matches = COMBINED_PROCEDURES_DB.filter(combo =>
    combo.constituentCodes.every(code => selected.has(code))
  );
  if (matches.length === 0) return null;
  return matches.sort((a, b) => b.constituentCodes.length - a.constituentCodes.length)[0];
}
