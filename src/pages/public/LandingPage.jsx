import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Sprout, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Warehouse, 
  Truck, 
  FileText, 
  ScanLine, 
  CheckCircle2, 
  Users, 
  Scale, 
  DollarSign, 
  Mic, 
  ChevronRight,
  Gavel,
  Lock
} from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import { KenBurnsCarousel } from '../../components/common/KenBurnsCarousel'
import { Interactive3DCrop } from '../../components/common/Interactive3DCrop'
import { TiltCard } from '../../components/common/TiltCard'
import { REAL_MANDI_PRICES, DEMAND_INTELLIGENCE } from '../../lib/demoData'

export const LandingPage = () => {
  const { t } = useLanguage()
  const { switchDemoRole } = useAuth()

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-farm-100/80 border border-farm-200 text-farm-800 text-xs font-semibold backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-farm-600 animate-ping" />
              <span>{t('heroBadge')}</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-gray-900 tracking-tight leading-[1.12]">
              {t('heroTitle1')} <br />
              <span className="bg-gradient-to-r from-farm-700 via-farm-600 to-harvest-600 bg-clip-text text-transparent">
                {t('heroTitle2')}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              {t('heroDesc')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link to="/marketplace" className="btn-farm text-sm px-6 py-3 shadow-lg shadow-farm-700/25 font-bold">
                <span>{t('exploreMarketplaceBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="btn-outline-farm text-sm px-5 py-3">
                <span>{t('getStartedFreeBtn')}</span>
              </Link>
              <Link to="/freshness-scanner" className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:border-farm-400 hover:text-farm-700 shadow-xs">
                <ScanLine className="w-4 h-4 text-farm-600" />
                <span>{t('navFreshness')}</span>
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-farm-600" />
                <span>{t('directTradeNotice')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-farm-600" />
                <span>{t('escrowLocked')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Interactive Visual Centerpiece & Photo Carousel */}
          <div className="lg:col-span-6 space-y-6">
            <Interactive3DCrop />
            <KenBurnsCarousel />
          </div>
        </div>
      </section>

      {/* 2. STATS COUNTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card bg-white/90 p-6 sm:p-8 rounded-3xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center border-farm-100 shadow-sm bg-agro-pattern">
          <div className="space-y-1">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-farm-800">{t('statsFarmers')}</div>
            <div className="text-xs text-gray-500 font-medium">{t('statsFarmersLbl')}</div>
          </div>
          <div className="space-y-1 border-l border-gray-100">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-harvest-600">{t('statsProduce')}</div>
            <div className="text-xs text-gray-500 font-medium">{t('statsProduceLbl')}</div>
          </div>
          <div className="space-y-1 border-l border-gray-100">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-farm-700">{t('statsOrders')}</div>
            <div className="text-xs text-gray-500 font-medium">{t('statsOrdersLbl')}</div>
          </div>
          <div className="space-y-1 border-l border-gray-100">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-600">{t('statsSaved')}</div>
            <div className="text-xs text-gray-500 font-medium">{t('statsSavedLbl')}</div>
          </div>
        </div>
      </section>

      {/* 3. 5 ROLE SELECTION SHORTCUTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold text-farm-700 uppercase tracking-wider">{t('featuresHeading')}</span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900">
            {t('featuresSubtitle')}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            { role: 'farmer', title: t('farmer'), icon: Sprout, desc: t('feat1Desc'), color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
            { role: 'buyer', title: t('buyer'), icon: Users, desc: t('feat2Desc'), color: 'text-amber-700 bg-amber-50 border-amber-200' },
            { role: 'transporter', title: t('transporter'), icon: Truck, desc: t('feat4Desc'), color: 'text-blue-700 bg-blue-50 border-blue-200' },
            { role: 'cold_storage', title: t('cold_storage'), icon: Warehouse, desc: t('feat3Desc'), color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
            { role: 'admin', title: t('admin'), icon: ShieldCheck, desc: t('feat5Desc'), color: 'text-purple-700 bg-purple-50 border-purple-200' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <TiltCard key={item.role}>
                <button
                  onClick={() => switchDemoRole(item.role)}
                  className={`w-full h-full text-left p-4 rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between ${item.color}`}
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
                      <p className="text-[11px] text-gray-600 mt-1 leading-snug line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-2 border-t border-black/5 flex items-center justify-between text-xs font-semibold">
                    <span>{t('switchPersona')}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </div>
                </button>
              </TiltCard>
            )
          })}
        </div>
      </section>

      {/* 4. HOW FARMFRESH WORKS (4-STEP FLOW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card-green p-8 sm:p-12 rounded-3xl space-y-8 bg-agro-pattern border-farm-200">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-farm-800 uppercase tracking-wider">{t('tagline')}</span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-farm-950">
              {t('featuresHeading')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: t('feat2Title'),
                desc: t('feat2Desc'),
                icon: ScanLine
              },
              {
                step: '02',
                title: t('feat1Title'),
                desc: t('feat1Desc'),
                icon: Gavel
              },
              {
                step: '03',
                title: t('feat3Title'),
                desc: t('feat3Desc'),
                icon: Truck
              },
              {
                step: '04',
                title: t('feat5Title'),
                desc: t('feat5Desc'),
                icon: ShieldCheck
              }
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.step} className="bg-white/90 p-5 rounded-2xl border border-farm-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-farm-100 flex items-center justify-center text-farm-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xl font-bold text-farm-300">{item.step}</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. LIVE APMC MANDI RATES TICKER & DEMAND INTEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-farm-700 uppercase tracking-wider">{t('livePricesTitle')}</span>
            <h2 className="font-display font-bold text-2xl text-gray-900">{t('livePricesDesc')}</h2>
          </div>
          <Link to="/mandi-rates" className="btn-outline-farm text-xs self-start sm:self-auto">
            <span>{t('viewAllRatesBtn')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REAL_MANDI_PRICES.slice(0, 6).map((item, idx) => (
            <div key={idx} className="glass-card p-4 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-bold text-sm text-gray-900">{item.crop}</div>
                <div className="text-xs text-gray-500">{item.mandi}</div>
              </div>
              <div className="text-right space-y-0.5">
                <div className="font-mono font-bold text-base text-farm-800">₹{item.modal.toFixed(1)}{t('perKg')}</div>
                <div className={`text-[11px] font-semibold ${item.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                  {item.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Demand Intel highlight box */}
        <div className="glass-card-amber p-6 rounded-2xl border border-harvest-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-harvest-600" />
            <h3 className="font-bold text-sm text-harvest-950">{t('marketDemandAdvisory')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {DEMAND_INTELLIGENCE.map((intel, idx) => (
              <div key={idx} className="bg-white/80 p-3 rounded-xl border border-harvest-100">
                <div className="font-bold text-gray-900">{intel.crop} ({intel.metro})</div>
                <div className="text-harvest-700 font-semibold mt-1">{intel.expected_price_jump}</div>
                <div className="text-gray-500 text-[11px] mt-1">{intel.recommendation}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION / REGISTRATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-farm-800 to-farm-950 rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
              {t('ctaTitle')}
            </h2>
            <p className="text-sm sm:text-base text-farm-200">
              {t('ctaSubtitle')}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/marketplace" className="px-6 py-3 rounded-xl font-bold text-farm-900 bg-harvest-400 hover:bg-harvest-300 transition-colors shadow-lg">
              {t('exploreMarketplaceBtn')}
            </Link>
            <Link to="/dashboard" className="px-6 py-3 rounded-xl font-semibold text-white bg-farm-700/80 hover:bg-farm-700 border border-farm-500 transition-colors">
              {t('navDashboard')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
