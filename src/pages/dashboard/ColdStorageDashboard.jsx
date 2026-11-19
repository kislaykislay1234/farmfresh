import React from 'react'
import { Link } from 'react-router-dom'
import { Warehouse, ThermometerSnowflake, Sun, ShieldCheck, Activity } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { farmFreshStore } from '../../lib/store'

export const ColdStorageDashboard = () => {
  const { profile } = useAuth()
  const { t } = useLanguage()
  const storages = farmFreshStore.getColdStorages()

  return (
    <div className="space-y-6">
      {/* Top Welcome */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-cyan-100">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar}
            alt={profile.full_name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-300 shadow-sm"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xl text-gray-900">{profile.full_name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
                {t('cold_storage')}
              </span>
            </div>
            <p className="text-xs text-gray-500">{t('harvestLocation')}: {profile.city_village}, {profile.district} • {profile.total_capacity_mt} MT {t('totalCapacity')}</p>
          </div>
        </div>

        <Link to="/cold-storage" className="btn-farm text-xs py-2 px-4 shadow-sm">
          <Warehouse className="w-3.5 h-3.5" />
          <span>{t('navColdStorage')}</span>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('occupiedSpace')}</span>
          <div className="font-mono font-bold text-2xl text-cyan-800">71.6%</div>
          <span className="text-[11px] text-cyan-600">3,580 MT {t('storageBooked')}</span>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('capacityAvailableLbl')}</span>
          <div className="font-mono font-bold text-2xl text-emerald-700">1,420 MT</div>
          <span className="text-[11px] text-gray-500">{t('active')}</span>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('tempRangeLbl')}</span>
          <div className="font-mono font-bold text-2xl text-blue-700">+2.4°C</div>
          <span className="text-[11px] text-blue-600">{t('humidityRangeLbl')}: 90%</span>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-1">
          <span className="text-xs text-gray-500 font-medium">{t('powerBackup')}</span>
          <div className="font-mono font-bold text-2xl text-amber-600">120 kW/h</div>
          <span className="text-[11px] text-amber-600">100% {t('certifiedOrganic')}</span>
        </div>
      </div>

      {/* Chamber Status Breakdown */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="font-bold text-base text-gray-900">{t('facilityOverview')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-2">
            <div className="flex justify-between font-bold text-gray-900">
              <span>Chamber A ({t('vegetables')})</span>
              <span className="text-cyan-600">+3.0°C</span>
            </div>
            <div className="text-gray-500">{t('totalCapacity')}: 2,000 MT • 85% Full</div>
            <div className="text-[11px] text-emerald-600 font-semibold">{t('nitrogenChamber')}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-2">
            <div className="flex justify-between font-bold text-gray-900">
              <span>Chamber B ({t('fruits')})</span>
              <span className="text-cyan-600">+8.5°C</span>
            </div>
            <div className="text-gray-500">{t('totalCapacity')}: 1,500 MT • 60% Full</div>
            <div className="text-[11px] text-emerald-600 font-semibold">{t('fireSafety')}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-2">
            <div className="flex justify-between font-bold text-gray-900">
              <span>Chamber C (Deep Freeze)</span>
              <span className="text-blue-600">-18.0°C</span>
            </div>
            <div className="text-gray-500">{t('totalCapacity')}: 1,500 MT • 70% Full</div>
            <div className="text-[11px] text-emerald-600 font-semibold">{t('cctvSecurity')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
