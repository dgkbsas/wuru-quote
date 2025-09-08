import { supabase } from '../lib/supabase'
import { QuotationService } from '../services/quotationService'

export const clearDatabase = async () => {
  console.log('🗑️ Clearing all quotations from database...')
  
  try {
    // First check current count
    const currentStats = await QuotationService.getQuotationStats()
    console.log(`📊 Current quotations in database: ${currentStats.total}`)
    
    if (currentStats.total === 0) {
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
    const newStats = await QuotationService.getQuotationStats()
    console.log(`✅ All quotations cleared successfully. Remaining: ${newStats.total}`)
    return true
    
  } catch (error) {
    console.error('❌ Failed to clear database:', error)
    return false
  }
}

// Export a function that can be called from the browser console
if (typeof window !== 'undefined') {
  (window as any).clearDatabase = clearDatabase
}