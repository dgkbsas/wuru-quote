import { createClient } from '@supabase/supabase-js'

// Get environment variables from process.env
const supabaseUrl = 'https://tmrpzerzzikxrwtetzcq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtcnB6ZXJ6emlreHJ3dGV0emNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNTkzODEsImV4cCI6MjA3MjgzNTM4MX0.VjFcfPhod_q7Ap4vNN27BCd70vpilRBx2AzcTg7WlmQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Sample procedures from the data
const procedures = [
  {
    code: "06.31",
    title: "Apendicectomía laparoscópica",
    complexity: "Media",
    duration: "1-2 horas",
    category: "Cirugía General",
    cost: { min: 35000, max: 55000 }
  },
  {
    code: "51.23",
    title: "Colecistectomía laparoscópica",
    complexity: "Media",
    duration: "1-2 horas",
    category: "Cirugía General",
    cost: { min: 45000, max: 75000 }
  },
  {
    code: "81.51",
    title: "Reemplazo total de cadera",
    complexity: "Alta",
    duration: "2-4 horas",
    category: "Ortopedia",
    cost: { min: 180000, max: 320000 }
  },
  {
    code: "36.01",
    title: "Intervención coronaria percutánea de un vaso (ICP)",
    complexity: "Alta",
    duration: "1-3 horas",
    category: "Cardiología",
    cost: { min: 150000, max: 280000 }
  },
  {
    code: "68.49",
    title: "Otra histerectomía abdominal total",
    complexity: "Media",
    duration: "2-3 horas",
    category: "Ginecología",
    cost: { min: 75000, max: 120000 }
  },
  {
    code: "01.09",
    title: "Otra escisión de lesión cerebral",
    complexity: "Muy Alta",
    duration: "4-8 horas",
    category: "Neurocirugía",
    cost: { min: 450000, max: 800000 }
  },
  {
    code: "55.51",
    title: "Nefrectomía, no especificada de otra manera",
    complexity: "Alta",
    duration: "3-5 horas",
    category: "Urología",
    cost: { min: 180000, max: 320000 }
  },
  {
    code: "40.11",
    title: "Mastectomía simple, unilateral",
    complexity: "Media",
    duration: "2-3 horas",
    category: "Oncología",
    cost: { min: 85000, max: 150000 }
  },
  {
    code: "72.1",
    title: "Operación cesárea, cervical baja",
    complexity: "Media",
    duration: "1-1.5 horas",
    category: "Obstetricia",
    cost: { min: 40000, max: 65000 }
  },
  {
    code: "88.01",
    title: "Resonancia magnética de cerebro",
    complexity: "Baja",
    duration: "30-60 minutos",
    category: "Radiología",
    cost: { min: 85000, max: 150000 }
  }
]

// Sample surgeons
const surgeons = [
  { name: "Dr. José Luis Mosso Vázquez", specialty: "Cirugía General", hospital: "Hospital Ángeles México" },
  { name: "Dra. Verónica Rojas Hernández", specialty: "Cirugía General", hospital: "Hospital Ángeles México" },
  { name: "Dra. Margarita Elizabeth Flores Zaleta", specialty: "Ginecología y Obstetricia", hospital: "Hospital Ángeles México" },
  { name: "Dr. Luis Alfonso Palafox De la Rosa", specialty: "Ortopedia y Traumatología", hospital: "Hospital Ángeles México" },
  { name: "Dr. Fernando Serra Figueroa", specialty: "Cardiología", hospital: "Hospital Ángeles Clínica Londres" },
  { name: "Dra. Greta Garbo Sánchez", specialty: "Neurocirugía", hospital: "Hospital Ángeles México" },
  { name: "Dra. Angelina Jolie Morales", specialty: "Urología", hospital: "Hospital Ángeles México" },
  { name: "Dr. Tom Hanks Rivera", specialty: "Oftalmología", hospital: "Hospital Ángeles México" },
  { name: "Dr. Morgan Freeman Díaz", specialty: "Ginecología y Obstetricia", hospital: "Hospital Ángeles Pedregal" },
  { name: "Dr. Anthony Hopkins Jiménez", specialty: "Cirugía Plástica", hospital: "Hospital Ángeles Pedregal" }
]

// Hospital list
const hospitals = [
  "Hospital Ángeles México",
  "Hospital Ángeles Tijuana",
  "Hospital Ángeles Santa Mónica",
  "Hospital Ángeles Acoxpa",
  "Hospital Ángeles Clínica Londres",
  "Hospital Ángeles Ciudad Juárez",
  "Hospital Ángeles Pedregal",
  "Hospital Ángeles Lindavista",
  "Hospital Ángeles Lomas",
  "Hospital Ángeles Puebla",
  "Hospital Ángeles Querétaro",
  "Hospital Ángeles León"
]

