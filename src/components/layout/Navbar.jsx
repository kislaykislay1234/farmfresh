import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Sprout, 
  Mic, 
  Globe, 
  UserCheck, 
  Menu, 
  X, 
  TrendingUp, 
  Warehouse, 
  Truck, 
  FileText, 
  ScanLine, 
  ShoppingBag,
  Gavel,
  ChevronDown,
  Navigation,
  HelpCircle,
  User,
  Camera
} from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant'
import { NotificationDrawer } from '../common/NotificationDrawer'
import { FreshnessScanner } from '../FreshnessScanner'
import { LanguageSelectorModal } from '../common/LanguageSelectorModal'

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [langModalOpen, setLangModalOpen] = useState(false)
  const { lang, setLang, t, SUPPORTED_LANGUAGES, currentLangObj } = useLanguage()
  const { role, switchDemoRole, profile } = useAuth()
  const { isListening, startListening, feedback } = useVoiceAssistant()
  const location = useLocation()

  const navLinks = [
    { name: t('navMarket'), path: '/marketplace', icon: ShoppingBag },
    { name: t('navAuctions'), path: '/auctions', icon: Gavel },
    { name: t('navMandi'), path: '/mandi-rates', icon: TrendingUp },
    { name: t('navColdStorage'), path: '/cold-storage', icon: Warehouse },
    { name: t('navTransport'), path: '/transport', icon: Truck },
    { name: t('navTracking'), path: '/tracking', icon: Navigation },
    { name: t('navSchemes'), path: '/schemes', icon: FileText },
    { name: t('navFreshness'), path: '/freshness-scanner', icon: ScanLine },
    { name: t('navSupport'), path: '/support', icon: HelpCircle },
  ]

  const rolesList = [
    { key: 'farmer', label: '🌾 ' + t('farmer') },
    { key: 'buyer', label: '🛒 ' + t('buyer') },
    { key: 'transporter', label: '🚚 ' + t('transporter') },
    { key: 'cold_storage', label: '❄️ ' + t('cold_storage') },
    { key: 'admin', label: '🛡️ ' + t('admin') },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-farm-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-farm-700 to-farm-500 flex items-center justify-center text-white shadow-md shadow-farm-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-farm-900 block leading-tight">
                Farm<span className="text-farm-600">Fresh</span>
              </span>
              <span className="text-[10px] tracking-wide text-farm-700/80 font-medium uppercase block">
                Agri Supply Chain
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path
              const isFreshness = link.path === '/freshness-scanner'

              if (isFreshness) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-xs ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-farm-600 text-white ring-2 ring-emerald-400'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 hover:scale-102'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </Link>
                )
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-farm-50 text-farm-800 font-bold'
                      : 'text-gray-600 hover:text-farm-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                  {link.name}
                </Link>
              )
            })}
          </nav>

          {/* Medium Screen Nav (lg to xl): Key links with prominent AI Scanner */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1">
            <Link
              to="/marketplace"
              className={`px-2 py-1 text-xs font-semibold rounded-lg ${location.pathname === '/marketplace' ? 'bg-farm-50 text-farm-800 font-bold' : 'text-gray-600'}`}
            >
              {t('navMarket')}
            </Link>
            <Link
              to="/mandi-rates"
              className={`px-2 py-1 text-xs font-semibold rounded-lg ${location.pathname === '/mandi-rates' ? 'bg-farm-50 text-farm-800 font-bold' : 'text-gray-600'}`}
            >
              {t('navMandi')}
            </Link>
            <Link
              to="/freshness-scanner"
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 ${
                location.pathname === '/freshness-scanner' ? 'bg-emerald-600 text-white border-emerald-700' : ''
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{t('navFreshness')}</span>
            </Link>
          </nav>

          {/* Right Action Tools: Quick AI Camera Scanner + Notifications + Voice + Lang + Role Switcher + Profile */}
          <div className="hidden sm:flex items-center gap-1.5">
            {/* Quick AI Camera Scanner Trigger */}
            <Link
              to="/freshness-scanner"
              title="AI Freshness Scanner Page"
              className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 hover:scale-105 transition-all shadow-2xs flex items-center gap-1 text-xs font-bold"
            >
              <Camera className="w-4 h-4 text-emerald-700" />
              <span className="hidden md:inline">AI Scanner</span>
            </Link>

            {/* Notification Drawer */}
            <NotificationDrawer />

            {/* Voice Assistant Mic Button */}
            <button
              onClick={startListening}
              title="Voice Search (Hindi, Gujarati, English)"
              className={`relative p-2 rounded-xl border transition-all duration-200 ${
                isListening
                  ? 'bg-red-500 text-white border-red-600 animate-pulse ring-4 ring-red-200'
                  : 'bg-farm-50 text-farm-700 border-farm-200 hover:bg-farm-100'
              }`}
            >
              <Mic className="w-4 h-4" />
              {isListening && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
              )}
            </button>

            {/* Quick 3-Language Segmented Toggle: EN | हिन्दी | ગુજરાતી */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  lang === 'en'
                    ? 'bg-white text-farm-900 shadow-xs ring-1 ring-black/5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  lang === 'hi'
                    ? 'bg-white text-farm-900 shadow-xs ring-1 ring-black/5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="हिन्दी में बदलें"
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLang('gu')}
                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  lang === 'gu'
                    ? 'bg-white text-farm-900 shadow-xs ring-1 ring-black/5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="ગુજરાતીમાં બદલો"
              >
                ગુજરાતી
              </button>
            </div>

            {/* Searchable 22-Language Modal Trigger */}
            <button
              onClick={() => setLangModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-800 transition-colors shadow-2xs"
              title="Change Language (22 Indian Languages)"
            >
              <Globe className="w-3.5 h-3.5 text-farm-700" />
              <span>{currentLangObj?.flag} {currentLangObj?.code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
            </button>

            {/* Role Switcher */}
            <div className="relative">

              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-harvest-50 text-harvest-900 border border-harvest-200 rounded-xl text-xs font-semibold hover:bg-harvest-100 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-harvest-700" />
                <span className="capitalize">{role.replace('_', ' ')}</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-50">
                    {t('switchPersona')}
                  </div>
                  {rolesList.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => {
                        switchDemoRole(r.key)
                        setRoleDropdownOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-farm-50 ${
                        role === r.key ? 'bg-farm-50/70 text-farm-800 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      <span>{r.label}</span>
                      {role === r.key && <span className="w-1.5 h-1.5 rounded-full bg-farm-600"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Settings Link */}
            <Link
              to="/profile"
              className="p-2 rounded-xl bg-gray-50 border border-gray-200 hover:bg-farm-50 text-gray-700"
              title={t('navProfile')}
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className="btn-farm text-xs py-2 px-3.5 font-bold"
            >
              {t('navDashboard')}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <NotificationDrawer />
            <button
              onClick={startListening}
              className={`p-2 rounded-lg ${isListening ? 'bg-red-500 text-white' : 'bg-farm-50 text-farm-700'}`}
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-farm-700 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Voice Status Floating Notice */}
      {feedback && (
        <div className="bg-farm-800 text-white text-xs py-1.5 px-4 text-center font-medium shadow-inner flex items-center justify-center gap-2">
          <Mic className="w-3.5 h-3.5 animate-bounce text-harvest-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3">
          {/* Featured AI Freshness Scanner Button for Mobile */}
          <Link
            to="/freshness-scanner"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-farm-700 text-white shadow-md font-bold text-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="leading-tight">{t('navFreshness')} ✨</div>
                <div className="text-[10px] text-emerald-100 font-normal">AI Quality & Rot Inspector</div>
              </div>
            </div>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Scan →</span>
          </Link>

          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-100">
            {navLinks.filter(l => l.path !== '/freshness-scanner').map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 rounded-lg bg-gray-50 hover:bg-farm-50"
                >
                  <Icon className="w-4 h-4 text-farm-600" />
                  {link.name}
                </Link>
              )
            })}
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-semibold">{t('language')}:</span>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setLangModalOpen(true)
                  }}
                  className="text-xs font-bold text-farm-700 underline"
                >
                  All 22 Languages →
                </button>
              </div>

              {/* Quick 3-language buttons in Mobile Drawer */}
              <div className="grid grid-cols-3 gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`py-1.5 text-xs font-bold rounded-lg text-center transition ${
                    lang === 'en' ? 'bg-white text-farm-900 shadow-xs ring-1 ring-black/5' : 'text-gray-600'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  type="button"
                  onClick={() => setLang('hi')}
                  className={`py-1.5 text-xs font-bold rounded-lg text-center transition ${
                    lang === 'hi' ? 'bg-white text-farm-900 shadow-xs ring-1 ring-black/5' : 'text-gray-600'
                  }`}
                >
                  🇮🇳 हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setLang('gu')}
                  className={`py-1.5 text-xs font-bold rounded-lg text-center transition ${
                    lang === 'gu' ? 'bg-white text-farm-900 shadow-xs ring-1 ring-black/5' : 'text-gray-600'
                  }`}
                >
                  🇮🇳 ગુજરાતી
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">{t('role')}:</span>
              <select
                value={role}
                onChange={(e) => switchDemoRole(e.target.value)}
                className="bg-gray-100 border border-gray-200 rounded-md px-2 py-1 text-xs capitalize"
              >
                <option value="farmer">🌾 {t('farmer')}</option>
                <option value="buyer">🛒 {t('buyer')}</option>
                <option value="transporter">🚚 {t('transporter')}</option>
                <option value="cold_storage">❄️ {t('cold_storage')}</option>
                <option value="admin">🛡️ {t('admin')}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center btn-outline-farm text-xs py-2"
              >
                {t('navProfile')}
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center btn-farm text-xs py-2"
              >
                {t('navDashboard')}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Freshness Scanner Agent Modal */}
      {scannerOpen && (
        <FreshnessScanner onClose={() => setScannerOpen(false)} />
      )}

      {/* Searchable 22-Language Modal */}
      <LanguageSelectorModal isOpen={langModalOpen} onClose={() => setLangModalOpen(false)} />
    </header>
  )
}

