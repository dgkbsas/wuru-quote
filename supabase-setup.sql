-- Create quotations table
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Hospital and location info
    hospital TEXT NOT NULL,
    
    -- Procedure information
    procedure_name TEXT NOT NULL,
    procedure_code TEXT NOT NULL,
    procedure_category TEXT NOT NULL,
    
    -- Doctor information
    doctor_name TEXT NOT NULL,
    doctor_specialty TEXT NOT NULL,
    
    -- Patient information
    patient_type TEXT NOT NULL CHECK (patient_type IN ('particular', 'eps', 'prepagada', 'soat')),
    
    -- Cost estimation
    estimated_cost_min INTEGER NOT NULL,
    estimated_cost_max INTEGER NOT NULL,
    
    -- Procedure details
    complexity TEXT NOT NULL CHECK (complexity IN ('Baja', 'Media', 'Alta', 'Muy Alta')),
    duration TEXT NOT NULL,
    
    -- Status and notes
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    notes TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Enable all operations for authenticated users" ON public.quotations
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create policy to allow read access for anonymous users (for demo purposes)
CREATE POLICY "Enable read access for all users" ON public.quotations
    FOR SELECT
    USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON public.quotations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotations_hospital ON public.quotations(hospital);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_procedure_category ON public.quotations(procedure_category);

-- Insert 10 example quotations
INSERT INTO public.quotations (
    hospital,
    procedure_name,
    procedure_code,
    procedure_category,
    doctor_name,
    doctor_specialty,
    patient_type,
    estimated_cost_min,
    estimated_cost_max,
    complexity,
    duration,
    status,
    notes
) VALUES 
(
    'Hospital Ángeles México (CDMX)',
    'Colecistectomía Laparoscópica',
    '51.23',
    'Cirugía General',
    'Dr. José Luis Mosso Vázquez',
    'Cirugía General',
    'particular',
    45000,
    65000,
    'Media',
    '2-3 horas',
    'completed',
    'Procedimiento exitoso sin complicaciones'
),
(
    'Hospital Ángeles Pedregal (CDMX)',
    'Artroscopia de Rodilla',
    '80.26',
    'Ortopedia',
    'James Stewart',
    'Ortopedia y Traumatología',
    'prepagada',
    55000,
    75000,
    'Media',
    '1-2 horas',
    'approved',
    'Autorizado por medicina prepagada'
),
(
    'Hospital Ángeles Lindavista (CDMX)',
    'Cesárea',
    '74.1',
    'Ginecología',
    'Chris Evans',
    'Ginecología y Obstetricia',
    'eps',
    35000,
    50000,
    'Baja',
    '1 hora',
    'completed',
    'Parto por cesárea sin complicaciones'
),
(
    'Hospital Ángeles Lomas (CDMX)',
    'Cateterismo Cardíaco',
    '37.22',
    'Cardiología',
    'James Dean',
    'Cardiología',
    'particular',
    85000,
    120000,
    'Alta',
    '2-4 horas',
    'pending',
    'Evaluación previa requerida'
),
(
    'Hospital Ángeles Acoxpa (CDMX)',
    'Rinoplastia',
    '21.87',
    'Cirugía Plástica',
    'Orson Welles',
    'Cirugía Plástica',
    'particular',
    65000,
    95000,
    'Media',
    '2-3 horas',
    'approved',
    'Cirugía estética autorizada'
),
(
    'Hospital Ángeles Puebla (Puebla)',
    'Apendicectomía Laparoscópica',
    '47.09',
    'Cirugía General',
    'Cary Grant',
    'Cirugía General',
    'eps',
    25000,
    40000,
    'Baja',
    '1-2 horas',
    'completed',
    'Procedimiento de emergencia exitoso'
),
(
    'Hospital Ángeles Querétaro (Querétaro)',
    'Prótesis de Cadera',
    '81.51',
    'Ortopedia',
    'Peter O\'Toole',
    'Ortopedia y Traumatología',
    'prepagada',
    120000,
    180000,
    'Alta',
    '3-4 horas',
    'pending',
    'Requiere autorización especializada'
),
(
    'Hospital Ángeles León (León)',
    'Catarata con Facoemulsificación',
    '13.19',
    'Oftalmología',
    'Audrey Hepburn',
    'Anestesiología',
    'particular',
    18000,
    28000,
    'Baja',
    '30-45 minutos',
    'approved',
    'Cirugía ambulatoria programada'
),
(
    'Hospital Ángeles Clínica Londres (CDMX)',
    'Resección de Tumor Cerebral',
    '01.59',
    'Neurocirugía',
    'Philip Seymour Hoffman',
    'Neurocirugía',
    'eps',
    200000,
    350000,
    'Muy Alta',
    '6-8 horas',
    'approved',
    'Cirugía compleja autorizada por comité médico'
),
(
    'Hospital Ángeles Ciudad Juárez (Chihuahua)',
    'Prostatectomía Robótica',
    '60.5',
    'Urología',
    'Humphrey Bogart',
    'Urología',
    'prepagada',
    150000,
    220000,
    'Alta',
    '4-6 horas',
    'rejected',
    'No autorizado - requiere segunda opinión médica'
);

-- Create a view for quotation statistics
CREATE OR REPLACE VIEW quotation_stats AS
SELECT 
    COUNT(*) as total_quotations,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
    AVG((estimated_cost_min + estimated_cost_max) / 2) as avg_cost,
    SUM((estimated_cost_min + estimated_cost_max) / 2) as total_value,
    COUNT(DISTINCT hospital) as unique_hospitals,
    COUNT(DISTINCT procedure_category) as unique_categories
FROM public.quotations;