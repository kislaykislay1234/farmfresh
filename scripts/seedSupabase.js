import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ezyiwlninhpaytznakra.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6eWl3bG5pbmhwYXl0em5ha3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4ODU5NDgsImV4cCI6MjEwNDQ2MTk0OH0.KT89XoaTEhVXvsaxTB5Df2NKKlznZY5VQ5qbVBFA2QE'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seedDatabase() {
  console.log('🚀 Starting FarmFresh Supabase Database Seeding...')
  console.log('Target Project URL:', supabaseUrl)

  try {
    // 1. Seed Government Schemes
    console.log('\n1. Seeding Government Schemes...')
    const schemesData = [
      {
        title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
        acronym: 'PM-KISAN',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        subsidy_benefit: '₹6,000 per year direct income support in 3 installments',
        category: 'Direct Income Support',
        eligibility_criteria: 'All landholding farmer family households',
        official_portal_url: 'https://pmkisan.gov.in',
        helpline_number: '155261',
        active: true
      },
      {
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        acronym: 'PMFBY',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        subsidy_benefit: 'Crop yield loss insurance at 1.5%-5% farmer premium',
        category: 'Crop Risk & Insurance',
        eligibility_criteria: 'All farmers growing notified crops',
        official_portal_url: 'https://pmfby.gov.in',
        helpline_number: '1800 180 1551',
        active: true
      },
      {
        title: 'Agriculture Infrastructure Fund (AIF)',
        acronym: 'AIF',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        subsidy_benefit: '3% per annum interest subvention up to ₹2 Crore loan',
        category: 'Post-Harvest & Cold Chain Infrastructure',
        eligibility_criteria: 'Farmers, FPOs, PACs, Agri-entrepreneurs',
        official_portal_url: 'https://agriinfra.dac.gov.in',
        helpline_number: '011-23381012',
        active: true
      }
    ]

    const { data: schemesRes, error: schemesErr } = await supabase
      .from('government_schemes')
      .upsert(schemesData, { onConflict: 'title' })

    if (schemesErr) {
      console.warn('⚠️ Government schemes table note (make sure schema SQL has been run):', schemesErr.message)
    } else {
      console.log('✅ Government schemes seeded successfully!')
    }

    // 2. Check connection health
    console.log('\n2. Testing Supabase Backend Connection...')
    const { data: health, error: healthErr } = await supabase.from('government_schemes').select('count', { count: 'exact' })
    if (healthErr) {
      console.log('ℹ️ Table check message:', healthErr.message)
      console.log('\n👉 REMINDER: Ensure you have pasted "supabase/schema.sql" into your Supabase SQL Editor if tables are not created yet.')
    } else {
      console.log(`✅ Supabase Connection Live! Total registered items: ${health[0]?.count || 0}`)
    }

    console.log('\n✨ FarmFresh Supabase Backend Integration Setup Complete!')

  } catch (err) {
    console.error('❌ Seeding process error:', err)
  }
}

seedDatabase()
