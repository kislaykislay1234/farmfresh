import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingBag, 
  Gavel, 
  TrendingUp, 
  Warehouse, 
  Truck, 
  DollarSign, 
  Star, 
  Bell, 
  HelpCircle, 
  User, 
  Globe, 
  Mic, 
  Sparkles,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant'

export const DashboardSidebar = ({ activeTab, setActiveTab }) => {
  const { role, profile } = useAuth()
  const { lang, setLang, t, SUPPORTED_LANGUAGES } = useLanguage()
  const { startListening } = useVoiceAssistant()
  const location = useLocation()

  const sidebarNavItems = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard, path: '/dashboard' },
    { id: 'products', label: t('myCrops'), icon: Package, path: '/marketplace' },
    { id: 'add_product', label: t('listCrop'), icon: PlusCircle, path: '/marketplace' },
    { id: 'orders', label: t('navOrders'), icon: ShoppingBag, path: '/orders' },
    { id: 'auctions', label: t('navAuctions'), icon: Gavel, path: '/auctions' },
    { id: 'demand', label: t('navMandi'), icon: TrendingUp, path: '/mandi-rates' },
    { id: 'cold_storage', label: t('navColdStorage'), icon: Warehouse, path: '/cold-storage' },
    { id: 'transportation', label: t('navTransport'), icon: Truck, path: '/transport' },
    { id: 'freshness', label: t('navFreshness'), icon: Sparkles, path: '/freshness-scanner' },
    { id: 'notifications', label: t('notifications'), icon: Bell, path: '/support' },
    { id: 'support', label: t('navSupport'), icon: HelpCircle, path: '/support' },
    { id: 'profile', label: t('navProfile'), icon: User, path: '/profile' },
  ]

  return (
    <aside className="w-full lg:w-64 glass-card p-4 rounded-3xl space-y-4 shrink-0 border-farm-100 shadow-xs">
      {/* User Mini Profile */}
      <div className="flex items-center gap-3 p-2 bg-farm-50/80 rounded-2xl border border-farm-200/60">
        <img
          src={profile.avatar}
          alt={profile.full_name}
          className="w-10 h-10 rounded-xl object-cover border border-farm-300"
        />
        <div className="truncate space-y-0.5">
          <div className="font-bold text-xs text-gray-900 truncate">{profile.full_name}</div>
          <div className="text-[10px] text-farm-800 font-semibold capitalize">{t(role) || role.replace('_', ' ')}</div>
        </div>
      </div>

      {/* Sidebar Nav Links */}
      <nav className="space-y-1 text-xs">
        <div className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          {t('overview')}
        </div>
        {sidebarNavItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all font-medium ${
                isActive
                  ? 'bg-farm-700 text-white font-bold shadow-xs'
                  : 'text-gray-700 hover:bg-farm-50 hover:text-farm-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 opacity-80" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-3 h-3 opacity-50" />
            </Link>
          )
        })}
      </nav>

      {/* Voice Assistant Shortcut */}
      <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
        <button
          onClick={startListening}
          className="w-full btn-harvest py-2 text-xs justify-center font-bold shadow-xs"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>{t('voiceAssistant')}</span>
        </button>

        <div className="flex items-center justify-between px-1 text-[11px] text-gray-500">
          <span>{t('language')}:</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-gray-100 border border-gray-200 rounded-md px-1.5 py-0.5 text-[11px] font-semibold max-w-[140px]"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.native} ({l.code.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  )
}
