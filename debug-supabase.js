import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = 'https://tmrpzerzzikxrwtetzcq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtcnB6ZXJ6emlreHJ3dGV0emNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNTkzODEsImV4cCI6MjA3MjgzNTM4MX0.VjFcfPhod_q7Ap4vNN27BCd70vpilRBx2AzcTg7WlmQ'

console.log('🔍 Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseAnonKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('\n1️⃣ Testing basic connection...')
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('quotations')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Connection test failed:', testError)
      return false
    }
    
    console.log('✅ Basic connection successful')
    
    // Test data fetching
    console.log('\n2️⃣ Testing data fetch...')
    const { data, error, count } = await supabase
      .from('quotations')
      .select('*', { count: 'exact' })
      .limit(10)
    
    if (error) {
      console.error('❌ Data fetch failed:', error)
      return false
    }
    
    console.log('✅ Data fetch successful')
    console.log('📊 Total count:', count)
    console.log('📋 Records returned:', data?.length || 0)
    
    if (data && data.length > 0) {
      console.log('\n📄 Sample record:')
      console.log(JSON.stringify(data[0], null, 2))
    } else {
      console.log('⚠️ No data found in quotations table')
    }
    
    // Test stats query
    console.log('\n3️⃣ Testing stats query...')
    const { data: statsData, error: statsError } = await supabase
      .from('quotations')
      .select('status, estimated_cost_min, estimated_cost_max')
    
    if (statsError) {
      console.error('❌ Stats query failed:', statsError)
    } else {
      const stats = {
        total: statsData.length,
        pending: statsData.filter(q => q.status === 'pending').length,
        approved: statsData.filter(q => q.status === 'approved').length,
        rejected: statsData.filter(q => q.status === 'rejected').length,
        completed: statsData.filter(q => q.status === 'completed').length,
        totalValue: statsData.reduce((sum, q) => sum + ((q.estimated_cost_min + q.estimated_cost_max) / 2), 0),
        avgValue: 0
      }
      
      stats.avgValue = stats.total > 0 ? stats.totalValue / stats.total : 0
      
      console.log('✅ Stats query successful')
      console.log('📈 Stats:', stats)
    }
    
    return true
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
    return false
  }
}

testConnection().then(success => {
  console.log('\n🏁 Test completed:', success ? 'SUCCESS' : 'FAILED')
  process.exit(success ? 0 : 1)
})