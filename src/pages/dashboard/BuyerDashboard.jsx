import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Gavel, ShieldCheck, Truck, CheckCircle2, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { farmFreshStore } from '../../lib/store'

export const BuyerDashboard = () => {
  const { profile } = useAuth()
  const { t } = useLanguage()
  const orders = farmFreshStore.getOrders()

  return (
    <div className="space-y-6">
      {/* Top Welcome */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-amber-100">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar}
            alt={profile.full_name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-300 shadow-sm"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xl text-gray-900">{profile.company_name || profile.full_name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {t('verified')} {t('buyer')}
              </span>
            </div>
            <p className="text-xs text-gray-500">GST: {profile.gst_number || '27AABCG1234F1Z8'} • {profile.city_village}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/marketplace" className="btn-farm text-xs py-2 px-4 shadow-sm">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('exploreMarket')}</span>
          </Link>
          <Link to="/auctions" className="btn-harvest text-xs py-2 px-3">
            <Gavel className="w-3.5 h-3.5" />
            <span>{t('navAuctions')}</span>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('totalPurchased')}</span>
          <div className="font-mono font-bold text-2xl text-amber-800">₹28,40,000</div>
          <span className="text-[11px] text-emerald-600 font-semibold">142 {t('completed')}</span>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('escrowLocked')}</span>
          <div className="font-mono font-bold text-2xl text-blue-700">₹1,18,200</div>
          <span className="text-[11px] text-blue-600">{t('pending')}</span>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('supplierRatings')}</span>
          <div className="font-mono font-bold text-2xl text-emerald-700">4.92 / 5.0</div>
          <span className="text-[11px] text-emerald-600">99.2% {t('gradeA')}</span>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('inTransitDeliveries')}</span>
          <div className="font-mono font-bold text-2xl text-purple-700">12 FPOs</div>
          <span className="text-[11px] text-purple-600">{t('directTradeNotice')}</span>
        </div>
      </div>

      {/* Active Procurements & Shipments */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-gray-900">{t('trackActiveShipments')}</h3>
          <Link to="/orders" className="text-xs text-farm-700 font-semibold hover:underline">
            {t('navOrders')} ({orders.length}) →
          </Link>
        </div>

        <div className="space-y-3">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-farm-800">{ord.order_number}</span>
                  <span className="text-xs font-semibold text-gray-800">• {ord.crop_name}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {ord.quantity_kg} {t('kg')} • {t('farmerName')}: {ord.farmer_name} • {t('driverNameLbl')}: {ord.transporter_name || t('inTransit')}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-gray-900">₹{ord.total_amount.toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-600 font-medium">{t('escrowLocked')}</div>
                </div>
                <Link to="/orders" className="btn-outline-farm text-xs py-1.5 px-3">
                  {t('trackOrder')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
