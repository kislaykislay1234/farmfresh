import React, { useState } from 'react'
import { HelpCircle, MessageSquare, PhoneCall, Send, ShieldCheck, CheckCircle2, Clock } from 'lucide-react'
import { farmFreshStore } from '../../lib/store'
import toast, { Toaster } from 'react-hot-toast'
import { useLanguage } from '../../contexts/LanguageContext'

export const SupportPage = () => {
  const { t } = useLanguage()
  const [tickets, setTickets] = useState(() => farmFreshStore.getSupportTickets())
  const [category, setCategory] = useState('payment')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')

  const handleCreateTicket = (e) => {
    e.preventDefault()
    if (!subject || !description) {
      toast.error('Please enter subject and description')
      return
    }

    const created = farmFreshStore.createSupportTicket({
      category,
      subject,
      description,
    })

    setTickets(farmFreshStore.getSupportTickets())
    setSubject('')
    setDescription('')
    toast.success(`Support Ticket #${created.ticket_number} created successfully!`)
  }

  const faqs = [
    { q: t('faq1Q', 'How does the 100% Escrow Protection work for farmers?'), a: t('faq1A', 'When a buyer places an order, their payment is held in an RBI-regulated escrow account. Once the produce is delivered and weight/quality verified, funds transfer directly to your UPI/bank account.') },
    { q: t('faq2Q', 'How is the AI Freshness Index score calculated?'), a: t('faq3A', 'Our computer vision model analyzes surface texture, color breakdown, spots, and firmness against thousands of agricultural assay datasets to predict freshness score and estimated shelf life.') },
    { q: t('faq4Q', 'What happens if a cold storage temperature fluctuates?'), a: t('faq4A', 'All partner cold storages feature dual 24/7 telemetry sensors. If temperatures drop outside tolerance, automated alerts notify the operator and our insurance pool covers spoilage.') }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-farm-100 text-farm-800 text-xs font-semibold mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t('kisanSupportBadge', '24x7 Dedicated Kisan & Agri Trade Support')}</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-gray-900">
          {t('customerCareTitle', 'Customer Care & Helpdesk')}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {t('customerCareSub', 'Raise complaints, track ticket resolutions, or speak directly to our agricultural grievance officers.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Raise Ticket Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-farm-600" />
              <span>{t('submitTicketTitle', 'Submit a Support Ticket / Complaint')}</span>
            </h3>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">{t('issueCategory', 'Issue Category *')}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-farm"
                >
                  <option value="payment">{t('paymentEscrowCategory', 'Payment & Escrow Settlement')}</option>
                  <option value="order">{t('orderDisputeCategory', 'Order & Procurement Dispute')}</option>
                  <option value="delivery">{t('deliveryDelayCategory', 'Transport & Transit Delay')}</option>
                  <option value="cold_storage">{t('coldStorageCategory', 'Cold Storage Temperature Issue')}</option>
                  <option value="product_quality">{t('qualityDiscrepancyCategory', 'Product Freshness Discrepancy')}</option>
                  <option value="other">{t('generalQueryCategory', 'General Query')}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">{t('subjectLbl', 'Subject *')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('subjectPlaceholder', 'e.g. Escrow payout status for Order #8901')}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input-farm"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">{t('detailedDesc', 'Detailed Description *')}</label>
                <textarea
                  required
                  rows={4}
                  placeholder={t('descPlaceholder', 'Explain the issue clearly with order numbers or mandi location...')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-farm"
                />
              </div>

              <button type="submit" className="w-full btn-farm text-xs py-3 justify-center shadow-md font-bold">
                <Send className="w-4 h-4" />
                <span>{t('submitTicketBtn', 'Submit Complaint Ticket')}</span>
              </button>
            </form>
          </div>

          {/* Kisan Call Center Box */}
          <div className="bg-farm-900 text-white p-6 rounded-3xl space-y-2 border border-farm-800">
            <div className="flex items-center gap-2 text-harvest-400 text-xs font-bold">
              <PhoneCall className="w-4 h-4" />
              <span>{t('kisanCallTollFree', '24/7 Kisan Call Center Toll Free')}</span>
            </div>
            <div className="font-mono text-2xl font-extrabold text-white">1800 180 1551</div>
            <p className="text-xs text-farm-300">{t('regionalLanguagesNotice', 'Available in 22 regional Indian languages (Hindi, Gujarati, Punjabi, Marathi, etc.)')}</p>
          </div>
        </div>

        {/* Right: Existing Tickets & FAQs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Tickets */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-base text-gray-900">{t('yourTickets', 'Your Support Tickets')}</h3>
            <div className="space-y-3 text-xs">
              {tickets.map((tItem) => (
                <div key={tItem.id} className="bg-white p-4 rounded-2xl border border-gray-100 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-farm-800">{tItem.ticket_number}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      tItem.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {tItem.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="font-bold text-gray-900">{tItem.subject}</div>
                  <p className="text-gray-600">{tItem.description}</p>
                  {tItem.admin_reply && (
                    <div className="bg-farm-50 p-2.5 rounded-xl text-[11px] text-farm-900 mt-2 font-medium">
                      <strong>{t('adminReply', 'Support Admin Reply:')} </strong>{tItem.admin_reply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-base text-gray-900">{t('faqTitle', 'Frequently Asked Questions')}</h3>
            <div className="space-y-3 text-xs">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-gray-50/80 p-3.5 rounded-2xl space-y-1">
                  <div className="font-bold text-gray-900">{faq.q}</div>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

