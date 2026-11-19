import React from 'react'
import { Link } from 'react-router-dom'
import { Truck, Navigation, ThermometerSnowflake, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { farmFreshStore } from '../../lib/store'

export const TransporterDashboard = () => {
  const { profile } = useAuth()
  const { t } = useLanguage()
  const vehicles = farmFreshStore.getVehicles()

  return (
    <div className="space-y-6">
      {/* Top Welcome */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-blue-100">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar}
            alt={profile.full_name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-300 shadow-sm"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xl text-gray-900">{profile.full_name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                {t('transporter')}
              </span>
            </div>
            <p className="text-xs text-gray-500">Fleet: {profile.fleet_size || 14} {t('navTransport')} • {t('harvestLocation')}: {profile.city_village}</p>
          </div>
        </div>

        <Link to="/transport" className="btn-farm text-xs py-2 px-4 shadow-sm">
          <Truck className="w-3.5 h-3.5" />
          <span>{t('availableVehicles')}</span>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('activeTrips')}</span>
          <div className="font-mono font-bold text-2xl text-blue-800">630 {t('completed')}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">99.8% {t('success')}</span>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('reeferTruck')}</span>
          <div className="font-mono font-bold text-2xl text-cyan-700">8 Units</div>
          <span className="text-[11px] text-cyan-600">{t('liveTempLbl')}</span>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('transitEarnings')}</span>
          <div className="font-mono font-bold text-2xl text-farm-800">₹14,80,000</div>
          <span className="text-[11px] text-farm-600">{t('escrowReleased')}</span>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('supplierRatings')}</span>
          <div className="font-mono font-bold text-2xl text-amber-600">4.95 / 5.0</div>
          <span className="text-[11px] text-gray-500">490+ {t('verified')}</span>
        </div>
      </div>

      {/* Fleet Overview */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="font-bold text-base text-gray-900">{t('availableVehicles')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-gray-900">{v.vehicle_number}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                  {v.is_available ? t('active') : t('inTransit')}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {v.vehicle_type} • {t('driverNameLbl')}: {v.driver_name} ({v.driver_phone})
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-50">
                <span>{t('harvestLocation')}: {v.current_location}</span>
                <span className="font-mono font-bold text-blue-700">₹{v.base_rate_per_km}/km</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
