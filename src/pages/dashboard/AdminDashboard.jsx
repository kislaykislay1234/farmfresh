import React from 'react'
import { ShieldCheck, Users, DollarSign, Activity, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { farmFreshStore } from '../../lib/store'

export const AdminDashboard = () => {
  const { profile } = useAuth()
  const { t } = useLanguage()
  const orders = farmFreshStore.getOrders()

  return (
    <div className="space-y-6">
      {/* Top Welcome */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-purple-100">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar}
            alt={profile.full_name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-300 shadow-sm"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xl text-gray-900">{profile.full_name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                {t('admin')}
              </span>
            </div>
            <p className="text-xs text-gray-500">{t('adminDashTitle')} • {t('systemHealth')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-emerald-700">{t('systemHealth')}: {t('active')}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('platformVolume')}</span>
          <div className="font-mono font-bold text-2xl text-purple-900">₹4.82 Cr</div>
          <span className="text-[11px] text-emerald-600 font-semibold">+32% Growth</span>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('totalUsers')}</span>
          <div className="font-mono font-bold text-2xl text-farm-800">48,200</div>
          <span className="text-[11px] text-farm-600">89% {t('verified')}</span>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('escrowStatus')}</span>
          <div className="font-mono font-bold text-2xl text-blue-800">₹64.5 Lakh</div>
          <span className="text-[11px] text-blue-600">{t('escrowLocked')}</span>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('activeDisputes')}</span>
          <div className="font-mono font-bold text-2xl text-emerald-700">0.08%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">0 {t('pending')}</span>
        </div>
      </div>

      {/* Verification Queue & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-base text-gray-900">{t('verifiedListings')}</h3>
          <div className="space-y-3 text-xs">
            {[
              { name: 'Kisan Kalyan FPO Ltd.', state: 'Gujarat', docs: '7/12 Land Record + FPO', status: t('pending') },
              { name: 'Sardar Vallabhbhai Agro Coop', state: 'Gujarat', docs: 'GST + Bank Escrow', status: t('verified') },
              { name: 'Deshmukh Organic Farms', state: 'Maharashtra', docs: 'NPOP Organic Certificate', status: t('completed') }
            ].map((v, i) => (
              <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-bold text-gray-900">{v.name} ({v.state})</div>
                  <div className="text-[11px] text-gray-500">{v.docs}</div>
                </div>
                <button className="btn-farm text-[11px] py-1 px-3">
                  {t('confirm')}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-base text-gray-900">{t('recentActivity')}</h3>
          <div className="space-y-3 text-xs">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-mono font-bold text-gray-900">{ord.order_number}</div>
                  <div className="text-[11px] text-gray-500">{ord.farmer_name} ← {ord.buyer_name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-farm-800">₹{ord.total_amount.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-700 font-semibold">{t('escrowReleased')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
