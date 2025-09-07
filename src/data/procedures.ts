export interface ProcedureData {
  code: string;
  title: string;
  searchTerms: string[];
  complexity: 'Baja' | 'Media' | 'Alta' | 'Muy Alta';
  estimatedDuration: string;
  category: string;
  estimatedCost: {
    min: number;
    max: number;
  };
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
  synonyms?: string[];
  relatedProcedures?: string[];
}

export const PROCEDURES_DATABASE: ProcedureData[] = [
  {
    code: "01.09",
    title: "Otra escisión de lesión cerebral",
    searchTerms: ["cerebro", "escisión", "lesión", "tumor", "neurocirugía", "craneal"],
    complexity: "Muy Alta",
    estimatedDuration: "4-8 horas",
    category: "Neurocirugía",
    estimatedCost: { min: 450000, max: 800000 },
    riskLevel: "Alto",
    synonyms: ["Extirpación de tumor cerebral", "Resección de lesión craneal"],
    relatedProcedures: ["01.24"]
  },
  {
    code: "01.24",
    title: "Biopsia cerebral cerrada [percutánea] [con aguja]",
    searchTerms: ["cerebro", "biopsia", "aguja", "percutánea", "diagnóstico", "estereotáxica"],
    complexity: "Alta",
    estimatedDuration: "2-3 horas",
    category: "Neurocirugía",
    estimatedCost: { min: 180000, max: 280000 },
    riskLevel: "Medio",
    synonyms: ["Biopsia cerebral con aguja", "Biopsia estereotáxica"],
    relatedProcedures: ["01.09"]
  },
  {
    code: "03.09",
    title: "Otra exploración y descompresión del canal espinal",
    searchTerms: ["espinal", "descompresión", "columna", "canal", "exploración", "laminectomía"],
    complexity: "Alta",
    estimatedDuration: "3-5 horas",
    category: "Neurocirugía",
    estimatedCost: { min: 220000, max: 350000 },
    riskLevel: "Alto",
    synonyms: ["Descompresión espinal", "Laminectomía"],
    relatedProcedures: ["03.53", "81.62", "81.63"]
  },
  {
    code: "03.53",
    title: "Reparación de meningocele espinal",
    searchTerms: ["espinal", "meningocele", "reparación", "defecto", "columna", "espina bífida"],
    complexity: "Muy Alta",
    estimatedDuration: "4-6 horas",
    category: "Neurocirugía",
    estimatedCost: { min: 380000, max: 600000 },
    riskLevel: "Alto",
    synonyms: ["Reparación de espina bífida", "Cierre de meningocele"],
    relatedProcedures: ["03.09"]
  },
  {
    code: "06.31",
    title: "Apendicectomía laparoscópica",
    searchTerms: ["apéndice", "laparoscópica", "apendicectomía", "mínimamente invasiva", "keyhole"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Cirugía General",
    estimatedCost: { min: 35000, max: 55000 },
    riskLevel: "Bajo",
    synonyms: ["Extirpación laparoscópica de apéndice", "Apendicectomía mínimamente invasiva"],
    relatedProcedures: ["47.01", "47.09"]
  },
  {
    code: "06.32",
    title: "Apendicectomía abierta",
    searchTerms: ["apéndice", "abierta", "apendicectomía", "tradicional", "convencional"],
    complexity: "Baja",
    estimatedDuration: "1-1.5 horas",
    category: "Cirugía General",
    estimatedCost: { min: 28000, max: 45000 },
    riskLevel: "Bajo",
    synonyms: ["Apendicectomía tradicional", "Extirpación abierta de apéndice"],
    relatedProcedures: ["47.01", "47.09"]
  },
  {
    code: "36.01",
    title: "Intervención coronaria percutánea de un vaso (ICP)",
    searchTerms: ["coronaria", "angioplastia", "icp", "stent", "corazón", "vaso", "cardiología"],
    complexity: "Alta",
    estimatedDuration: "1-3 horas",
    category: "Cardiología",
    estimatedCost: { min: 150000, max: 280000 },
    riskLevel: "Medio",
    synonyms: ["Angioplastia", "Colocación de stent coronario", "Cateterismo cardíaco"],
    relatedProcedures: ["36.02", "36.06", "36.07"]
  },
  {
    code: "36.02",
    title: "Intervención coronaria percutánea de múltiples vasos (ICP)",
    searchTerms: ["coronaria", "múltiples", "angioplastia", "icp", "stent", "corazón", "compleja"],
    complexity: "Muy Alta",
    estimatedDuration: "2-4 horas",
    category: "Cardiología",
    estimatedCost: { min: 280000, max: 450000 },
    riskLevel: "Alto",
    synonyms: ["Angioplastia multivaso", "Intervención coronaria compleja"],
    relatedProcedures: ["36.01", "36.06", "36.07"]
  },
  {
    code: "36.06",
    title: "Inserción de stent coronario sin liberación de fármacos",
    searchTerms: ["coronario", "stent", "sin fármacos", "metal", "corazón", "convencional"],
    complexity: "Alta",
    estimatedDuration: "1-3 horas",
    category: "Cardiología",
    estimatedCost: { min: 120000, max: 220000 },
    riskLevel: "Medio",
    synonyms: ["Stent de metal desnudo", "Stent coronario regular"],
    relatedProcedures: ["36.07", "36.01", "36.02"]
  },
  {
    code: "36.07",
    title: "Inserción de stent coronario con liberación de fármacos",
    searchTerms: ["coronario", "stent", "liberación fármacos", "recubierto", "corazón", "medicado"],
    complexity: "Alta",
    estimatedDuration: "1-3 horas",
    category: "Cardiología",
    estimatedCost: { min: 180000, max: 320000 },
    riskLevel: "Medio",
    synonyms: ["Stent recubierto con fármaco", "Stent medicado"],
    relatedProcedures: ["36.06", "36.01", "36.02"]
  },
  {
    code: "37.22",
    title: "Cateterismo cardíaco izquierdo",
    searchTerms: ["cateterismo", "cardíaco", "izquierdo", "corazón", "diagnóstico", "coronariografía"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Cardiología",
    estimatedCost: { min: 80000, max: 150000 },
    riskLevel: "Medio",
    synonyms: ["Coronariografía", "Cateterismo diagnóstico"],
    relatedProcedures: ["37.23", "36.01"]
  },
  {
    code: "37.23",
    title: "Cateterismo cardíaco combinado derecho e izquierdo",
    searchTerms: ["cateterismo", "cardíaco", "combinado", "derecho", "izquierdo", "completo"],
    complexity: "Alta",
    estimatedDuration: "2-3 horas",
    category: "Cardiología",
    estimatedCost: { min: 120000, max: 200000 },
    riskLevel: "Medio",
    synonyms: ["Cateterismo cardíaco completo", "Estudio hemodinámico completo"],
    relatedProcedures: ["37.22", "36.01"]
  },
  {
    code: "37.31",
    title: "Pericardiocentesis",
    searchTerms: ["pericardiocentesis", "pericardio", "líquido", "punción", "corazón", "derrame"],
    complexity: "Media",
    estimatedDuration: "30-60 minutos",
    category: "Cardiología",
    estimatedCost: { min: 45000, max: 85000 },
    riskLevel: "Medio",
    synonyms: ["Punción pericárdica", "Drenaje pericárdico"],
    relatedProcedures: ["37.33"]
  },
  {
    code: "37.33",
    title: "Escisión o destrucción de otra lesión o tejido del corazón, abordaje abierto",
    searchTerms: ["corazón", "escisión", "lesión", "tejido", "abierto", "cardíaco"],
    complexity: "Muy Alta",
    estimatedDuration: "3-6 horas",
    category: "Cirugía Cardiovascular",
    estimatedCost: { min: 350000, max: 650000 },
    riskLevel: "Alto",
    synonyms: ["Resección de lesión cardíaca", "Cirugía cardíaca abierta"],
    relatedProcedures: ["37.31", "39.61"]
  },
  {
    code: "37.91",
    title: "Inserción de sistema de marcapasos temporal",
    searchTerms: ["marcapasos", "temporal", "inserción", "corazón", "estimulación", "transitorio"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Cardiología",
    estimatedCost: { min: 85000, max: 150000 },
    riskLevel: "Medio",
    synonyms: ["Marcapasos transitorio", "Estimulación cardíaca temporal"],
    relatedProcedures: ["37.94"]
  },
  {
    code: "37.94",
    title: "Implantación de cardioversor/desfibrilador automático, sistema total",
    searchTerms: ["cardioversor", "desfibrilador", "automático", "implantación", "sistema", "cdi"],
    complexity: "Muy Alta",
    estimatedDuration: "2-4 horas",
    category: "Cardiología",
    estimatedCost: { min: 450000, max: 750000 },
    riskLevel: "Alto",
    synonyms: ["CDI", "Desfibrilador implantable", "Cardioversor implantable"],
    relatedProcedures: ["37.91"]
  },
  {
    code: "38.12",
    title: "Endarterectomía, arteria carótida",
    searchTerms: ["endarterectomía", "carótida", "arteria", "placa", "ateroma", "vascular"],
    complexity: "Alta",
    estimatedDuration: "2-4 horas",
    category: "Cirugía Vascular",
    estimatedCost: { min: 180000, max: 320000 },
    riskLevel: "Alto",
    synonyms: ["Limpieza de arteria carótida", "Desobstrucción carotídea"],
    relatedProcedures: ["38.31", "39.50"]
  },
  {
    code: "38.31",
    title: "Resección de aorta abdominal con reemplazo",
    searchTerms: ["aorta", "abdominal", "resección", "reemplazo", "aneurisma", "vascular"],
    complexity: "Muy Alta",
    estimatedDuration: "4-8 horas",
    category: "Cirugía Vascular",
    estimatedCost: { min: 450000, max: 850000 },
    riskLevel: "Alto",
    synonyms: ["Reemplazo de aorta abdominal", "Corrección de aneurisma aórtico"],
    relatedProcedures: ["38.43", "39.61"]
  },
  {
    code: "38.43",
    title: "Resección de arteria ilíaca con reemplazo",
    searchTerms: ["arteria", "ilíaca", "resección", "reemplazo", "vascular", "bypass"],
    complexity: "Alta",
    estimatedDuration: "3-5 horas",
    category: "Cirugía Vascular",
    estimatedCost: { min: 280000, max: 450000 },
    riskLevel: "Alto",
    synonyms: ["Reemplazo de arteria ilíaca", "Bypass ilíaco"],
    relatedProcedures: ["38.31", "39.50"]
  },
  {
    code: "38.93",
    title: "Cateterización venosa, no especificada de otra manera",
    searchTerms: ["cateterización", "venosa", "acceso", "vascular", "central", "periférico"],
    complexity: "Baja",
    estimatedDuration: "30-60 minutos",
    category: "Procedimientos",
    estimatedCost: { min: 15000, max: 35000 },
    riskLevel: "Bajo",
    synonyms: ["Acceso venoso", "Catéter venoso", "Vía venosa"],
    relatedProcedures: ["39.95"]
  },
  {
    code: "39.50",
    title: "Angioplastia o aterectomía de otro(s) vaso(s) no coronario(s)",
    searchTerms: ["angioplastia", "aterectomía", "vaso", "no coronario", "periférico", "vascular"],
    complexity: "Alta",
    estimatedDuration: "2-4 horas",
    category: "Cirugía Vascular",
    estimatedCost: { min: 180000, max: 350000 },
    riskLevel: "Medio",
    synonyms: ["Angioplastia periférica", "Revascularización no coronaria"],
    relatedProcedures: ["38.12", "38.43"]
  },
  {
    code: "39.61",
    title: "Circulación extracorpórea auxiliar a cirugía cardíaca abierta",
    searchTerms: ["circulación", "extracorpórea", "bomba", "corazón", "cardíaca", "abierta"],
    complexity: "Muy Alta",
    estimatedDuration: "Variable",
    category: "Cirugía Cardiovascular",
    estimatedCost: { min: 250000, max: 450000 },
    riskLevel: "Alto",
    synonyms: ["Bomba de circulación", "Bypass cardiopulmonar"],
    relatedProcedures: ["37.33", "38.31"]
  },
  {
    code: "39.95",
    title: "Hemodiálisis",
    searchTerms: ["hemodiálisis", "diálisis", "riñón", "filtración", "sangre", "renal"],
    complexity: "Media",
    estimatedDuration: "3-4 horas",
    category: "Nefrología",
    estimatedCost: { min: 12000, max: 25000 },
    riskLevel: "Medio",
    synonyms: ["Diálisis sanguínea", "Filtración renal"],
    relatedProcedures: ["38.93", "55.03"]
  },
  {
    code: "40.11",
    title: "Mastectomía simple, unilateral",
    searchTerms: ["mastectomía", "mama", "seno", "unilateral", "cáncer", "simple"],
    complexity: "Media",
    estimatedDuration: "2-3 horas",
    category: "Oncología",
    estimatedCost: { min: 85000, max: 150000 },
    riskLevel: "Medio",
    synonyms: ["Extirpación de mama", "Mastectomía unilateral"],
    relatedProcedures: ["40.23", "85.21"]
  },
  {
    code: "40.23",
    title: "Biopsia bilateral de mama",
    searchTerms: ["biopsia", "mama", "bilateral", "seno", "diagnóstico", "tejido"],
    complexity: "Baja",
    estimatedDuration: "1-2 horas",
    category: "Diagnóstico",
    estimatedCost: { min: 35000, max: 65000 },
    riskLevel: "Bajo",
    synonyms: ["Biopsia de ambas mamas", "Estudio histológico mamario"],
    relatedProcedures: ["40.11", "85.21"]
  },
  {
    code: "41.05",
    title: "Biopsia de médula ósea",
    searchTerms: ["biopsia", "médula", "ósea", "hueso", "hematología", "diagnóstico"],
    complexity: "Media",
    estimatedDuration: "30-60 minutos",
    category: "Hematología",
    estimatedCost: { min: 25000, max: 45000 },
    riskLevel: "Bajo",
    synonyms: ["Punción de médula ósea", "Aspirado medular"],
    relatedProcedures: ["41.07"]
  },
  {
    code: "41.07",
    title: "Trasplante de médula ósea",
    searchTerms: ["trasplante", "médula", "ósea", "hematológico", "células madre", "injerto"],
    complexity: "Muy Alta",
    estimatedDuration: "6-12 horas",
    category: "Hematología",
    estimatedCost: { min: 850000, max: 1500000 },
    riskLevel: "Alto",
    synonyms: ["Injerto de médula ósea", "Trasplante hematopoyético"],
    relatedProcedures: ["41.05"]
  },
  {
    code: "45.16",
    title: "Polipectomía endoscópica de intestino grueso",
    searchTerms: ["polipectomía", "endoscópica", "intestino", "grueso", "colon", "pólipo"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Gastroenterología",
    estimatedCost: { min: 45000, max: 85000 },
    riskLevel: "Bajo",
    synonyms: ["Extirpación de pólipos", "Polipectomía colónica"],
    relatedProcedures: ["45.23", "45.25"]
  },
  {
    code: "45.23",
    title: "Colonoscopia con biopsia",
    searchTerms: ["colonoscopia", "biopsia", "colon", "endoscopia", "diagnóstico", "intestino"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Gastroenterología",
    estimatedCost: { min: 35000, max: 65000 },
    riskLevel: "Bajo",
    synonyms: ["Endoscopia de colon con biopsia", "Estudio endoscópico colónico"],
    relatedProcedures: ["45.16", "45.25"]
  },
  {
    code: "45.25",
    title: "Escisión endoscópica de lesión de intestino grueso",
    searchTerms: ["escisión", "endoscópica", "lesión", "intestino", "grueso", "colon"],
    complexity: "Media",
    estimatedDuration: "1-3 horas",
    category: "Gastroenterología",
    estimatedCost: { min: 55000, max: 95000 },
    riskLevel: "Medio",
    synonyms: ["Resección endoscópica colónica", "Extirpación de lesión colónica"],
    relatedProcedures: ["45.16", "45.23"]
  },
  {
    code: "45.42",
    title: "Resección abierta de intestino delgado",
    searchTerms: ["resección", "abierta", "intestino", "delgado", "cirugía", "abdominal"],
    complexity: "Alta",
    estimatedDuration: "2-4 horas",
    category: "Cirugía General",
    estimatedCost: { min: 120000, max: 220000 },
    riskLevel: "Medio",
    synonyms: ["Extirpación de intestino delgado", "Enterectomía"],
    relatedProcedures: ["45.73", "54.11"]
  },
  {
    code: "45.73",
    title: "Anastomosis intestinal de delgado a delgado",
    searchTerms: ["anastomosis", "intestinal", "delgado", "unión", "reconexión", "sutura"],
    complexity: "Alta",
    estimatedDuration: "2-3 horas",
    category: "Cirugía General",
    estimatedCost: { min: 95000, max: 165000 },
    riskLevel: "Medio",
    synonyms: ["Unión intestinal", "Reconexión de intestino delgado"],
    relatedProcedures: ["45.42", "54.11"]
  },
  {
    code: "46.10",
    title: "Colostomía, no especificada de otra manera",
    searchTerms: ["colostomía", "estoma", "colon", "derivación", "ostomía", "intestinal"],
    complexity: "Media",
    estimatedDuration: "2-3 horas",
    category: "Cirugía General",
    estimatedCost: { min: 65000, max: 115000 },
    riskLevel: "Medio",
    synonyms: ["Estoma colónico", "Derivación intestinal"],
    relatedProcedures: ["46.20", "54.11"]
  },
  {
    code: "46.20",
    title: "Ileostomía, no especificada de otra manera",
    searchTerms: ["ileostomía", "estoma", "íleon", "derivación", "ostomía", "intestinal"],
    complexity: "Media",
    estimatedDuration: "2-3 horas",
    category: "Cirugía General",
    estimatedCost: { min: 68000, max: 120000 },
    riskLevel: "Medio",
    synonyms: ["Estoma ileal", "Derivación de íleon"],
    relatedProcedures: ["46.10", "54.11"]
  },
  {
    code: "47.01",
    title: "Apendicectomía laparoscópica",
    searchTerms: ["apendicectomía", "laparoscópica", "apéndice", "mínimamente invasiva", "keyhole"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Cirugía General",
    estimatedCost: { min: 35000, max: 55000 },
    riskLevel: "Bajo",
    synonyms: ["Extirpación laparoscópica de apéndice", "Apendicectomía mínimamente invasiva"],
    relatedProcedures: ["06.31", "47.09"]
  },
  {
    code: "47.09",
    title: "Otra apendicectomía",
    searchTerms: ["apendicectomía", "apéndice", "otra", "extirpación", "quirúrgica"],
    complexity: "Baja",
    estimatedDuration: "1-2 horas",
    category: "Cirugía General",
    estimatedCost: { min: 32000, max: 48000 },
    riskLevel: "Bajo",
    synonyms: ["Extirpación de apéndice", "Apendicectomía convencional"],
    relatedProcedures: ["47.01", "06.31", "06.32"]
  },
  {
    code: "48.51",
    title: "Hemorroidectomía, externa",
    searchTerms: ["hemorroidectomía", "externa", "hemorroides", "ano", "proctología", "extirpación"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Cirugía General",
    estimatedCost: { min: 45000, max: 75000 },
    riskLevel: "Bajo",
    synonyms: ["Extirpación de hemorroides externas", "Cirugía de hemorroides"],
    relatedProcedures: ["49.11"]
  },
  {
    code: "49.11",
    title: "Incisión de fístula anal",
    searchTerms: ["incisión", "fístula", "anal", "ano", "proctología", "drenaje"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Cirugía General",
    estimatedCost: { min: 35000, max: 65000 },
    riskLevel: "Bajo",
    synonyms: ["Fistulotomía anal", "Apertura de fístula anal"],
    relatedProcedures: ["48.51"]
  },
  {
    code: "50.12",
    title: "Biopsia hepática abierta",
    searchTerms: ["biopsia", "hepática", "abierta", "hígado", "diagnóstico", "tejido"],
    complexity: "Alta",
    estimatedDuration: "2-3 horas",
    category: "Cirugía General",
    estimatedCost: { min: 85000, max: 145000 },
    riskLevel: "Medio",
    synonyms: ["Biopsia de hígado", "Estudio histológico hepático"],
    relatedProcedures: ["51.22", "52.09"]
  },
  {
    code: "51.22",
    title: "Colecistectomía, abierta",
    searchTerms: ["colecistectomía", "abierta", "vesícula", "biliar", "extirpación", "tradicional"],
    complexity: "Media",
    estimatedDuration: "2-3 horas",
    category: "Cirugía General",
    estimatedCost: { min: 65000, max: 95000 },
    riskLevel: "Medio",
    synonyms: ["Extirpación abierta de vesícula", "Colecistectomía tradicional"],
    relatedProcedures: ["51.23"]
  },
  {
    code: "51.23",
    title: "Colecistectomía laparoscópica",
    searchTerms: ["colecistectomía", "laparoscópica", "vesícula", "biliar", "mínimamente invasiva", "keyhole"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Cirugía General",
    estimatedCost: { min: 45000, max: 75000 },
    riskLevel: "Bajo",
    synonyms: ["Extirpación laparoscópica de vesícula", "Colecistectomía mínimamente invasiva"],
    relatedProcedures: ["51.22"]
  },
  {
    code: "52.09",
    title: "Escisión de páncreas, parcial",
    searchTerms: ["escisión", "páncreas", "parcial", "pancreatectomía", "resección", "pancreática"],
    complexity: "Muy Alta",
    estimatedDuration: "4-8 horas",
    category: "Cirugía General",
    estimatedCost: { min: 380000, max: 650000 },
    riskLevel: "Alto",
    synonyms: ["Pancreatectomía parcial", "Resección pancreática"],
    relatedProcedures: ["50.12", "54.11"]
  },
  {
    code: "53.01",
    title: "Reparación de hernia inguinal, unilateral, no especificada de otra manera",
    searchTerms: ["reparación", "hernia", "inguinal", "unilateral", "ingle", "herniorrafia"],
    complexity: "Baja",
    estimatedDuration: "1-2 horas",
    category: "Cirugía General",
    estimatedCost: { min: 35000, max: 55000 },
    riskLevel: "Bajo",
    synonyms: ["Herniorrafia inguinal", "Cirugía de hernia inguinal"],
    relatedProcedures: ["53.41"]
  },
  {
    code: "53.41",
    title: "Reparación de hernia femoral, unilateral",
    searchTerms: ["reparación", "hernia", "femoral", "unilateral", "muslo", "herniorrafia"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Cirugía General",
    estimatedCost: { min: 38000, max: 58000 },
    riskLevel: "Bajo",
    synonyms: ["Herniorrafia femoral", "Cirugía de hernia femoral"],
    relatedProcedures: ["53.01"]
  },
  {
    code: "54.11",
    title: "Laparotomía exploratoria",
    searchTerms: ["laparotomía", "exploratoria", "abdomen", "exploración", "diagnóstico", "abdominal"],
    complexity: "Media",
    estimatedDuration: "2-4 horas",
    category: "Cirugía General",
    estimatedCost: { min: 85000, max: 150000 },
    riskLevel: "Medio",
    synonyms: ["Exploración abdominal", "Cirugía exploratoria"],
    relatedProcedures: ["54.21", "45.42"]
  },
  {
    code: "54.21",
    title: "Laparoscopia",
    searchTerms: ["laparoscopia", "mínimamente invasiva", "diagnóstico", "abdomen", "endoscopia"],
    complexity: "Baja",
    estimatedDuration: "30-90 minutos",
    category: "Cirugía General",
    estimatedCost: { min: 35000, max: 65000 },
    riskLevel: "Bajo",
    synonyms: ["Cirugía laparoscópica diagnóstica", "Endoscopia abdominal"],
    relatedProcedures: ["54.11"]
  },
  {
    code: "55.03",
    title: "Nefrostomía percutánea",
    searchTerms: ["nefrostomía", "percutánea", "riñón", "drenaje", "urinario", "nefrología"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Urología",
    estimatedCost: { min: 55000, max: 85000 },
    riskLevel: "Medio",
    synonyms: ["Drenaje renal percutáneo", "Catéter nefrostómico"],
    relatedProcedures: ["55.51", "39.95"]
  },
  {
    code: "55.51",
    title: "Nefrectomía, no especificada de otra manera",
    searchTerms: ["nefrectomía", "riñón", "extirpación", "renal", "urología", "ablación"],
    complexity: "Alta",
    estimatedDuration: "3-5 horas",
    category: "Urología",
    estimatedCost: { min: 180000, max: 320000 },
    riskLevel: "Alto",
    synonyms: ["Extirpación de riñón", "Ablación renal"],
    relatedProcedures: ["56.0", "55.03"]
  },
  {
    code: "56.0",
    title: "Trasplante renal",
    searchTerms: ["trasplante", "renal", "riñón", "injerto", "urología", "implante"],
    complexity: "Muy Alta",
    estimatedDuration: "4-8 horas",
    category: "Urología",
    estimatedCost: { min: 650000, max: 1200000 },
    riskLevel: "Alto",
    synonyms: ["Injerto renal", "Implante de riñón"],
    relatedProcedures: ["55.51", "39.95"]
  },
  {
    code: "57.94",
    title: "Cistoscopia con biopsia",
    searchTerms: ["cistoscopia", "biopsia", "vejiga", "endoscopia", "urinaria", "diagnóstico"],
    complexity: "Baja",
    estimatedDuration: "1-2 horas",
    category: "Urología",
    estimatedCost: { min: 35000, max: 65000 },
    riskLevel: "Bajo",
    synonyms: ["Endoscopia vesical con biopsia", "Exploración de vejiga"],
    relatedProcedures: ["58.23"]
  },
  {
    code: "58.23",
    title: "Escisión o destrucción transuretral de lesión vesical",
    searchTerms: ["escisión", "transuretral", "lesión", "vesical", "vejiga", "uretra"],
    complexity: "Media",
    estimatedDuration: "1-3 horas",
    category: "Urología",
    estimatedCost: { min: 65000, max: 115000 },
    riskLevel: "Medio",
    synonyms: ["Resección transuretral de vejiga", "RTU vesical"],
    relatedProcedures: ["57.94", "60.29"]
  },
  {
    code: "60.29",
    title: "Otra prostatectomía transuretral",
    searchTerms: ["prostatectomía", "transuretral", "próstata", "uretra", "urología", "rtu"],
    complexity: "Media",
    estimatedDuration: "2-3 horas",
    category: "Urología",
    estimatedCost: { min: 75000, max: 125000 },
    riskLevel: "Medio",
    synonyms: ["RTU de próstata", "Resección transuretral prostática"],
    relatedProcedures: ["60.3", "58.23"]
  },
  {
    code: "60.3",
    title: "Prostatectomía abierta, simple",
    searchTerms: ["prostatectomía", "abierta", "simple", "próstata", "urología", "tradicional"],
    complexity: "Alta",
    estimatedDuration: "2-4 horas",
    category: "Urología",
    estimatedCost: { min: 120000, max: 200000 },
    riskLevel: "Medio",
    synonyms: ["Extirpación abierta de próstata", "Cirugía prostática abierta"],
    relatedProcedures: ["60.29"]
  },
  {
    code: "64.0",
    title: "Histerectomía, abdominal y vaginal, subtotal y total",
    searchTerms: ["histerectomía", "abdominal", "vaginal", "útero", "ginecología", "extirpación"],
    complexity: "Media",
    estimatedDuration: "2-4 horas",
    category: "Ginecología",
    estimatedCost: { min: 85000, max: 145000 },
    riskLevel: "Medio",
    synonyms: ["Extirpación de útero", "Ablación uterina"],
    relatedProcedures: ["68.49", "65.61"]
  },
  {
    code: "65.61",
    title: "Ooforectomía laparoscópica unilateral",
    searchTerms: ["ooforectomía", "laparoscópica", "unilateral", "ovario", "ginecología", "extirpación"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Ginecología",
    estimatedCost: { min: 55000, max: 95000 },
    riskLevel: "Bajo",
    synonyms: ["Extirpación laparoscópica de ovario", "Ablación ovárica"],
    relatedProcedures: ["66.01", "68.49"]
  },
  {
    code: "66.01",
    title: "Esterilización, ligadura tubárica",
    searchTerms: ["esterilización", "ligadura", "tubárica", "trompas", "anticoncepción", "salpingectomía"],
    complexity: "Baja",
    estimatedDuration: "30-60 minutos",
    category: "Ginecología",
    estimatedCost: { min: 35000, max: 55000 },
    riskLevel: "Bajo",
    synonyms: ["Ligadura de trompas", "Oclusión tubárica"],
    relatedProcedures: ["66.32", "65.61"]
  },
  {
    code: "66.32",
    title: "Salpingectomía, completa",
    searchTerms: ["salpingectomía", "completa", "trompa", "uterina", "ginecología", "extirpación"],
    complexity: "Media",
    estimatedDuration: "1-3 horas",
    category: "Ginecología",
    estimatedCost: { min: 65000, max: 105000 },
    riskLevel: "Medio",
    synonyms: ["Extirpación de trompa de Falopio", "Ablación tubárica"],
    relatedProcedures: ["66.01", "68.49"]
  },
  {
    code: "68.49",
    title: "Otra histerectomía abdominal total",
    searchTerms: ["histerectomía", "abdominal", "total", "útero", "ginecología", "extirpación"],
    complexity: "Media",
    estimatedDuration: "2-3 horas",
    category: "Ginecología",
    estimatedCost: { min: 75000, max: 120000 },
    riskLevel: "Medio",
    synonyms: ["Extirpación total de útero", "Histerectomía completa"],
    relatedProcedures: ["65.61", "66.32"]
  },
  {
    code: "69.09",
    title: "Dilatación y curetaje para diagnóstico",
    searchTerms: ["dilatación", "curetaje", "diagnóstico", "útero", "ginecología", "legrado"],
    complexity: "Baja",
    estimatedDuration: "30-60 minutos",
    category: "Ginecología",
    estimatedCost: { min: 25000, max: 45000 },
    riskLevel: "Bajo",
    synonyms: ["Legrado diagnóstico", "D&C diagnóstico"],
    relatedProcedures: ["69.51", "75.34"]
  },
  {
    code: "69.51",
    title: "Histeroscopia",
    searchTerms: ["histeroscopia", "útero", "endoscopia", "diagnóstico", "ginecología", "intrauterino"],
    complexity: "Baja",
    estimatedDuration: "30-90 minutos",
    category: "Ginecología",
    estimatedCost: { min: 35000, max: 65000 },
    riskLevel: "Bajo",
    synonyms: ["Endoscopia uterina", "Exploración intrauterina"],
    relatedProcedures: ["69.09", "68.49"]
  },
  {
    code: "70.71",
    title: "Lisis laparoscópica de adherencias peritoneales",
    searchTerms: ["lisis", "laparoscópica", "adherencias", "peritoneales", "abdomen", "liberación"],
    complexity: "Media",
    estimatedDuration: "1-3 horas",
    category: "Cirugía General",
    estimatedCost: { min: 55000, max: 95000 },
    riskLevel: "Medio",
    synonyms: ["Liberación de adherencias", "Adhesiolisis laparoscópica"],
    relatedProcedures: ["54.21", "54.11"]
  },
  {
    code: "72.0",
    title: "Operación cesárea, clásica",
    searchTerms: ["cesárea", "clásica", "parto", "nacimiento", "obstetricia", "quirúrgico"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Obstetricia",
    estimatedCost: { min: 45000, max: 75000 },
    riskLevel: "Medio",
    synonyms: ["Cesárea clásica", "Parto por cesárea superior"],
    relatedProcedures: ["72.1"]
  },
  {
    code: "72.1",
    title: "Operación cesárea, cervical baja",
    searchTerms: ["cesárea", "cervical", "baja", "parto", "nacimiento", "obstetricia"],
    complexity: "Media",
    estimatedDuration: "1-1.5 horas",
    category: "Obstetricia",
    estimatedCost: { min: 40000, max: 65000 },
    riskLevel: "Bajo",
    synonyms: ["Cesárea segmentaria", "Parto por cesárea inferior"],
    relatedProcedures: ["72.0"]
  },
  {
    code: "73.59",
    title: "Otra reparación de útero",
    searchTerms: ["reparación", "útero", "uterino", "ginecología", "reconstrucción", "sutura"],
    complexity: "Alta",
    estimatedDuration: "2-4 horas",
    category: "Ginecología",
    estimatedCost: { min: 95000, max: 165000 },
    riskLevel: "Medio",
    synonyms: ["Reconstrucción uterina", "Plastia uterina"],
    relatedProcedures: ["68.49", "72.0"]
  },
  {
    code: "74.1",
    title: "Parto con fórceps",
    searchTerms: ["parto", "fórceps", "instrumental", "obstetricia", "asistido", "extracción"],
    complexity: "Media",
    estimatedDuration: "30-90 minutos",
    category: "Obstetricia",
    estimatedCost: { min: 35000, max: 55000 },
    riskLevel: "Medio",
    synonyms: ["Parto instrumentado", "Extracción con fórceps"],
    relatedProcedures: ["72.0", "72.1"]
  },
  {
    code: "75.34",
    title: "Aborto inducido por dilatación y evacuación",
    searchTerms: ["aborto", "inducido", "dilatación", "evacuación", "ginecología", "interrupción"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Ginecología",
    estimatedCost: { min: 45000, max: 75000 },
    riskLevel: "Medio",
    synonyms: ["Interrupción del embarazo", "D&E"],
    relatedProcedures: ["69.09", "69.51"]
  },
  {
    code: "76.73",
    title: "Reducción abierta de fractura de húmero",
    searchTerms: ["reducción", "abierta", "fractura", "húmero", "brazo", "ortopedia"],
    complexity: "Alta",
    estimatedDuration: "2-4 horas",
    category: "Ortopedia",
    estimatedCost: { min: 85000, max: 155000 },
    riskLevel: "Medio",
    synonyms: ["Fijación abierta de húmero", "Osteosíntesis de húmero"],
    relatedProcedures: ["77.59", "79.31"]
  },
  {
    code: "77.59",
    title: "Reducción cerrada de fractura con fijación interna, fémur",
    searchTerms: ["reducción", "cerrada", "fractura", "fijación", "interna", "fémur"],
    complexity: "Alta",
    estimatedDuration: "2-4 horas",
    category: "Ortopedia",
    estimatedCost: { min: 120000, max: 220000 },
    riskLevel: "Medio",
    synonyms: ["Fijación cerrada de fémur", "Osteosíntesis femoral"],
    relatedProcedures: ["81.51", "79.31"]
  },
  {
    code: "78.55",
    title: "Reemplazo total de cadera, revisión",
    searchTerms: ["reemplazo", "total", "cadera", "revisión", "prótesis", "ortopedia"],
    complexity: "Muy Alta",
    estimatedDuration: "3-6 horas",
    category: "Ortopedia",
    estimatedCost: { min: 280000, max: 450000 },
    riskLevel: "Alto",
    synonyms: ["Revisión de prótesis de cadera", "Recambio protésico de cadera"],
    relatedProcedures: ["81.51", "78.65"]
  },
  {
    code: "78.65",
    title: "Reemplazo total de rodilla, revisión",
    searchTerms: ["reemplazo", "total", "rodilla", "revisión", "prótesis", "ortopedia"],
    complexity: "Muy Alta",
    estimatedDuration: "3-5 horas",
    category: "Ortopedia",
    estimatedCost: { min: 250000, max: 420000 },
    riskLevel: "Alto",
    synonyms: ["Revisión de prótesis de rodilla", "Recambio protésico de rodilla"],
    relatedProcedures: ["81.54", "78.55"]
  },
  {
    code: "79.31",
    title: "Reducción abierta de fractura de tibia",
    searchTerms: ["reducción", "abierta", "fractura", "tibia", "pierna", "ortopedia"],
    complexity: "Alta",
    estimatedDuration: "2-4 horas",
    category: "Ortopedia",
    estimatedCost: { min: 95000, max: 175000 },
    riskLevel: "Medio",
    synonyms: ["Fijación abierta de tibia", "Osteosíntesis tibial"],
    relatedProcedures: ["79.35", "77.59"]
  },
  {
    code: "79.35",
    title: "Reducción cerrada de fractura de radio con fijación interna",
    searchTerms: ["reducción", "cerrada", "fractura", "radio", "fijación", "interna"],
    complexity: "Media",
    estimatedDuration: "1-3 horas",
    category: "Ortopedia",
    estimatedCost: { min: 65000, max: 115000 },
    riskLevel: "Bajo",
    synonyms: ["Fijación cerrada de radio", "Osteosíntesis de radio"],
    relatedProcedures: ["79.31", "76.73"]
  },
  {
    code: "80.6",
    title: "Artroscopia, rodilla",
    searchTerms: ["artroscopia", "rodilla", "articulación", "endoscopia", "mínimamente invasiva", "diagnóstico"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Ortopedia",
    estimatedCost: { min: 55000, max: 85000 },
    riskLevel: "Bajo",
    synonyms: ["Endoscopia de rodilla", "Cirugía artroscópica de rodilla"],
    relatedProcedures: ["81.54", "81.51"]
  },
  {
    code: "81.51",
    title: "Reemplazo total de cadera",
    searchTerms: ["reemplazo", "total", "cadera", "prótesis", "articulación", "artroplastia"],
    complexity: "Alta",
    estimatedDuration: "2-4 horas",
    category: "Ortopedia",
    estimatedCost: { min: 180000, max: 320000 },
    riskLevel: "Medio",
    synonyms: ["Artroplastia de cadera", "Prótesis de cadera"],
    relatedProcedures: ["78.55", "81.54"]
  },
  {
    code: "81.54",
    title: "Reemplazo total de rodilla",
    searchTerms: ["reemplazo", "total", "rodilla", "prótesis", "articulación", "artroplastia"],
    complexity: "Alta",
    estimatedDuration: "2-3 horas",
    category: "Ortopedia",
    estimatedCost: { min: 160000, max: 280000 },
    riskLevel: "Medio",
    synonyms: ["Artroplastia de rodilla", "Prótesis de rodilla"],
    relatedProcedures: ["78.65", "81.51"]
  },
  {
    code: "81.62",
    title: "Artrodesis de columna, cervical",
    searchTerms: ["artrodesis", "columna", "cervical", "fusión", "vertebral", "cuello"],
    complexity: "Muy Alta",
    estimatedDuration: "3-6 horas",
    category: "Ortopedia",
    estimatedCost: { min: 280000, max: 480000 },
    riskLevel: "Alto",
    synonyms: ["Fusión cervical", "Fijación vertebral cervical"],
    relatedProcedures: ["81.63", "03.09"]
  },
  {
    code: "81.63",
    title: "Artrodesis de columna, lumbar",
    searchTerms: ["artrodesis", "columna", "lumbar", "fusión", "vertebral", "espalda"],
    complexity: "Muy Alta",
    estimatedDuration: "3-6 horas",
    category: "Ortopedia",
    estimatedCost: { min: 320000, max: 550000 },
    riskLevel: "Alto",
    synonyms: ["Fusión lumbar", "Fijación vertebral lumbar"],
    relatedProcedures: ["81.62", "81.83"]
  },
  {
    code: "81.83",
    title: "Extracción de dispositivo de fijación espinal",
    searchTerms: ["extracción", "dispositivo", "fijación", "espinal", "retiro", "implante"],
    complexity: "Alta",
    estimatedDuration: "2-4 horas",
    category: "Ortopedia",
    estimatedCost: { min: 120000, max: 220000 },
    riskLevel: "Medio",
    synonyms: ["Retiro de material de osteosíntesis", "Extracción de implante espinal"],
    relatedProcedures: ["81.63", "81.62"]
  },
  {
    code: "82.35",
    title: "Reparación de tendón de la mano",
    searchTerms: ["reparación", "tendón", "mano", "sutura", "tenorrafia", "ortopedia"],
    complexity: "Media",
    estimatedDuration: "1-3 horas",
    category: "Ortopedia",
    estimatedCost: { min: 45000, max: 85000 },
    riskLevel: "Bajo",
    synonyms: ["Tenorrafia de mano", "Sutura tendinosa"],
    relatedProcedures: ["83.45"]
  },
  {
    code: "83.11",
    title: "Escisión de disco intervertebral, lumbar",
    searchTerms: ["escisión", "disco", "intervertebral", "lumbar", "discectomía", "hernia"],
    complexity: "Alta",
    estimatedDuration: "2-4 horas",
    category: "Ortopedia",
    estimatedCost: { min: 150000, max: 280000 },
    riskLevel: "Medio",
    synonyms: ["Discectomía lumbar", "Extirpación de hernia discal"],
    relatedProcedures: ["81.63", "03.09"]
  },
  {
    code: "83.45",
    title: "Otra reparación de hombro",
    searchTerms: ["reparación", "hombro", "articulación", "manguito", "rotador", "ortopedia"],
    complexity: "Alta",
    estimatedDuration: "2-4 horas",
    category: "Ortopedia",
    estimatedCost: { min: 120000, max: 200000 },
    riskLevel: "Medio",
    synonyms: ["Reparación de manguito rotador", "Plastia de hombro"],
    relatedProcedures: ["82.35", "80.6"]
  },
  {
    code: "84.51",
    title: "Amputación de dedo del pie",
    searchTerms: ["amputación", "dedo", "pie", "extirpación", "ortopedia", "podología"],
    complexity: "Baja",
    estimatedDuration: "1-2 horas",
    category: "Ortopedia",
    estimatedCost: { min: 35000, max: 65000 },
    riskLevel: "Bajo",
    synonyms: ["Extirpación de dedo del pie", "Ablación digital"],
    relatedProcedures: ["84.55"]
  },
  {
    code: "84.55",
    title: "Amputación de pierna por encima de la rodilla",
    searchTerms: ["amputación", "pierna", "encima", "rodilla", "supracondílea", "ortopedia"],
    complexity: "Alta",
    estimatedDuration: "2-4 horas",
    category: "Ortopedia",
    estimatedCost: { min: 85000, max: 155000 },
    riskLevel: "Alto",
    synonyms: ["Amputación supracondílea", "Amputación transfemoral"],
    relatedProcedures: ["84.51"]
  },
  {
    code: "85.21",
    title: "Mamoplastia de reducción",
    searchTerms: ["mamoplastia", "reducción", "mama", "seno", "cirugía", "plástica"],
    complexity: "Media",
    estimatedDuration: "2-4 horas",
    category: "Cirugía Plástica",
    estimatedCost: { min: 85000, max: 150000 },
    riskLevel: "Medio",
    synonyms: ["Reducción mamaria", "Cirugía de reducción de senos"],
    relatedProcedures: ["40.11", "40.23"]
  },
  {
    code: "86.22",
    title: "Escisión de lesión de piel, tronco",
    searchTerms: ["escisión", "lesión", "piel", "tronco", "dermatología", "extirpación"],
    complexity: "Baja",
    estimatedDuration: "30-90 minutos",
    category: "Dermatología",
    estimatedCost: { min: 25000, max: 45000 },
    riskLevel: "Bajo",
    synonyms: ["Extirpación de lesión cutánea", "Resección de piel"],
    relatedProcedures: ["86.28", "86.3"]
  },
  {
    code: "86.28",
    title: "Escisión de quiste pilonidal",
    searchTerms: ["escisión", "quiste", "pilonidal", "sacro", "coxis", "dermatología"],
    complexity: "Media",
    estimatedDuration: "1-2 horas",
    category: "Cirugía General",
    estimatedCost: { min: 45000, max: 75000 },
    riskLevel: "Bajo",
    synonyms: ["Extirpación de quiste sacro", "Cirugía de quiste pilonidal"],
    relatedProcedures: ["86.22", "86.3"]
  },
  {
    code: "86.3",
    title: "Injerto de piel",
    searchTerms: ["injerto", "piel", "dermatología", "trasplante", "cutáneo", "cobertura"],
    complexity: "Media",
    estimatedDuration: "1-4 horas",
    category: "Cirugía Plástica",
    estimatedCost: { min: 55000, max: 120000 },
    riskLevel: "Medio",
    synonyms: ["Trasplante de piel", "Cobertura cutánea"],
    relatedProcedures: ["86.22", "86.28"]
  },
  {
    code: "87.41",
    title: "Radiografía de tórax",
    searchTerms: ["radiografía", "tórax", "pecho", "rayos x", "imagen", "diagnóstico"],
    complexity: "Baja",
    estimatedDuration: "10-30 minutos",
    category: "Radiología",
    estimatedCost: { min: 8000, max: 15000 },
    riskLevel: "Bajo",
    synonyms: ["Rayos X de tórax", "Placa de tórax"],
    relatedProcedures: ["87.44", "87.71"]
  },
  {
    code: "87.44",
    title: "Tomografía computarizada de tórax",
    searchTerms: ["tomografía", "computarizada", "tórax", "tc", "scanner", "imagen"],
    complexity: "Baja",
    estimatedDuration: "20-40 minutos",
    category: "Radiología",
    estimatedCost: { min: 45000, max: 85000 },
    riskLevel: "Bajo",
    synonyms: ["TC de tórax", "Scanner torácico"],
    relatedProcedures: ["87.41", "87.71"]
  },
  {
    code: "87.71",
    title: "Tomografía computarizada de abdomen",
    searchTerms: ["tomografía", "computarizada", "abdomen", "tc", "scanner", "imagen"],
    complexity: "Baja",
    estimatedDuration: "20-40 minutos",
    category: "Radiología",
    estimatedCost: { min: 50000, max: 95000 },
    riskLevel: "Bajo",
    synonyms: ["TC abdominal", "Scanner de abdomen"],
    relatedProcedures: ["87.73", "87.44"]
  },
  {
    code: "87.73",
    title: "Tomografía computarizada de pelvis",
    searchTerms: ["tomografía", "computarizada", "pelvis", "tc", "scanner", "imagen"],
    complexity: "Baja",
    estimatedDuration: "20-40 minutos",
    category: "Radiología",
    estimatedCost: { min: 48000, max: 90000 },
    riskLevel: "Bajo",
    synonyms: ["TC pélvico", "Scanner de pelvis"],
    relatedProcedures: ["87.71", "88.01"]
  },
  {
    code: "88.01",
    title: "Resonancia magnética de cerebro",
    searchTerms: ["resonancia", "magnética", "cerebro", "rm", "imagen", "neurológica"],
    complexity: "Baja",
    estimatedDuration: "30-60 minutos",
    category: "Radiología",
    estimatedCost: { min: 85000, max: 150000 },
    riskLevel: "Bajo",
    synonyms: ["RM cerebral", "RMN de cerebro"],
    relatedProcedures: ["88.38", "87.73"]
  },
  {
    code: "88.38",
    title: "Resonancia magnética de columna lumbar",
    searchTerms: ["resonancia", "magnética", "columna", "lumbar", "rm", "imagen"],
    complexity: "Baja",
    estimatedDuration: "30-60 minutos",
    category: "Radiología",
    estimatedCost: { min: 90000, max: 160000 },
    riskLevel: "Bajo",
    synonyms: ["RM lumbar", "RMN de columna"],
    relatedProcedures: ["88.01", "83.11"]
  },
  {
    code: "88.72",
    title: "Ecografía de útero grávido",
    searchTerms: ["ecografía", "útero", "grávido", "embarazo", "obstétrica", "fetal"],
    complexity: "Baja",
    estimatedDuration: "20-40 minutos",
    category: "Radiología",
    estimatedCost: { min: 25000, max: 45000 },
    riskLevel: "Bajo",
    synonyms: ["Ultrasonido obstétrico", "Eco obstétrica"],
    relatedProcedures: ["72.0", "72.1"]
  },
  {
    code: "89.07",
    title: "Electrocardiograma",
    searchTerms: ["electrocardiograma", "ecg", "ekg", "corazón", "cardiología", "diagnóstico"],
    complexity: "Baja",
    estimatedDuration: "10-20 minutos",
    category: "Cardiología",
    estimatedCost: { min: 5000, max: 12000 },
    riskLevel: "Bajo",
    synonyms: ["ECG", "EKG", "Electrocardiografía"],
    relatedProcedures: ["37.22", "90.59"]
  },
  {
    code: "90.59",
    title: "Panel de química sanguínea",
    searchTerms: ["panel", "química", "sanguínea", "laboratorio", "análisis", "sangre"],
    complexity: "Baja",
    estimatedDuration: "15-30 minutos",
    category: "Laboratorio",
    estimatedCost: { min: 8000, max: 18000 },
    riskLevel: "Bajo",
    synonyms: ["Química sanguínea", "Perfil bioquímico"],
    relatedProcedures: ["91.99", "89.07"]
  },
  {
    code: "91.99",
    title: "Otra prueba diagnóstica de sangre",
    searchTerms: ["prueba", "diagnóstica", "sangre", "laboratorio", "análisis", "hematología"],
    complexity: "Baja",
    estimatedDuration: "15-30 minutos",
    category: "Laboratorio",
    estimatedCost: { min: 6000, max: 15000 },
    riskLevel: "Bajo",
    synonyms: ["Análisis de sangre", "Estudio hematológico"],
    relatedProcedures: ["90.59", "41.05"]
  },
  {
    code: "93.59",
    title: "Fisioterapia, modalidades múltiples",
    searchTerms: ["fisioterapia", "modalidades", "múltiples", "rehabilitación", "terapia", "física"],
    complexity: "Baja",
    estimatedDuration: "45-90 minutos",
    category: "Rehabilitación",
    estimatedCost: { min: 15000, max: 35000 },
    riskLevel: "Bajo",
    synonyms: ["Terapia física", "Rehabilitación física"],
    relatedProcedures: ["93.83"]
  },
  {
    code: "93.83",
    title: "Evaluación de terapia ocupacional",
    searchTerms: ["evaluación", "terapia", "ocupacional", "rehabilitación", "funcional", "actividades"],
    complexity: "Baja",
    estimatedDuration: "60-90 minutos",
    category: "Rehabilitación",
    estimatedCost: { min: 18000, max: 40000 },
    riskLevel: "Bajo",
    synonyms: ["Terapia ocupacional", "Evaluación funcional"],
    relatedProcedures: ["93.59"]
  },
  {
    code: "94.27",
    title: "Terapia respiratoria, presión positiva continua en vía aérea",
    searchTerms: ["terapia", "respiratoria", "presión", "positiva", "continua", "cpap"],
    complexity: "Media",
    estimatedDuration: "Variable",
    category: "Neumología",
    estimatedCost: { min: 25000, max: 55000 },
    riskLevel: "Medio",
    synonyms: ["CPAP", "Ventilación no invasiva"],
    relatedProcedures: ["96.04", "96.71"]
  },
  {
    code: "96.04",
    title: "Inserción de tubo endotraqueal",
    searchTerms: ["inserción", "tubo", "endotraqueal", "intubación", "vía", "aérea"],
    complexity: "Media",
    estimatedDuration: "10-30 minutos",
    category: "Anestesiología",
    estimatedCost: { min: 15000, max: 35000 },
    riskLevel: "Medio",
    synonyms: ["Intubación endotraqueal", "Manejo de vía aérea"],
    relatedProcedures: ["96.71", "94.27"]
  },
  {
    code: "96.71",
    title: "Ventilación mecánica invasiva continua <96 hrs",
    searchTerms: ["ventilación", "mecánica", "invasiva", "continua", "respirador", "artificial"],
    complexity: "Alta",
    estimatedDuration: "Variable",
    category: "Cuidados Intensivos",
    estimatedCost: { min: 45000, max: 85000 },
    riskLevel: "Alto",
    synonyms: ["Ventilación artificial", "Soporte ventilatorio"],
    relatedProcedures: ["96.72", "96.04"]
  },
  {
    code: "96.72",
    title: "Ventilación mecánica invasiva continua ≥96 hrs",
    searchTerms: ["ventilación", "mecánica", "invasiva", "continua", "prolongada", "respirador"],
    complexity: "Muy Alta",
    estimatedDuration: "Variable",
    category: "Cuidados Intensivos",
    estimatedCost: { min: 85000, max: 150000 },
    riskLevel: "Alto",
    synonyms: ["Ventilación prolongada", "Soporte respiratorio extendido"],
    relatedProcedures: ["96.71", "96.04"]
  },
  {
    code: "99.04",
    title: "Transfusión de glóbulos rojos concentrados",
    searchTerms: ["transfusión", "glóbulos", "rojos", "concentrados", "sangre", "hematología"],
    complexity: "Media",
    estimatedDuration: "2-4 horas",
    category: "Hematología",
    estimatedCost: { min: 35000, max: 65000 },
    riskLevel: "Medio",
    synonyms: ["Transfusión sanguínea", "Transfusión de eritrocitos"],
    relatedProcedures: ["99.15", "91.99"]
  },
  {
    code: "99.15",
    title: "Inyección o infusión de inmunoglobulina",
    searchTerms: ["inyección", "infusión", "inmunoglobulina", "anticuerpos", "inmunológica", "gammaglobulina"],
    complexity: "Media",
    estimatedDuration: "2-6 horas",
    category: "Inmunología",
    estimatedCost: { min: 85000, max: 180000 },
    riskLevel: "Medio",
    synonyms: ["Gammaglobulina", "Inmunoglobulina intravenosa"],
    relatedProcedures: ["99.04", "99.29"]
  },
  {
    code: "99.29",
    title: "Inyección de otra sustancia terapéutica o profiláctica",
    searchTerms: ["inyección", "sustancia", "terapéutica", "profiláctica", "medicamento", "tratamiento"],
    complexity: "Baja",
    estimatedDuration: "15-60 minutos",
    category: "Medicina General",
    estimatedCost: { min: 8000, max: 25000 },
    riskLevel: "Bajo",
    synonyms: ["Administración de medicamento", "Inyección terapéutica"],
    relatedProcedures: ["99.15", "38.93"]
  }
];

// Utility function for fuzzy search
export const fuzzySearch = (query: string, procedures: ProcedureData[]): ProcedureData[] => {
  if (!query.trim()) return procedures.slice(0, 10); // Return first 10 if empty

  const normalizedQuery = query.toLowerCase().trim();
  
  // Calculate relevance score for each procedure
  const scoredProcedures = procedures.map(procedure => {
    let score = 0;
    
    // Exact title match (highest score)
    if (procedure.title.toLowerCase().includes(normalizedQuery)) {
      score += 100;
    }
    
    // Code match
    if (procedure.code.toLowerCase().includes(normalizedQuery)) {
      score += 90;
    }
    
    // Synonym match
    if (procedure.synonyms?.some(synonym => 
      synonym.toLowerCase().includes(normalizedQuery)
    )) {
      score += 85;
    }
    
    // Search terms match
    const matchingTerms = procedure.searchTerms.filter(term =>
      term.toLowerCase().includes(normalizedQuery) ||
      normalizedQuery.includes(term.toLowerCase())
    );
    score += matchingTerms.length * 15;
    
    // Category match
    if (procedure.category.toLowerCase().includes(normalizedQuery)) {
      score += 10;
    }
    
    // Partial word matches
    const queryWords = normalizedQuery.split(' ');
    queryWords.forEach(word => {
      if (word.length > 2) {
        if (procedure.title.toLowerCase().includes(word)) score += 5;
        if (procedure.searchTerms.some(term => term.toLowerCase().includes(word))) score += 3;
      }
    });
    
    return { ...procedure, relevanceScore: score };
  });
  
  // Filter and sort by relevance
  return scoredProcedures
    .filter(p => (p as ProcedureData & { relevanceScore: number }).relevanceScore > 0)
    .sort((a, b) => (b as ProcedureData & { relevanceScore: number }).relevanceScore - (a as ProcedureData & { relevanceScore: number }).relevanceScore)
    .slice(0, 10);
};

// Get suggestions for typos/similar terms
export const getSuggestions = (query: string, procedures: ProcedureData[]): string[] => {
  const normalizedQuery = query.toLowerCase();
  const suggestions = new Set<string>();
  
  procedures.forEach(procedure => {
    // Check for similar terms
    procedure.searchTerms.forEach(term => {
      if (term.toLowerCase().includes(normalizedQuery.slice(0, -1)) ||
          normalizedQuery.includes(term.toLowerCase().slice(0, -1))) {
        suggestions.add(term);
      }
    });
    
    // Check synonyms
    procedure.synonyms?.forEach(synonym => {
      if (synonym.toLowerCase().includes(normalizedQuery.slice(0, -1))) {
        suggestions.add(synonym);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, 5);
};

// Get related procedures
export const getRelatedProcedures = (procedureCode: string): ProcedureData[] => {
  const procedure = PROCEDURES_DATABASE.find(p => p.code === procedureCode);
  if (!procedure || !procedure.relatedProcedures) return [];
  
  return PROCEDURES_DATABASE.filter(p => 
    procedure.relatedProcedures!.includes(p.code)
  );
};

// Get complexity color for UI
export const getComplexityColor = (complexity: string): string => {
  switch (complexity) {
    case 'Baja': return 'text-green-600 bg-green-100';
    case 'Media': return 'text-yellow-600 bg-yellow-100';
    case 'Alta': return 'text-orange-600 bg-orange-100';
    case 'Muy Alta': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// Get risk level color for UI
export const getRiskColor = (risk: string): string => {
  switch (risk) {
    case 'Bajo': return 'text-green-600';
    case 'Medio': return 'text-yellow-600';
    case 'Alto': return 'text-red-600';
    default: return 'text-gray-600';
  }
};