// Unified Payment Gateway Abstraction for FarmFresh
import { farmFreshStore } from './store'
import { supabase, isSupabaseConfigured } from './supabase'

export const PAYMENT_MODES = [
  { id: 'upi', name: 'UPI (GPay / PhonePe / Paytm / BHIM)', icon: '📱' },
  { id: 'card', name: 'Debit / Credit Card (Visa, MasterCard, RuPay)', icon: '💳' },
  { id: 'netbanking', name: 'Net Banking (SBI, HDFC, ICICI, Axis)', icon: '🏦' },
  { id: 'escrow_wallet', name: 'FarmFresh Kisan Escrow Wallet', icon: '🔒' },
]

export const paymentService = {
  processPayment: async ({ amount, purpose, relatedType, relatedId, userId, paymentMode = 'upi' }) => {
    const txnId = `TXN-FF-${Date.now().toString().slice(-8)}`
    
    // Create payment record
    const paymentRecord = {
      id: `pay-${Date.now()}`,
      transaction_id: txnId,
      user_id: userId || 'demo-user',
      related_type: relatedType,
      related_id: relatedId,
      amount: Number(amount),
      payment_gateway: 'Razorpay_Agri_Demo',
      payment_mode: paymentMode,
      status: 'success',
      purpose: purpose || 'Agri Trade Escrow Settlement',
      created_at: new Date().toISOString(),
    }

    // Persist in local store
    farmFreshStore.recordPayment(paymentRecord)

    // Persist in Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('payments').insert([{
          transaction_id: txnId,
          related_type: relatedType,
          related_id: relatedId,
          amount: Number(amount),
          payment_mode: paymentMode,
          status: 'success',
        }])
      } catch (err) {
        console.warn('Supabase payment log warning:', err)
      }
    }

    return paymentRecord
  }
}
