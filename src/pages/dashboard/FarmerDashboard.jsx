import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Sprout, 
  TrendingUp, 
  Plus, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  ShoppingBag, 
  DollarSign, 
  Lightbulb, 
  ArrowRight,
  BarChart3,
  Users
} from 'lucide-react'
import { farmFreshStore } from '../../lib/store'
import { useAuth } from '../../contexts/AuthContext'
import { useVoice } from '../../contexts/VoiceContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { VoiceAgentButton } from '../../components/common/VoiceAgentButton'
import { VoiceReadButton } from '../../components/common/VoiceReadButton'
import { TiltCard } from '../../components/common/TiltCard'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import { SuggestionCard } from '../../components/demand/SuggestionCard'
import { mushroomDemandData, mushroomCropSuggestion } from '../../data/mushroomDemandData'

export const FarmerDashboard = () => {
  const { profile } = useAuth()
  const { activeSectionId } = useVoice()
  const { t, currentLanguage } = useLanguage()
  const products = farmFreshStore.getProducts().filter(p => p.farmer_name.includes('Ramesh') || p.farmer_id === 'f101')
  const [showDiversification, setShowDiversification] = useState(true)
  const diversificationCrops = farmFreshStore.getCropDiversificationSuggestions()
  const villageComparison = farmFreshStore.getVillageSalesComparison()

  // Format Recharts data for "How I'm Doing" Village Sales Comparison
  const comparisonData = [
    {
      category: `${t('totalEarnings')} (₹k)`,
      'Your Farm': villageComparison.farmer_revenue / 1000,
      'Village Average': villageComparison.village_avg_revenue / 1000,
      'Top Performer': villageComparison.top_performer_revenue / 1000,
    },
    {
      category: `${t('statsProduceLbl')} (${t('quintal')})`,
      'Your Farm': villageComparison.farmer_yield_qtl,
      'Village Average': villageComparison.village_avg_yield_qtl,
      'Top Performer': villageComparison.top_performer_yield_qtl,
    }
  ]

  return (
    <div className="space-y-6">
      {/* Top Welcome Bar */}
      <div className={`glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 ${
        activeSectionId === 'welcome-bar' ? 'ring-4 ring-emerald-500/50 bg-emerald-50/50 shadow-xl border-emerald-300' : 'border-farm-100'
      }`}>
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar}
            alt={profile.full_name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-farm-300 shadow-sm"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xl text-gray-900">{profile.full_name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-farm-100 text-farm-800 border border-farm-200">
                {t('verified')} {t('farmer')}
              </span>
              <VoiceReadButton
                sectionId="welcome-bar"
                category="earnings"
                data={{ revenue: '11,45,000', yield_qtl: 482 }}
                size="sm"
              />
            </div>
            <p className="text-xs text-gray-500">
              {profile.city_village}, {profile.district}, {profile.state} • {profile.farm_size_acres} Acres
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-emerald-50 border border-emerald-200 rounded-2xl p-2 px-3 gap-3 shadow-inner">
            <div className="text-left hidden md:block">
              <p className="text-[11px] font-bold text-emerald-900">Voice Assistant (22 Langs)</p>
              <p className="text-[10px] text-emerald-700">Ask earnings, demand & storage</p>
            </div>
            <VoiceAgentButton farmerId={profile.id || 'f101'} languageCode={currentLanguage} compact={true} />
          </div>

          <Link to="/marketplace" className="btn-farm text-xs py-2 px-4 shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            <span>{t('listCrop')}</span>
          </Link>
          <Link to="/freshness-scanner" className="btn-outline-farm text-xs py-2 px-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('scanProduceQuality')}</span>
          </Link>
        </div>
      </div>

      {/* 3D Tilt Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <TiltCard>
          <div className={`glass-card p-4 rounded-2xl space-y-1 h-full flex flex-col justify-between transition-all duration-300 ${
            activeSectionId === 'card-revenue' ? 'ring-4 ring-emerald-500/50 bg-emerald-50/60 shadow-xl border-emerald-300' : ''
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">{t('totalEarnings')}</span>
              <VoiceReadButton
                sectionId="card-revenue"
                category="earnings"
                data={{ revenue: '11,45,000', yield_qtl: 482 }}
                size="sm"
                showLabel={false}
              />
            </div>
            <div className="font-mono font-bold text-2xl text-farm-800 animate-in fade-in duration-500">₹11,45,000</div>
            <span className="text-[11px] text-emerald-600 font-semibold">+18.4% vs last year</span>
          </div>
        </TiltCard>

        <TiltCard>
          <div className="glass-card p-4 rounded-2xl space-y-1 h-full flex flex-col justify-between">
            <span className="text-xs text-gray-500 font-medium">{t('statsProduceLbl')}</span>
            <div className="font-mono font-bold text-2xl text-harvest-700">48.2 {t('ton')}</div>
            <span className="text-[11px] text-gray-500">Across 6 harvests</span>
          </div>
        </TiltCard>

        <TiltCard>
          <div className="glass-card p-4 rounded-2xl space-y-1 h-full flex flex-col justify-between">
            <span className="text-xs text-gray-500 font-medium">{t('kisanCreditCard')}</span>
            <div className="font-mono font-bold text-2xl text-blue-700">₹3,00,000</div>
            <span className="text-[11px] text-blue-600 font-semibold">At 4% concessional</span>
          </div>
        </TiltCard>

        <TiltCard>
          <div className="glass-card p-4 rounded-2xl space-y-1 h-full flex flex-col justify-between">
            <span className="text-xs text-gray-500 font-medium">Soil Health Card</span>
            <div className="font-bold text-base text-gray-900 mt-1">SHC-GJ-2024-8921</div>
            <span className="text-[11px] text-emerald-700">Optimal N-P-K & Zinc</span>
          </div>
        </TiltCard>
      </div>

      {/* "HOW I'M DOING" VILLAGE SALES COMPARISON */}
      <div className={`glass-card p-6 rounded-3xl space-y-4 transition-all duration-300 ${
        activeSectionId === 'village-benchmark' ? 'ring-4 ring-emerald-500/50 bg-emerald-50/50 shadow-xl border-emerald-300' : 'border-farm-100'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-farm-700" />
            <h3 className="font-bold text-base text-gray-900">{t('marketDemandAdvisory')} — {t('farmerDashTitle')}</h3>
          </div>
          <div className="flex items-center gap-2">
            <VoiceReadButton
              sectionId="village-benchmark"
              category="earnings"
              data={{ revenue: '11,45,000', yield_qtl: 482 }}
              size="sm"
            />
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">{t('mandiBenchmark')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Grouped Bar Chart */}
          <div className="lg:col-span-7 h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip
                  formatter={(val, name) => [name.includes('Revenue') ? `₹${val}k` : `${val} ${t('quintal')}`, name]}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Your Farm" fill="#15803d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Village Average" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Top Performer" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Automated Plain-Language Analysis */}
          <div className="lg:col-span-5 bg-farm-50/80 p-5 rounded-2xl border border-farm-200 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-farm-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-harvest-600" />
              <span>{t('aiRecommendation')}</span>
            </div>
            <p className="text-farm-900/90 leading-relaxed font-medium">
              {villageComparison.analysis}
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-farm-800 font-semibold border-t border-farm-200/60">
              <span>{t('demandHigh')}</span>
              <span className="text-emerald-700">✓ {t('status')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CROP DIVERSIFICATION ADVISOR */}
      {showDiversification && (
        <div className={`glass-card-amber p-6 rounded-3xl border space-y-4 transition-all duration-300 ${
          activeSectionId === 'crop-diversification' ? 'ring-4 ring-amber-500/50 bg-amber-100/60 shadow-xl border-amber-400' : 'border-harvest-300'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 text-harvest-900 font-bold text-base flex-wrap">
              <Lightbulb className="w-5 h-5 text-harvest-600 shrink-0" />
              <span>{t('marketDemandAdvisory')}</span>
              <VoiceReadButton
                sectionId="crop-diversification"
                category="recommendation"
                data={diversificationCrops[0]}
                size="sm"
              />
            </div>
            <button
              onClick={() => setShowDiversification(false)}
              className="text-xs text-harvest-700 hover:text-harvest-900"
            >
              {t('close')}
            </button>
          </div>

          <p className="text-xs text-harvest-950 leading-relaxed font-medium">
            {t('aiForecastDesc')}
          </p>

          {/* Sourced Crop Diversification Highlight: Button Mushroom */}
          <SuggestionCard
            cropName={mushroomCropSuggestion.crop_name}
            climateNote={mushroomCropSuggestion.rough_climate_note}
            daysToHarvest={mushroomCropSuggestion.avg_days_to_harvest}
            demandLevel={mushroomCropSuggestion.demand_level}
            recommendation={mushroomDemandData.farmer_recommendation}
            regionTag={mushroomCropSuggestion.region_tag}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {diversificationCrops.map((c) => (
              <div key={c.id} className="bg-white/90 p-3.5 rounded-xl border border-harvest-200 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between font-bold text-gray-900">
                  <span>{c.crop}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px]">
                    {c.profit_increase}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 font-medium">
                  {c.category} • Harvest: {c.harvest_period}
                </div>
                <p className="text-[11px] text-gray-600 line-clamp-2">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Produce Listings */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-gray-900">{t('myCrops')}</h3>
          <Link to="/marketplace" className="text-xs text-farm-700 font-semibold hover:underline">
            {t('viewAll')} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((prod) => (
            <div 
              key={prod.id} 
              className={`bg-white p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                activeSectionId === `prod-${prod.id}` ? 'ring-4 ring-emerald-500/50 bg-emerald-50/50 border-emerald-300 shadow-md' : 'border-gray-100 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <img src={prod.image_url} alt={prod.crop_name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <div className="font-bold text-sm text-gray-900">{prod.crop_name}</div>
                  <div className="text-xs text-gray-500">{prod.available_kg} {t('kg')} {t('availableQty')} • Grade {prod.grade}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-mono font-bold text-farm-800">₹{prod.price_per_kg}{t('perKg')}</div>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    {t('active')}
                  </span>
                </div>
                <VoiceReadButton
                  sectionId={`prod-${prod.id}`}
                  category="freshness"
                  data={{ crop_type: prod.crop_name, freshness_score: 92, grade: prod.grade, estimated_shelf_life_days: 12 }}
                  size="sm"
                  showLabel={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
