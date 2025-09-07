import { supabase } from '../lib/supabase'

export const setupDatabase = async () => {
  console.log('🔧 Setting up Supabase database...')
  
  try {
    // Test connection first
    const { error: testError } = await supabase.from('quotations').select('count', { count: 'exact', head: true })
    
    if (testError) {
      console.error('❌ Connection test failed:', testError.message)
      
      // If table doesn't exist, we need to create it
      if (testError.message.includes('relation') && testError.message.includes('does not exist')) {
        console.log('📋 Table does not exist. Please run the SQL setup script in Supabase dashboard.')
        console.log('📝 SQL script location: supabase-setup.sql')
        return false
      }
    }
    
    // Check if quotations table exists and has data
    const { data: existingData, error: selectError } = await supabase
      .from('quotations')
      .select('id')
      .limit(1)
    
    if (selectError) {
      console.error('❌ Error checking existing data:', selectError.message)
      return false
    }
    
    if (existingData && existingData.length > 0) {
      console.log('✅ Database already has data. Skipping setup.')
      return true
    }
    
    console.log('📊 Database is empty. Inserting example data...')
    
    // Insert example quotations
    const exampleQuotations = [
      {
        hospital: 'Hospital Ángeles México (CDMX)',
        procedure_name: 'Colecistectomía Laparoscópica',
        procedure_code: '51.23',
        procedure_category: 'Cirugía General',
        doctor_name: 'Dr. José Luis Mosso Vázquez',
        doctor_specialty: 'Cirugía General',
        patient_type: 'particular' as const,
        estimated_cost_min: 45000,
        estimated_cost_max: 65000,
        complexity: 'Media' as const,
        duration: '2-3 horas',
        status: 'completed' as const,
        notes: 'Procedimiento exitoso sin complicaciones'
      },
      {
        hospital: 'Hospital Ángeles Pedregal (CDMX)',
        procedure_name: 'Artroscopia de Rodilla',
        procedure_code: '80.26',
        procedure_category: 'Ortopedia',
        doctor_name: 'James Stewart',
        doctor_specialty: 'Ortopedia y Traumatología',
        patient_type: 'prepagada' as const,
        estimated_cost_min: 55000,
        estimated_cost_max: 75000,
        complexity: 'Media' as const,
        duration: '1-2 horas',
        status: 'approved' as const,
        notes: 'Autorizado por medicina prepagada'
      },
      {
        hospital: 'Hospital Ángeles Lindavista (CDMX)',
        procedure_name: 'Cesárea',
        procedure_code: '74.1',
        procedure_category: 'Ginecología',
        doctor_name: 'Chris Evans',
        doctor_specialty: 'Ginecología y Obstetricia',
        patient_type: 'eps' as const,
        estimated_cost_min: 35000,
        estimated_cost_max: 50000,
        complexity: 'Baja' as const,
        duration: '1 hora',
        status: 'completed' as const,
        notes: 'Parto por cesárea sin complicaciones'
      },
      {
        hospital: 'Hospital Ángeles Lomas (CDMX)',
        procedure_name: 'Cateterismo Cardíaco',
        procedure_code: '37.22',
        procedure_category: 'Cardiología',
        doctor_name: 'James Dean',
        doctor_specialty: 'Cardiología',
        patient_type: 'particular' as const,
        estimated_cost_min: 85000,
        estimated_cost_max: 120000,
        complexity: 'Alta' as const,
        duration: '2-4 horas',
        status: 'pending' as const,
        notes: 'Evaluación previa requerida'
      },
      {
        hospital: 'Hospital Ángeles Acoxpa (CDMX)',
        procedure_name: 'Rinoplastia',
        procedure_code: '21.87',
        procedure_category: 'Cirugía Plástica',
        doctor_name: 'Orson Welles',
        doctor_specialty: 'Cirugía Plástica',
        patient_type: 'particular' as const,
        estimated_cost_min: 65000,
        estimated_cost_max: 95000,
        complexity: 'Media' as const,
        duration: '2-3 horas',
        status: 'approved' as const,
        notes: 'Cirugía estética autorizada'
      },
      {
        hospital: 'Hospital Ángeles Puebla (Puebla)',
        procedure_name: 'Apendicectomía Laparoscópica',
        procedure_code: '47.09',
        procedure_category: 'Cirugía General',
        doctor_name: 'Cary Grant',
        doctor_specialty: 'Cirugía General',
        patient_type: 'eps' as const,
        estimated_cost_min: 25000,
        estimated_cost_max: 40000,
        complexity: 'Baja' as const,
        duration: '1-2 horas',
        status: 'completed' as const,
        notes: 'Procedimiento de emergencia exitoso'
      },
      {
        hospital: 'Hospital Ángeles Querétaro (Querétaro)',
        procedure_name: 'Prótesis de Cadera',
        procedure_code: '81.51',
        procedure_category: 'Ortopedia',
        doctor_name: 'Peter O\'Toole',
        doctor_specialty: 'Ortopedia y Traumatología',
        patient_type: 'prepagada' as const,
        estimated_cost_min: 120000,
        estimated_cost_max: 180000,
        complexity: 'Alta' as const,
        duration: '3-4 horas',
        status: 'pending' as const,
        notes: 'Requiere autorización especializada'
      },
      {
        hospital: 'Hospital Ángeles León (León)',
        procedure_name: 'Catarata con Facoemulsificación',
        procedure_code: '13.19',
        procedure_category: 'Oftalmología',
        doctor_name: 'Audrey Hepburn',
        doctor_specialty: 'Anestesiología',
        patient_type: 'particular' as const,
        estimated_cost_min: 18000,
        estimated_cost_max: 28000,
        complexity: 'Baja' as const,
        duration: '30-45 minutos',
        status: 'approved' as const,
        notes: 'Cirugía ambulatoria programada'
      },
      {
        hospital: 'Hospital Ángeles Clínica Londres (CDMX)',
        procedure_name: 'Resección de Tumor Cerebral',
        procedure_code: '01.59',
        procedure_category: 'Neurocirugía',
        doctor_name: 'Philip Seymour Hoffman',
        doctor_specialty: 'Neurocirugía',
        patient_type: 'eps' as const,
        estimated_cost_min: 200000,
        estimated_cost_max: 350000,
        complexity: 'Muy Alta' as const,
        duration: '6-8 horas',
        status: 'approved' as const,
        notes: 'Cirugía compleja autorizada por comité médico'
      },
      {
        hospital: 'Hospital Ángeles Ciudad Juárez (Chihuahua)',
        procedure_name: 'Prostatectomía Robótica',
        procedure_code: '60.5',
        procedure_category: 'Urología',
        doctor_name: 'Humphrey Bogart',
        doctor_specialty: 'Urología',
        patient_type: 'prepagada' as const,
        estimated_cost_min: 150000,
        estimated_cost_max: 220000,
        complexity: 'Alta' as const,
        duration: '4-6 horas',
        status: 'rejected' as const,
        notes: 'No autorizado - requiere segunda opinión médica'
      }
    ]
    
    const { data, error } = await supabase
      .from('quotations')
      .insert(exampleQuotations)
      .select()
    
    if (error) {
      console.error('❌ Error inserting data:', error.message)
      return false
    }
    
    console.log(`✅ Successfully inserted ${data?.length || 0} example quotations`)
    console.log('🎉 Database setup complete!')
    
    return true
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    return false
  }
}

// Export a function that can be called from the browser console
if (typeof window !== 'undefined') {
  (window as any).setupDatabase = setupDatabase
}