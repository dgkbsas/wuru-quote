export interface SurgeonData {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  city: string;
  procedureCategories: string[];
  experience: string;
  certifications: string[];
}

// Map specialties to procedure categories for intelligent filtering
const SPECIALTY_TO_CATEGORIES: Record<string, string[]> = {
  "Cirugía General": ["Cirugía General", "Gastroenterología"],
  "Cirugía Plástica": ["Cirugía Plástica", "Dermatología"],
  "Cirugía Pediátrica": ["Cirugía General", "Pediatría"],
  "Cirugía de Mano / Cirugía Plástica": ["Cirugía Plástica", "Ortopedia"],
  "Cirugía de Tórax": ["Cirugía Cardiovascular", "Neumología"],
  "Cardiología": ["Cardiología", "Cirugía Cardiovascular"],
  "Cardiología Pediátrica": ["Cardiología", "Pediatría"],
  "Ortopedia y Traumatología": ["Ortopedia"],
  "Neurocirugía": ["Neurocirugía"],
  "Ginecología y Obstetricia": ["Ginecología", "Obstetricia"],
  "Urología": ["Urología"],
  "Oftalmología": ["Oftalmología", "Diagnóstico"],
  "Anestesiología": ["Anestesiología", "Cuidados Intensivos", "Procedimientos"]
};

// Extract city from hospital name
const extractCityFromHospital = (hospital: string): string => {
  if (hospital.includes("México")) return "Ciudad de México";
  if (hospital.includes("Tijuana")) return "Tijuana";
  if (hospital.includes("Santa Mónica")) return "Guadalajara";
  if (hospital.includes("Acoxpa")) return "Ciudad de México";
  if (hospital.includes("Londres")) return "Ciudad de México";
  if (hospital.includes("Ciudad Juárez")) return "Ciudad Juárez";
  if (hospital.includes("Pedregal")) return "Ciudad de México";
  if (hospital.includes("Lindavista")) return "Ciudad de México";
  if (hospital.includes("Lomas")) return "Ciudad de México";
  if (hospital.includes("Puebla")) return "Puebla";
  if (hospital.includes("Querétaro")) return "Querétaro";
  if (hospital.includes("León")) return "León";
  return "Ciudad de México";
};

