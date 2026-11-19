import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { FarmerDashboard } from './FarmerDashboard'
import { BuyerDashboard } from './BuyerDashboard'
import { TransporterDashboard } from './TransporterDashboard'
import { ColdStorageDashboard } from './ColdStorageDashboard'
import { AdminDashboard } from './AdminDashboard'
import { DashboardSidebar } from '../../components/layout/DashboardSidebar'
import { Sprout, ShoppingBag, Truck, Warehouse, ShieldCheck } from 'lucide-react'

export const DashboardWrapper = () => {
  const { role, switchDemoRole } = useAuth()
  const { t } = useLanguage()

  const tabs = [
    { key: 'farmer', label: t('farmer'), icon: Sprout },
    { key: 'buyer', label: t('buyer'), icon: ShoppingBag },
    { key: 'transporter', label: t('transporter'), icon: Truck },
    { key: 'cold_storage', label: t('cold_storage'), icon: Warehouse },
    { key: 'admin', label: t('admin'), icon: ShieldCheck },
  ]

  const renderDashboard = () => {
    switch (role) {
      case 'farmer':
        return <FarmerDashboard />
      case 'buyer':
        return <BuyerDashboard />
      case 'transporter':
        return <TransporterDashboard />
      case 'cold_storage':
        return <ColdStorageDashboard />
      case 'admin':
        return <AdminDashboard />
      default:
        return <FarmerDashboard />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Role Switcher Pills Bar */}
      <div className="glass-card p-2.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto shadow-xs border-farm-100">
        <span className="text-[11px] font-bold text-gray-400 px-3 uppercase tracking-wider shrink-0">
          {t('switchRole')}:
        </span>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = role === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => switchDemoRole(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-farm-700 text-white shadow-xs font-bold'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Main Grid with Sidebar + Active Role View */}
      <div className="flex flex-col lg:flex-row gap-6">
        <DashboardSidebar />
        <div className="flex-1 min-w-0">
          {renderDashboard()}
        </div>
      </div>
    </div>
  )
}
