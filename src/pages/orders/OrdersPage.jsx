import React, { useState } from 'react'
import { Package, ShieldCheck, Truck, CheckCircle2, Clock, MapPin, User, ChevronRight } from 'lucide-react'
import { farmFreshStore } from '../../lib/store'
import toast, { Toaster } from 'react-hot-toast'
import { VoiceReadButton } from '../../components/common/VoiceReadButton'
import { useVoice } from '../../contexts/VoiceContext'
import { useLanguage } from '../../contexts/LanguageContext'

export const OrdersPage = () => {
  const [orders, setOrders] = useState(() => farmFreshStore.getOrders())
  const { activeSectionId } = useVoice()
  const { t } = useLanguage()

  const handleUpdateStatus = (orderId, newStatus) => {
    const updated = farmFreshStore.updateOrderStatus(orderId, newStatus)
    setOrders(farmFreshStore.getOrders())
    toast.success(`${t('status')}: ${newStatus.replace('_', ' ')}`)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in_transit':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1"><Truck className="w-3 h-3" /> {t('inTransit')}</span>
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {t('completed')}</span>
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1"><Clock className="w-3 h-3" /> {t('escrowLocked')}</span>
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border">{status}</span>
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-farm-100 text-farm-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('directTradeNotice')}</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-gray-900">
            {t('ordersTitle')}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t('ordersSubtitle')}
          </p>
        </div>

        <VoiceReadButton
          sectionId="orders-overview"
          category="order"
          data={orders[0]}
          size="md"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`glass-card p-6 rounded-2xl space-y-4 border-farm-100 shadow-xs hover:shadow-md transition-all duration-300 ${
              activeSectionId === `order-${order.id}` ? 'ring-4 ring-emerald-500/50 bg-emerald-50/60 shadow-xl border-emerald-300' : ''
            }`}
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-farm-50 flex items-center justify-center text-farm-700">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono font-bold text-sm text-gray-900">{order.order_number}</div>
                  <div className="text-[11px] text-gray-400">Tracking: {order.tracking_id}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(order.order_status)}
                <VoiceReadButton
                  sectionId={`order-${order.id}`}
                  category="order"
                  data={order}
                  size="sm"
                />
              </div>
            </div>

            {/* Middle Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-gray-400">{t('cropNameInput')}:</span>
                <div className="font-bold text-gray-900 text-sm">{order.crop_name}</div>
                <div className="text-gray-600 font-mono">{order.quantity_kg} {t('kg')} @ ₹{order.price_per_kg}{t('perKg')}</div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">{t('buyerNameLbl')}:</span>
                <div className="font-semibold text-gray-800">{order.buyer_name}</div>
                <div className="text-[11px] text-gray-500 line-clamp-1">{order.delivery_address}</div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400">{t('sellerNameLbl')}:</span>
                <div className="font-semibold text-gray-800">{order.farmer_name}</div>
                <div className="text-[11px] text-gray-500">{order.transporter_name || t('navTransport')}</div>
              </div>

              <div className="space-y-1 text-right sm:text-left lg:text-right">
                <span className="text-gray-400">{t('totalAmountLbl')}:</span>
                <div className="font-mono font-extrabold text-lg text-farm-800">
                  ₹{order.total_amount.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  {t('escrowLocked')}: ₹{order.farmer_payout.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Stepper Status Progression */}
            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">{t('status')}:</span>
                <button
                  onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px]"
                >
                  {t('pending')}
                </button>
                <button
                  onClick={() => handleUpdateStatus(order.id, 'in_transit')}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px]"
                >
                  {t('inTransit')}
                </button>
                <button
                  onClick={() => handleUpdateStatus(order.id, 'delivered')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold"
                >
                  {t('completed')} & {t('escrowReleased')}
                </button>
              </div>

              <div className="text-[11px] text-gray-400">
                {t('date')}: {new Date(order.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