export const SURGEONS_DATABASE: SurgeonData[] = [
  {
    id: "001",
    name: "Dr. José Luis Mosso Vázquez",
    specialty: "Cirugía General",
    hospital: "Hospital Ángeles México",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía General", "Gastroenterología"],
    experience: "15+ años",
    certifications: ["Consejo Mexicano de Cirugía General", "Especialidad UNAM"]
  },
  {
    id: "002",
    name: "Dra. Verónica Rojas Hernández",
    specialty: "Cirugía General",
    hospital: "Hospital Ángeles México",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía General", "Gastroenterología"],
    experience: "12+ años",
    certifications: ["Consejo Mexicano de Cirugía General"]
  },
  {
    id: "003",
    name: "Dr. Luis Cristóbal Zurita Macías Valadez",
    specialty: "Cirugía General",
    hospital: "Hospital Ángeles México",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía General", "Gastroenterología"],
    experience: "18+ años",
    certifications: ["Consejo Mexicano de Cirugía General", "Fellow ACS"]
  },
  {
    id: "004",
    name: "Dra. Margarita Elizabeth Flores Zaleta",
    specialty: "Ginecología y Obstetricia",
    hospital: "Hospital Ángeles México",
    city: "Ciudad de México",
    procedureCategories: ["Ginecología", "Obstetricia"],
    experience: "20+ años",
    certifications: ["Consejo Mexicano de Ginecología", "Perinatología"]
  },
  {
    id: "005",
    name: "Dr. Luis Alfonso Palafox De la Rosa",
    specialty: "Ortopedia y Traumatología",
    hospital: "Hospital Ángeles México",
    city: "Ciudad de México",
    procedureCategories: ["Ortopedia"],
    experience: "16+ años",
    certifications: ["Consejo Mexicano de Ortopedia", "Cirugía Artroscópica"]
  },
  {
    id: "006",
    name: "Dr. Pedro Leonel Puebla",
    specialty: "Cirugía Plástica",
    hospital: "Hospital Ángeles Tijuana",
    city: "Tijuana",
    procedureCategories: ["Cirugía Plástica", "Dermatología"],
    experience: "14+ años",
    certifications: ["Consejo Mexicano de Cirugía Plástica"]
  },
  {
    id: "007",
    name: "Dr. Juan Carlos González Cabrera",
    specialty: "Cirugía Pediátrica",
    hospital: "Hospital Ángeles Tijuana",
    city: "Tijuana",
    procedureCategories: ["Cirugía General", "Pediatría"],
    experience: "22+ años",
    certifications: ["Consejo Mexicano de Cirugía Pediátrica"]
  },
  {
    id: "008",
    name: "Dra. Guadalupe Carrillo Cisneros",
    specialty: "Cirugía de Mano / Cirugía Plástica",
    hospital: "Hospital Ángeles Tijuana",
    city: "Tijuana",
    procedureCategories: ["Cirugía Plástica", "Ortopedia"],
    experience: "13+ años",
    certifications: ["Cirugía de Mano", "Microcirugía"]
  },
  {
    id: "009",
    name: "Dr. Juan Ramón González Fuentes",
    specialty: "Ortopedia y Traumatología",
    hospital: "Hospital Ángeles Santa Mónica",
    city: "Guadalajara",
    procedureCategories: ["Ortopedia"],
    experience: "19+ años",
    certifications: ["Consejo Mexicano de Ortopedia", "Cirugía de Columna"]
  },
  {
    id: "010",
    name: "Dr. Boris Xavier Ortuño Numbela",
    specialty: "Ortopedia y Traumatología",
    hospital: "Hospital Ángeles Acoxpa",
    city: "Ciudad de México",
    procedureCategories: ["Ortopedia"],
    experience: "17+ años",
    certifications: ["Consejo Mexicano de Ortopedia"]
  },
  {
    id: "011",
    name: "Dr. Fernando Elizalde Flores",
    specialty: "Anestesiología",
    hospital: "Hospital Ángeles Clínica Londres",
    city: "Ciudad de México",
    procedureCategories: ["Anestesiología", "Cuidados Intensivos", "Procedimientos"],
    experience: "25+ años",
    certifications: ["Consejo Mexicano de Anestesiología", "Medicina del Dolor"]
  },
  {
    id: "012",
    name: "Dr. Fernando Serra Figueroa",
    specialty: "Cardiología",
    hospital: "Hospital Ángeles Clínica Londres",
    city: "Ciudad de México",
    procedureCategories: ["Cardiología", "Cirugía Cardiovascular"],
    experience: "21+ años",
    certifications: ["Consejo Mexicano de Cardiología", "Hemodinamia"]
  },
  {
    id: "013",
    name: "Dr. Raúl Zavala Baños",
    specialty: "Anestesiología",
    hospital: "Hospital Ángeles Ciudad Juárez",
    city: "Ciudad Juárez",
    procedureCategories: ["Anestesiología", "Cuidados Intensivos", "Procedimientos"],
    experience: "18+ años",
    certifications: ["Consejo Mexicano de Anestesiología"]
  },
  {
    id: "014",
    name: "Dra. Gabriela Cristiani Ortiz",
    specialty: "Cardiología",
    hospital: "Hospital Ángeles Ciudad Juárez",
    city: "Ciudad Juárez",
    procedureCategories: ["Cardiología", "Cirugía Cardiovascular"],
    experience: "16+ años",
    certifications: ["Consejo Mexicano de Cardiología", "Ecocardiografía"]
  },
  {
    id: "015",
    name: "Dr. Leocadio Gerardo Muñoz Beltrán",
    specialty: "Cardiología",
    hospital: "Hospital Ángeles Ciudad Juárez",
    city: "Ciudad Juárez",
    procedureCategories: ["Cardiología", "Cirugía Cardiovascular"],
    experience: "23+ años",
    certifications: ["Consejo Mexicano de Cardiología", "Fellow ACC"]
  },
  {
    id: "016",
    name: "Dr. Humberto Acuña Tapia",
    specialty: "Cardiología",
    hospital: "Hospital Ángeles Ciudad Juárez",
    city: "Ciudad Juárez",
    procedureCategories: ["Cardiología", "Cirugía Cardiovascular"],
    experience: "20+ años",
    certifications: ["Consejo Mexicano de Cardiología"]
  },
  {
    id: "017",
    name: "Dr. Carlos Alberto Gutiérrez Torpey",
    specialty: "Cardiología Pediátrica",
    hospital: "Hospital Ángeles Ciudad Juárez",
    city: "Ciudad Juárez",
    procedureCategories: ["Cardiología", "Pediatría"],
    experience: "15+ años",
    certifications: ["Cardiología Pediátrica", "Cateterismo Pediátrico"]
  },
  {
    id: "018",
    name: "Dr. Rafael Garza Castillón",
    specialty: "Cirugía de Tórax",
    hospital: "Hospital Ángeles Ciudad Juárez",
    city: "Ciudad Juárez",
    procedureCategories: ["Cirugía Cardiovascular", "Neumología"],
    experience: "24+ años",
    certifications: ["Consejo Mexicano de Cirugía de Tórax"]
  },
  // Adding some of the fictional names with realistic medical credentials
  {
    id: "019",
    name: "Dr. Clark García Martínez",
    specialty: "Cardiología",
    hospital: "Hospital Ángeles México",
    city: "Ciudad de México",
    procedureCategories: ["Cardiología", "Cirugía Cardiovascular"],
    experience: "18+ años",
    certifications: ["Consejo Mexicano de Cardiología", "Electrofisiología"]
  },
  {
    id: "020",
    name: "Dr. Kirk Douglas Hernández",
    specialty: "Cirugía Plástica",
    hospital: "Hospital Ángeles México",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía Plástica", "Dermatología"],
    experience: "16+ años",
    certifications: ["Consejo Mexicano de Cirugía Plástica", "Cirugía Estética"]
  },
  {
    id: "021",
    name: "Dra. Sandra Bullock López",
    specialty: "Cirugía Pediátrica",
    hospital: "Hospital Ángeles México",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía General", "Pediatría"],
    experience: "14+ años",
    certifications: ["Consejo Mexicano de Cirugía Pediátrica"]
  },
  {
    id: "022",
    name: "Dr. Ben Affleck Rodríguez",
    specialty: "Anestesiología",
    hospital: "Hospital Ángeles México",
    city: "Ciudad de México",
    procedureCategories: ["Anestesiología", "Cuidados Intensivos", "Procedimientos"],
    experience: "12+ años",
    certifications: ["Consejo Mexicano de Anestesiología"]
  },
  {
    id: "023",
    name: "Dra. Greta Garbo Sánchez",
    specialty: "Neurocirugía",
    hospital: "Hospital Ángeles México",
    city: "Ciudad de México",
    procedureCategories: ["Neurocirugía"],
    experience: "22+ años",
    certifications: ["Consejo Mexicano de Neurocirugía", "Cirugía Vascular Cerebral"]
  },
  {
    id: "024",
    name: "Dra. Angelina Jolie Morales",
    specialty: "Urología",
    hospital: "Hospital Ángeles México",
    city: "Ciudad de México",
    procedureCategories: ["Urología"],
    experience: "17+ años",
    certifications: ["Consejo Mexicano de Urología", "Laparoscopia Urológica"]
  },
  {
    id: "025",
    name: "Dr. Tom Hanks Rivera",
    specialty: "Oftalmología",
    hospital: "Hospital Ángeles México",
    city: "Ciudad de México",
    procedureCategories: ["Oftalmología", "Diagnóstico"],
    experience: "19+ años",
    certifications: ["Consejo Mexicano de Oftalmología", "Cirugía de Retina"]
  },
  {
    id: "026",
    name: "Dra. Natalie Portman González",
    specialty: "Cirugía General",
    hospital: "Hospital Ángeles Pedregal",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía General", "Gastroenterología"],
    experience: "15+ años",
    certifications: ["Consejo Mexicano de Cirugía General"]
  },
  {
    id: "027",
    name: "Dr. Morgan Freeman Díaz",
    specialty: "Ginecología y Obstetricia",
    hospital: "Hospital Ángeles Pedregal",
    city: "Ciudad de México",
    procedureCategories: ["Ginecología", "Obstetricia"],
    experience: "28+ años",
    certifications: ["Consejo Mexicano de Ginecología", "Medicina Materno Fetal"]
  },
  {
    id: "028",
    name: "Dr. James Stewart Vargas",
    specialty: "Ortopedia y Traumatología",
    hospital: "Hospital Ángeles Pedregal",
    city: "Ciudad de México",
    procedureCategories: ["Ortopedia"],
    experience: "21+ años",
    certifications: ["Consejo Mexicano de Ortopedia", "Reemplazo Articular"]
  },
  {
    id: "029",
    name: "Dra. Debbie Reynolds Castro",
    specialty: "Cardiología",
    hospital: "Hospital Ángeles Pedregal",
    city: "Ciudad de México",
    procedureCategories: ["Cardiología", "Cirugía Cardiovascular"],
    experience: "18+ años",
    certifications: ["Consejo Mexicano de Cardiología"]
  },
  {
    id: "030",
    name: "Dr. Anthony Hopkins Jiménez",
    specialty: "Cirugía Plástica",
    hospital: "Hospital Ángeles Pedregal",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía Plástica", "Dermatología"],
    experience: "25+ años",
    certifications: ["Consejo Mexicano de Cirugía Plástica", "ISAPS Fellow"]
  },
  // Continue with more surgeons for other hospitals...
  {
    id: "031",
    name: "Dr. Gary Cooper Silva",
    specialty: "Cirugía Pediátrica",
    hospital: "Hospital Ángeles Pedregal",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía General", "Pediatría"],
    experience: "16+ años",
    certifications: ["Consejo Mexicano de Cirugía Pediátrica"]
  },
  {
    id: "032",
    name: "Dr. Clint Eastwood Mendoza",
    specialty: "Anestesiología",
    hospital: "Hospital Ángeles Pedregal",
    city: "Ciudad de México",
    procedureCategories: ["Anestesiología", "Cuidados Intensivos", "Procedimientos"],
    experience: "23+ años",
    certifications: ["Consejo Mexicano de Anestesiología", "Medicina del Dolor"]
  },
  {
    id: "033",
    name: "Dr. Christian Bale Torres",
    specialty: "Neurocirugía",
    hospital: "Hospital Ángeles Pedregal",
    city: "Ciudad de México",
    procedureCategories: ["Neurocirugía"],
    experience: "19+ años",
    certifications: ["Consejo Mexicano de Neurocirugía", "Cirugía de Columna"]
  },
  {
    id: "034",
    name: "Dr. Johnny Depp Ruiz",
    specialty: "Urología",
    hospital: "Hospital Ángeles Pedregal",
    city: "Ciudad de México",
    procedureCategories: ["Urología"],
    experience: "14+ años",
    certifications: ["Consejo Mexicano de Urología"]
  },
  {
    id: "035",
    name: "Dra. Glenn Close Fernández",
    specialty: "Oftalmología",
    hospital: "Hospital Ángeles Pedregal",
    city: "Ciudad de México",
    procedureCategories: ["Oftalmología", "Diagnóstico"],
    experience: "20+ años",
    certifications: ["Consejo Mexicano de Oftalmología", "Glaucoma"]
  },
  // Lindavista Hospital surgeons
  {
    id: "036",
    name: "Dra. Ginger Rogers Martín",
    specialty: "Cirugía General",
    hospital: "Hospital Ángeles Lindavista",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía General", "Gastroenterología"],
    experience: "17+ años",
    certifications: ["Consejo Mexicano de Cirugía General", "Cirugía Laparoscópica"]
  },
  {
    id: "037",
    name: "Dr. Chris Evans Herrera",
    specialty: "Ginecología y Obstetricia",
    hospital: "Hospital Ángeles Lindavista",
    city: "Ciudad de México",
    procedureCategories: ["Ginecología", "Obstetricia"],
    experience: "13+ años",
    certifications: ["Consejo Mexicano de Ginecología"]
  },
  {
    id: "038",
    name: "Dr. Joaquin Phoenix Campos",
    specialty: "Ortopedia y Traumatología",
    hospital: "Hospital Ángeles Lindavista",
    city: "Ciudad de México",
    procedureCategories: ["Ortopedia"],
    experience: "18+ años",
    certifications: ["Consejo Mexicano de Ortopedia", "Traumatología Deportiva"]
  },
  {
    id: "039",
    name: "Dr. George Clooney Vega",
    specialty: "Cardiología",
    hospital: "Hospital Ángeles Lindavista",
    city: "Ciudad de México",
    procedureCategories: ["Cardiología", "Cirugía Cardiovascular"],
    experience: "24+ años",
    certifications: ["Consejo Mexicano de Cardiología", "Cardiología Intervencionista"]
  },
  {
    id: "040",
    name: "Dra. Olivia de Havilland Ramírez",
    specialty: "Cirugía Plástica",
    hospital: "Hospital Ángeles Lindavista",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía Plástica", "Dermatología"],
    experience: "16+ años",
    certifications: ["Consejo Mexicano de Cirugía Plástica"]
  },
  // Lindavista Hospital surgeons (continued)
  {
    id: "041",
    name: "Dr. Burt Lancaster Castillo",
    specialty: "Cirugía Pediátrica",
    hospital: "Hospital Ángeles Lindavista",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía General", "Pediatría"],
    experience: "21+ años",
    certifications: ["Consejo Mexicano de Cirugía Pediátrica"]
  },
  {
    id: "042",
    name: "Dr. Samuel L. Jackson Morales",
    specialty: "Anestesiología",
    hospital: "Hospital Ángeles Lindavista",
    city: "Ciudad de México",
    procedureCategories: ["Anestesiología", "Cuidados Intensivos", "Procedimientos"],
    experience: "19+ años",
    certifications: ["Consejo Mexicano de Anestesiología", "Medicina del Dolor"]
  },
  {
    id: "043",
    name: "Dra. Reese Witherspoon López",
    specialty: "Neurocirugía",
    hospital: "Hospital Ángeles Lindavista",
    city: "Ciudad de México",
    procedureCategories: ["Neurocirugía"],
    experience: "16+ años",
    certifications: ["Consejo Mexicano de Neurocirugía", "Cirugía de Base de Cráneo"]
  },
  {
    id: "044",
    name: "Dra. Greta Garbo Torres",
    specialty: "Urología",
    hospital: "Hospital Ángeles Lindavista",
    city: "Ciudad de México",
    procedureCategories: ["Urología"],
    experience: "18+ años",
    certifications: ["Consejo Mexicano de Urología", "Endourología"]
  },
  {
    id: "045",
    name: "Dr. Harrison Ford Jiménez",
    specialty: "Oftalmología",
    hospital: "Hospital Ángeles Lindavista",
    city: "Ciudad de México",
    procedureCategories: ["Oftalmología", "Diagnóstico"],
    experience: "23+ años",
    certifications: ["Consejo Mexicano de Oftalmología", "Cirugía de Córnea"]
  },
  
  // Lomas Hospital surgeons
  {
    id: "046",
    name: "Dra. Sophia Loren Ramírez",
    specialty: "Cirugía General",
    hospital: "Hospital Ángeles Lomas",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía General", "Gastroenterología"],
    experience: "20+ años",
    certifications: ["Consejo Mexicano de Cirugía General", "Cirugía Bariátrica"]
  },
  {
    id: "047",
    name: "Dra. Rita Hayworth Silva",
    specialty: "Ginecología y Obstetricia",
    hospital: "Hospital Ángeles Lomas",
    city: "Ciudad de México",
    procedureCategories: ["Ginecología", "Obstetricia"],
    experience: "24+ años",
    certifications: ["Consejo Mexicano de Ginecología", "Cirugía Endoscópica Ginecológica"]
  },
  {
    id: "048",
    name: "Dra. Lauren Bacall Hernández",
    specialty: "Ortopedia y Traumatología",
    hospital: "Hospital Ángeles Lomas",
    city: "Ciudad de México",
    procedureCategories: ["Ortopedia"],
    experience: "17+ años",
    certifications: ["Consejo Mexicano de Ortopedia", "Cirugía de Pie y Tobillo"]
  },
  {
    id: "049",
    name: "Dr. James Dean García",
    specialty: "Cardiología",
    hospital: "Hospital Ángeles Lomas",
    city: "Ciudad de México",
    procedureCategories: ["Cardiología", "Cirugía Cardiovascular"],
    experience: "19+ años",
    certifications: ["Consejo Mexicano de Cardiología", "Medicina Nuclear Cardiológica"]
  },
  {
    id: "050",
    name: "Dra. Elizabeth Taylor Vega",
    specialty: "Cirugía Plástica",
    hospital: "Hospital Ángeles Lomas",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía Plástica", "Dermatología"],
    experience: "22+ años",
    certifications: ["Consejo Mexicano de Cirugía Plástica", "Fellow ISAPS"]
  },
  {
    id: "051",
    name: "Dra. Sophia Loren Castro",
    specialty: "Cirugía Pediátrica",
    hospital: "Hospital Ángeles Lomas",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía General", "Pediatría"],
    experience: "18+ años",
    certifications: ["Consejo Mexicano de Cirugía Pediátrica", "Laparoscopia Pediátrica"]
  },
  {
    id: "052",
    name: "Dr. Charlton Heston Mendoza",
    specialty: "Anestesiología",
    hospital: "Hospital Ángeles Lomas",
    city: "Ciudad de México",
    procedureCategories: ["Anestesiología", "Cuidados Intensivos", "Procedimientos"],
    experience: "26+ años",
    certifications: ["Consejo Mexicano de Anestesiología", "Fellow ASA"]
  },
  {
    id: "053",
    name: "Dr. Jack Nicholson Ruiz",
    specialty: "Neurocirugía",
    hospital: "Hospital Ángeles Lomas",
    city: "Ciudad de México",
    procedureCategories: ["Neurocirugía"],
    experience: "25+ años",
    certifications: ["Consejo Mexicano de Neurocirugía", "Neurocirugía Funcional"]
  },
  {
    id: "054",
    name: "Dra. Anne Bancroft Fernández",
    specialty: "Urología",
    hospital: "Hospital Ángeles Lomas",
    city: "Ciudad de México",
    procedureCategories: ["Urología"],
    experience: "16+ años",
    certifications: ["Consejo Mexicano de Urología", "Cirugía Robótica"]
  },
  {
    id: "055",
    name: "Dr. Leonardo DiCaprio Morales",
    specialty: "Oftalmología",
    hospital: "Hospital Ángeles Lomas",
    city: "Ciudad de México",
    procedureCategories: ["Oftalmología", "Diagnóstico"],
    experience: "14+ años",
    certifications: ["Consejo Mexicano de Oftalmología", "Cirugía Refractiva"]
  },

  // Acoxpa Hospital surgeons (continued)
  {
    id: "056",
    name: "Dr. Hugh Jackman Álvarez",
    specialty: "Cirugía General",
    hospital: "Hospital Ángeles Acoxpa",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía General", "Gastroenterología"],
    experience: "17+ años",
    certifications: ["Consejo Mexicano de Cirugía General", "Cirugía Hepatobiliar"]
  },
  {
    id: "057",
    name: "Dra. Viola Davis Martínez",
    specialty: "Ginecología y Obstetricia",
    hospital: "Hospital Ángeles Acoxpa",
    city: "Ciudad de México",
    procedureCategories: ["Ginecología", "Obstetricia"],
    experience: "21+ años",
    certifications: ["Consejo Mexicano de Ginecología", "Medicina Materno Fetal"]
  },
  {
    id: "058",
    name: "Dr. Paul Newman González",
    specialty: "Cardiología",
    hospital: "Hospital Ángeles Acoxpa",
    city: "Ciudad de México",
    procedureCategories: ["Cardiología", "Cirugía Cardiovascular"],
    experience: "28+ años",
    certifications: ["Consejo Mexicano de Cardiología", "Fellow ACC"]
  },
  {
    id: "059",
    name: "Dr. Orson Welles Díaz",
    specialty: "Cirugía Plástica",
    hospital: "Hospital Ángeles Acoxpa",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía Plástica", "Dermatología"],
    experience: "19+ años",
    certifications: ["Consejo Mexicano de Cirugía Plástica", "Microcirugía Reconstructiva"]
  },
  {
    id: "060",
    name: "Dr. Heath Ledger Vargas",
    specialty: "Cirugía Pediátrica",
    hospital: "Hospital Ángeles Acoxpa",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía General", "Pediatría"],
    experience: "15+ años",
    certifications: ["Consejo Mexicano de Cirugía Pediátrica"]
  },
  {
    id: "061",
    name: "Dra. Shirley MacLaine Torres",
    specialty: "Anestesiología",
    hospital: "Hospital Ángeles Acoxpa",
    city: "Ciudad de México",
    procedureCategories: ["Anestesiología", "Cuidados Intensivos", "Procedimientos"],
    experience: "22+ años",
    certifications: ["Consejo Mexicano de Anestesiología", "Anestesia Pediátrica"]
  },
  {
    id: "062",
    name: "Dr. Will Smith Herrera",
    specialty: "Neurocirugía",
    hospital: "Hospital Ángeles Acoxpa",
    city: "Ciudad de México",
    procedureCategories: ["Neurocirugía"],
    experience: "20+ años",
    certifications: ["Consejo Mexicano de Neurocirugía", "Neurocirugía Vascular"]
  },
  {
    id: "063",
    name: "Dr. Spencer Tracy López",
    specialty: "Urología",
    hospital: "Hospital Ángeles Acoxpa",
    city: "Ciudad de México",
    procedureCategories: ["Urología"],
    experience: "24+ años",
    certifications: ["Consejo Mexicano de Urología", "Uro-Oncología"]
  },
  {
    id: "064",
    name: "Dr. Ryan Gosling Campos",
    specialty: "Oftalmología",
    hospital: "Hospital Ángeles Acoxpa",
    city: "Ciudad de México",
    procedureCategories: ["Oftalmología", "Diagnóstico"],
    experience: "13+ años",
    certifications: ["Consejo Mexicano de Oftalmología", "Retina y Vítreo"]
  },

  // Clínica Londres Hospital surgeons (continued)
  {
    id: "065",
    name: "Dra. Julia Roberts Silva",
    specialty: "Cirugía General",
    hospital: "Hospital Ángeles Clínica Londres",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía General", "Gastroenterología"],
    experience: "18+ años",
    certifications: ["Consejo Mexicano de Cirugía General", "Cirugía Endoscópica"]
  },
  {
    id: "066",
    name: "Dra. Katharine Hepburn Morales",
    specialty: "Ginecología y Obstetricia",
    hospital: "Hospital Ángeles Clínica Londres",
    city: "Ciudad de México",
    procedureCategories: ["Ginecología", "Obstetricia"],
    experience: "27+ años",
    certifications: ["Consejo Mexicano de Ginecología", "Ginecología Oncológica"]
  },
  {
    id: "067",
    name: "Dra. Bette Davis Ruiz",
    specialty: "Ortopedia y Traumatología",
    hospital: "Hospital Ángeles Clínica Londres",
    city: "Ciudad de México",
    procedureCategories: ["Ortopedia"],
    experience: "23+ años",
    certifications: ["Consejo Mexicano de Ortopedia", "Cirugía de Cadera"]
  },
  {
    id: "068",
    name: "Dr. Rock Hudson García",
    specialty: "Cirugía Plástica",
    hospital: "Hospital Ángeles Clínica Londres",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía Plástica", "Dermatología"],
    experience: "21+ años",
    certifications: ["Consejo Mexicano de Cirugía Plástica", "Cirugía Craneofacial"]
  },
  {
    id: "069",
    name: "Dra. Cate Blanchett Fernández",
    specialty: "Cirugía Pediátrica",
    hospital: "Hospital Ángeles Clínica Londres",
    city: "Ciudad de México",
    procedureCategories: ["Cirugía General", "Pediatría"],
    experience: "16+ años",
    certifications: ["Consejo Mexicano de Cirugía Pediátrica", "Cirugía Neonatal"]
  },
  {
    id: "070",
    name: "Dr. Philip Seymour Hoffman Castro",
    specialty: "Neurocirugía",
    hospital: "Hospital Ángeles Clínica Londres",
    city: "Ciudad de México",
    procedureCategories: ["Neurocirugía"],
    experience: "19+ años",
    certifications: ["Consejo Mexicano de Neurocirugía", "Neurocirugía Oncológica"]
  },
  {
    id: "071",
    name: "Dra. Amy Adams Mendoza",
    specialty: "Urología",
    hospital: "Hospital Ángeles Clínica Londres",
    city: "Ciudad de México",
    procedureCategories: ["Urología"],
    experience: "14+ años",
    certifications: ["Consejo Mexicano de Urología", "Urología Femenina"]
  },
  {
    id: "072",
    name: "Dr. Christopher Walken Jiménez",
    specialty: "Oftalmología",
    hospital: "Hospital Ángeles Clínica Londres",
    city: "Ciudad de México",
    procedureCategories: ["Oftalmología", "Diagnóstico"],
    experience: "25+ años",
    certifications: ["Consejo Mexicano de Oftalmología", "Oculoplástica"]
  },

  // Puebla Hospital surgeons
  {
    id: "073",
    name: "Dr. Cary Grant Álvarez",
    specialty: "Cirugía General",
    hospital: "Hospital Ángeles Puebla",
    city: "Puebla",
    procedureCategories: ["Cirugía General", "Gastroenterología"],
    experience: "22+ años",
    certifications: ["Consejo Mexicano de Cirugía General", "Cirugía Oncológica"]
  },
  {
    id: "074",
    name: "Dr. Errol Flynn Torres",
    specialty: "Ginecología y Obstetricia",
    hospital: "Hospital Ángeles Puebla",
    city: "Puebla",
    procedureCategories: ["Ginecología", "Obstetricia"],
    experience: "20+ años",
    certifications: ["Consejo Mexicano de Ginecología", "Reproducción Asistida"]
  },
  {
    id: "075",
    name: "Dr. Tom Cruise Vega",
    specialty: "Ortopedia y Traumatología",
    hospital: "Hospital Ángeles Puebla",
    city: "Puebla",
    procedureCategories: ["Ortopedia"],
    experience: "18+ años",
    certifications: ["Consejo Mexicano de Ortopedia", "Artroscopia Avanzada"]
  },
  {
    id: "076",
    name: "Dr. John Wayne Moreno",
    specialty: "Cardiología",
    hospital: "Hospital Ángeles Puebla",
    city: "Puebla",
    procedureCategories: ["Cardiología", "Cirugía Cardiovascular"],
    experience: "26+ años",
    certifications: ["Consejo Mexicano de Cardiología", "Fellow AHA"]
  },
  {
    id: "077",
    name: "Dr. Denzel Washington Hernández",
    specialty: "Cirugía Plástica",
    hospital: "Hospital Ángeles Puebla",
    city: "Puebla",
    procedureCategories: ["Cirugía Plástica", "Dermatología"],
    experience: "17+ años",
    certifications: ["Consejo Mexicano de Cirugía Plástica"]
  },
  {
    id: "078",
    name: "Dr. Keanu Reeves Silva",
    specialty: "Cirugía Pediátrica",
    hospital: "Hospital Ángeles Puebla",
    city: "Puebla",
    procedureCategories: ["Cirugía General", "Pediatría"],
    experience: "15+ años",
    certifications: ["Consejo Mexicano de Cirugía Pediátrica"]
  },
  {
    id: "079",
    name: "Dr. Matt Damon López",
    specialty: "Anestesiología",
    hospital: "Hospital Ángeles Puebla",
    city: "Puebla",
    procedureCategories: ["Anestesiología", "Cuidados Intensivos", "Procedimientos"],
    experience: "14+ años",
    certifications: ["Consejo Mexicano de Anestesiología"]
  },
  {
    id: "080",
    name: "Dra. Anne Hathaway García",
    specialty: "Neurocirugía",
    hospital: "Hospital Ángeles Puebla",
    city: "Puebla",
    procedureCategories: ["Neurocirugía"],
    experience: "16+ años",
    certifications: ["Consejo Mexicano de Neurocirugía", "Cirugía de Epilepsia"]
  },
  {
    id: "081",
    name: "Dra. Scarlett Johansson Ruiz",
    specialty: "Urología",
    hospital: "Hospital Ángeles Puebla",
    city: "Puebla",
    procedureCategories: ["Urología"],
    experience: "12+ años",
    certifications: ["Consejo Mexicano de Urología"]
  },
  {
    id: "082",
    name: "Dra. Jodie Foster Castro",
    specialty: "Oftalmología",
    hospital: "Hospital Ángeles Puebla",
    city: "Puebla",
    procedureCategories: ["Oftalmología", "Diagnóstico"],
    experience: "19+ años",
    certifications: ["Consejo Mexicano de Oftalmología", "Cirugía de Cataratas"]
  },

  // Querétaro Hospital surgeons
  {
    id: "083",
    name: "Dra. Judy Garland Morales",
    specialty: "Cirugía General",
    hospital: "Hospital Ángeles Querétaro",
    city: "Querétaro",
    procedureCategories: ["Cirugía General", "Gastroenterología"],
    experience: "21+ años",
    certifications: ["Consejo Mexicano de Cirugía General", "Cirugía Laparoscópica Avanzada"]
  },
  {
    id: "084",
    name: "Dra. Grace Kelly Fernández",
    specialty: "Ginecología y Obstetricia",
    hospital: "Hospital Ángeles Querétaro",
    city: "Querétaro",
    procedureCategories: ["Ginecología", "Obstetricia"],
    experience: "23+ años",
    certifications: ["Consejo Mexicano de Ginecología", "Colposcopia"]
  },
  {
    id: "085",
    name: "Dr. Peter O'Toole Jiménez",
    specialty: "Ortopedia y Traumatología",
    hospital: "Hospital Ángeles Querétaro",
    city: "Querétaro",
    procedureCategories: ["Ortopedia"],
    experience: "25+ años",
    certifications: ["Consejo Mexicano de Ortopedia", "Cirugía de Columna Cervical"]
  },
  {
    id: "086",
    name: "Dr. Alec Guinness Peña",
    specialty: "Cardiología",
    hospital: "Hospital Ángeles Querétaro",
    city: "Querétaro",
    procedureCategories: ["Cardiología", "Cirugía Cardiovascular"],
    experience: "21+ años",
    certifications: ["Consejo Mexicano de Cardiología", "Electrofisiología"]
  },
  {
    id: "087",
    name: "Dra. Marilyn Monroe Vega",
    specialty: "Cirugía Plástica",
    hospital: "Hospital Ángeles Querétaro",
    city: "Querétaro",
    procedureCategories: ["Cirugía Plástica", "Dermatología"],
    experience: "18+ años",
    certifications: ["Consejo Mexicano de Cirugía Plástica", "Cirugía Estética Facial"]
  },
  {
    id: "088",
    name: "Dr. Mickey Rooney Herrera",
    specialty: "Cirugía Pediátrica",
    hospital: "Hospital Ángeles Querétaro",
    city: "Querétaro",
    procedureCategories: ["Cirugía General", "Pediatría"],
    experience: "20+ años",
    certifications: ["Consejo Mexicano de Cirugía Pediátrica", "Urología Pediátrica"]
  },
  {
    id: "089",
    name: "Dra. Michelle Pfeiffer Torres",
    specialty: "Anestesiología",
    hospital: "Hospital Ángeles Querétaro",
    city: "Querétaro",
    procedureCategories: ["Anestesiología", "Cuidados Intensivos", "Procedimientos"],
    experience: "17+ años",
    certifications: ["Consejo Mexicano de Anestesiología", "Anestesia Obstétrica"]
  },
  {
    id: "090",
    name: "Dr. Robert De Niro López",
    specialty: "Neurocirugía",
    hospital: "Hospital Ángeles Querétaro",
    city: "Querétaro",
    procedureCategories: ["Neurocirugía"],
    experience: "24+ años",
    certifications: ["Consejo Mexicano de Neurocirugía", "Neurocirugía Estereotáxica"]
  },
  {
    id: "091",
    name: "Dr. Humphrey Bogart Campos",
    specialty: "Urología",
    hospital: "Hospital Ángeles Querétaro",
    city: "Querétaro",
    procedureCategories: ["Urología"],
    experience: "22+ años",
    certifications: ["Consejo Mexicano de Urología", "Andrología"]
  },
  {
    id: "092",
    name: "Dra. Nicole Kidman Silva",
    specialty: "Oftalmología",
    hospital: "Hospital Ángeles Querétaro",
    city: "Querétaro",
    procedureCategories: ["Oftalmología", "Diagnóstico"],
    experience: "15+ años",
    certifications: ["Consejo Mexicano de Oftalmología", "Oftalmología Pediátrica"]
  },

  // León Hospital surgeons
  {
    id: "093",
    name: "Dra. Doris Day Martínez",
    specialty: "Cirugía General",
    hospital: "Hospital Ángeles León",
    city: "León",
    procedureCategories: ["Cirugía General", "Gastroenterología"],
    experience: "19+ años",
    certifications: ["Consejo Mexicano de Cirugía General", "Cirugía Colorrectal"]
  },
  {
    id: "094",
    name: "Dra. Vivien Leigh González",
    specialty: "Ginecología y Obstetricia",
    hospital: "Hospital Ángeles León",
    city: "León",
    procedureCategories: ["Ginecología", "Obstetricia"],
    experience: "22+ años",
    certifications: ["Consejo Mexicano de Ginecología", "Ginecología Infantil y de la Adolescencia"]
  },
  {
    id: "095",
    name: "Dr. Tony Curtis Hernández",
    specialty: "Ortopedia y Traumatología",
    hospital: "Hospital Ángeles León",
    city: "León",
    procedureCategories: ["Ortopedia"],
    experience: "26+ años",
    certifications: ["Consejo Mexicano de Ortopedia", "Cirugía de Rodilla"]
  },
  {
    id: "096",
    name: "Dra. Kate Winslet Ortega",
    specialty: "Cardiología",
    hospital: "Hospital Ángeles León",
    city: "León",
    procedureCategories: ["Cardiología", "Cirugía Cardiovascular"],
    experience: "15+ años",
    certifications: ["Consejo Mexicano de Cardiología"]
  },
  {
    id: "097",
    name: "Dr. Charles Chaplin Ruiz",
    specialty: "Cirugía Plástica",
    hospital: "Hospital Ángeles León",
    city: "León",
    procedureCategories: ["Cirugía Plástica", "Dermatología"],
    experience: "20+ años",
    certifications: ["Consejo Mexicano de Cirugía Plástica", "Reconstrucción Mamaria"]
  },
  {
    id: "098",
    name: "Dr. Fred Astaire Castro",
    specialty: "Cirugía Pediátrica",
    hospital: "Hospital Ángeles León",
    city: "León",
    procedureCategories: ["Cirugía General", "Pediatría"],
    experience: "18+ años",
    certifications: ["Consejo Mexicano de Cirugía Pediátrica", "Cirugía Torácica Pediátrica"]
  },
  {
    id: "099",
    name: "Dra. Audrey Hepburn Vega",
    specialty: "Anestesiología",
    hospital: "Hospital Ángeles León",
    city: "León",
    procedureCategories: ["Anestesiología", "Cuidados Intensivos", "Procedimientos"],
    experience: "21+ años",
    certifications: ["Consejo Mexicano de Anestesiología", "Anestesia Cardiotorácica"]
  },
  {
    id: "100",
    name: "Dr. Steve McQueen Morales",
    specialty: "Neurocirugía",
    hospital: "Hospital Ángeles León",
    city: "León",
    procedureCategories: ["Neurocirugía"],
    experience: "17+ años",
    certifications: ["Consejo Mexicano de Neurocirugía", "Neurocirugía Pediátrica"]
  }
];