const patientTypes = ["particular", "eps", "prepagada", "soat"]
const statuses = ["pending", "approved", "rejected", "completed"]

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

async function clearDatabase() {
  console.log('🗑️ Clearing all quotations from database...')
  
  try {
    // First check if table exists and current count
    const { count: currentCount, error: countError } = await supabase
      .from('quotations')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      if (countError.code === 'PGRST116' || countError.message.includes('does not exist')) {
        console.log('📋 Table does not exist, will be created during seeding')
        return true
      }
      console.error('❌ Error checking table:', countError.message)
      return false
    }
    
    console.log(`📊 Current quotations in database: ${currentCount || 0}`)
    
    if (!currentCount || currentCount === 0) {
      console.log('✅ Database is already empty')
      return true
    }
    
    // Delete all records
    const { error } = await supabase
      .from('quotations')
      .delete()
      .neq('id', 'impossible-id') // This will delete all records
    
    if (error) {
      console.error('❌ Error clearing database:', error.message)
      return false
    }
    
    // Verify deletion
    const { count: newCount } = await supabase
      .from('quotations')
      .select('*', { count: 'exact', head: true })
    
    console.log(`✅ All quotations cleared successfully. Remaining: ${newCount || 0}`)
    return true
    
  } catch (error) {
    console.error('❌ Failed to clear database:', error)
    return false
  }
}

async function seedDatabase() {
  console.log('🌱 Creating 10 new example quotations...')
  
  const quotations = []
  
  for (let i = 0; i < 10; i++) {
    const procedure = getRandomElement(procedures)
    const surgeon = getRandomElement(surgeons.filter(s => 
      s.specialty.includes(procedure.category) || 
      procedure.category === "Cirugía General" && s.specialty.includes("Cirugía")
    )) || getRandomElement(surgeons)
    
    const hospital = surgeon.hospital
    const patientType = getRandomElement(patientTypes)
    const status = getRandomElement(statuses)
    
    // Add some variation to costs based on hospital and patient type
    const baseCostMin = procedure.cost.min
    const baseCostMax = procedure.cost.max
    const variation = Math.random() * 0.2 - 0.1 // ±10% variation
    
    const quotation = {
      hospital: hospital,
      procedure_name: procedure.title,
      procedure_code: procedure.code,
      procedure_category: procedure.category,
      doctor_name: surgeon.name,
      doctor_specialty: surgeon.specialty,
      patient_type: patientType,
      estimated_cost_min: Math.round(baseCostMin * (1 + variation)),
      estimated_cost_max: Math.round(baseCostMax * (1 + variation)),
      complexity: procedure.complexity,
      duration: procedure.duration,
      status: status,
      notes: status === 'rejected' ? 'Revisión de documentación requerida' : 
             status === 'completed' ? 'Procedimiento completado exitosamente' :
             status === 'approved' ? 'Cotización aprobada, proceder con programación' :
             'Cotización en revisión'
    }
    
    quotations.push(quotation)
  }
  
  try {
    const { data, error } = await supabase
      .from('quotations')
      .insert(quotations)
      .select()

    if (error) {
      console.error('❌ Error creating quotations:', error)
      return false
    }

    console.log(`✅ Successfully created ${data.length} quotations`)
    
    // Show some sample data
    console.log('\n📋 Sample quotations created:')
    data.slice(0, 3).forEach((q, i) => {
      console.log(`${i + 1}. ${q.procedure_name} - ${q.doctor_name} at ${q.hospital}`)
      console.log(`   Status: ${q.status} | Cost: $${q.estimated_cost_min.toLocaleString()} - $${q.estimated_cost_max.toLocaleString()}`)
    })
    
    return true
  } catch (error) {
    console.error('❌ Service error:', error)
    return false
  }
}

async function main() {
  console.log('🚀 Starting database clear and seed process...\n')
  
  // Clear existing quotations
  const clearSuccess = await clearDatabase()
  if (!clearSuccess) {
    console.error('❌ Failed to clear database, aborting')
    process.exit(1)
  }
  
  console.log()
  
  // Seed with new data
  const seedSuccess = await seedDatabase()
  if (!seedSuccess) {
    console.error('❌ Failed to seed database')
    process.exit(1)
  }
  
  console.log('\n🎉 Database clear and seed completed successfully!')
}

main().catch(console.error)