// Function to normalize hospital names for comparison
const normalizeHospitalName = (hospital: string): string => {
  // Remove location details in parentheses and trim
  return hospital.replace(/\s*\([^)]*\)/g, '').trim();
};

// Function to filter surgeons by hospital
export const filterSurgeonsByHospital = (hospital: string): SurgeonData[] => {
  if (!hospital) return SURGEONS_DATABASE;
  const normalizedHospital = normalizeHospitalName(hospital);
  return SURGEONS_DATABASE.filter(surgeon => 
    normalizeHospitalName(surgeon.hospital) === normalizedHospital
  );
};

// Function to filter surgeons by procedure category
export const filterSurgeonsByProcedure = (procedureCategory: string): SurgeonData[] => {
  if (!procedureCategory) return SURGEONS_DATABASE;
  return SURGEONS_DATABASE.filter(surgeon => 
    surgeon.procedureCategories.includes(procedureCategory)
  );
};

// Function to filter surgeons by both hospital and procedure
export const filterSurgeonsByHospitalAndProcedure = (
  hospital: string, 
  procedureCategory: string
): SurgeonData[] => {
  let filteredSurgeons = SURGEONS_DATABASE;
  
  if (hospital) {
    const normalizedHospital = normalizeHospitalName(hospital);
    filteredSurgeons = filteredSurgeons.filter(surgeon => 
      normalizeHospitalName(surgeon.hospital) === normalizedHospital
    );
  }
  
  if (procedureCategory) {
    filteredSurgeons = filteredSurgeons.filter(surgeon => 
      surgeon.procedureCategories.includes(procedureCategory)
    );
  }
  
  return filteredSurgeons;
};

// Function to get available surgeons count for a hospital/procedure combination
export const getAvailableSurgeonsCount = (hospital: string, procedureCategory: string): number => {
  return filterSurgeonsByHospitalAndProcedure(hospital, procedureCategory).length;
};

// Function to get unique hospitals
export const getUniqueHospitals = (): string[] => {
  return [...new Set(SURGEONS_DATABASE.map(surgeon => surgeon.hospital))].sort();
};

// Function to get specialties available at a hospital
export const getSpecialtiesByHospital = (hospital: string): string[] => {
  const hospitalSurgeons = filterSurgeonsByHospital(hospital);
  return [...new Set(hospitalSurgeons.map(surgeon => surgeon.specialty))].sort();
};