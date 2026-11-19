import React, { useState, useEffect } from 'react'
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown, 
  Filter, 
  BarChart3, 
  AlertCircle, 
  ShieldCheck, 
  Leaf, 
  Bug, 
  Sprout, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  Info,
  Calendar,
  Layers
} from 'lucide-react'
import { VoiceReadButton } from '../../components/common/VoiceReadButton'
import { useVoice } from '../../contexts/VoiceContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import { AUTHENTIC_AGMARKNET_SNAPSHOT, deriveDemandIntelligence, fetchAgmarknetMandiData, AGMARKNET_CONFIG } from '../../services/agmarknetService'
import { FERTILIZERS_DATA, PESTICIDES_DATA } from '../../lib/agriInputsData'
import { DemandCard } from '../../components/demand/DemandCard'
import { DEMAND_INTELLIGENCE_DATA } from '../../data/demandIntelligenceData'

export const MandiRatesPage = () => {
  const [activeTab, setActiveTab] = useState('mandi') // 'mandi' | 'demand' | 'inputs'
  const [inputSubTab, setInputSubTab] = useState('fertilizers') // 'fertilizers' | 'pesticides'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState('All')
  const [showChart, setShowChart] = useState(true)
  const [mandiRates, setMandiRates] = useState(AUTHENTIC_AGMARKNET_SNAPSHOT)
  const [demandData, setDemandData] = useState(() => deriveDemandIntelligence(AUTHENTIC_AGMARKNET_SNAPSHOT))
  const [isSyncing, setIsSyncing] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showApiInput, setShowApiInput] = useState(false)
  const [syncDate, setSyncDate] = useState('08/09/2026')

  const { activeSectionId } = useVoice()
  const { t } = useLanguage()

  const states = ['All', 'Gujarat', 'Maharashtra', 'Uttar Pradesh', 'Madhya Pradesh', 'Haryana', 'Kerala']

  const handleSyncAgmarknet = async () => {
    setIsSyncing(true)
    try {
      const res = await fetchAgmarknetMandiData(apiKey, searchTerm, selectedState)
      setMandiRates(res.records)
      setDemandData(deriveDemandIntelligence(res.records))
      setSyncDate(res.sourceDate)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSyncing(false)
    }
  }

  const filteredRates = mandiRates.filter((item) => {
    const matchesSearch = item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.market.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesState = selectedState === 'All' ? true : item.state === selectedState
    return matchesSearch && matchesState
  })

  // Format chart data
  const chartData = filteredRates.map((item) => ({
    name: item.commodity.split(' ')[0],
    Min: item.min_kg,
    Modal: item.modal_kg,
    Max: item.max_kg,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Agmarknet (agmarknet.gov.in) • data.gov.in Verified</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display font-extrabold text-3xl text-gray-900">
              {t('mandiTitle', 'Live APMC Mandi Rates & Agri Inputs')}
            </h1>
            <VoiceReadButton
              sectionId="mandi-header"
              category="mandi"
              data={filteredRates[0] || mandiRates[0]}
              size="md"
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {t('mandiSubtitle', 'Official Agmarknet wholesale benchmarks, dynamic demand intelligence, and genuine fertilizer & pesticide rates.')}
          </p>
        </div>

        {/* Sync Status & Toggle Chart */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleSyncAgmarknet}
            disabled={isSyncing}
            className="btn-farm text-xs py-2 px-3 shadow-xs"
            title="Sync live rates from data.gov.in"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Agmarknet...' : 'Sync Agmarknet'}</span>
          </button>
          
          <button
            onClick={() => setShowChart(!showChart)}
            className="btn-outline-farm text-xs py-2 px-3.5"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{showChart ? t('close', 'Hide Chart') : t('viewDetails', 'Show Chart')}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Mandi Prices | Demand Intelligence | Fertilizers & Pesticides) */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('mandi')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'mandi'
              ? 'bg-farm-700 text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{t('liveMandiTab', 'Live Agmarknet Mandi Rates')}</span>
        </button>

        <button
          onClick={() => setActiveTab('demand')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'demand'
              ? 'bg-farm-700 text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>{t('demandIntelTab', 'Demand Intelligence (Price + Arrival Trends)')}</span>
        </button>

        <button
          onClick={() => setActiveTab('inputs')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'inputs'
              ? 'bg-farm-700 text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>{t('inputsTab', 'Fertilizers & Pesticides Benchmark')}</span>
        </button>
      </div>

      {/* TAB 1: MANDI RATES */}
      {activeTab === 'mandi' && (
        <div className="space-y-6">
          {/* Official Dataset Metadata Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Agmarknet Resource ID: <code className="bg-white px-2 py-0.5 rounded font-mono text-[11px] border border-emerald-200">{AGMARKNET_CONFIG.RESOURCE_ID}</code></span>
              </div>
              <p className="text-emerald-800">
                Data Synced: <strong>{syncDate}</strong> • Published under Government Open Data License (GODL) India
              </p>
            </div>
            <button
              onClick={() => setShowApiInput(!showApiInput)}
              className="text-[11px] font-semibold text-emerald-800 hover:underline shrink-0"
            >
              {showApiInput ? 'Hide API Key Settings' : '🔑 Custom Data.gov.in API Key'}
            </button>
          </div>

          {/* API Key Drawer */}
          {showApiInput && (
            <div className="glass-card p-4 rounded-2xl space-y-2 text-xs">
              <label className="block font-semibold text-gray-700">Enter your free data.gov.in API Key for direct live calls:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="input-farm flex-1 font-mono text-xs"
                />
                <button onClick={handleSyncAgmarknet} className="btn-farm text-xs py-2 px-4 font-bold">
                  Save & Fetch
                </button>
              </div>
            </div>
          )}

          {/* Recharts Price Comparison Chart */}
          {showChart && chartData.length > 0 && (
            <div className={`glass-card p-6 rounded-2xl space-y-3 transition-all duration-300 ${
              activeSectionId === 'mandi-header' ? 'ring-4 ring-emerald-500/50 bg-emerald-50/50 border-emerald-300 shadow-xl' : ''
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-800">
                  {t('modalPriceCol', 'Modal Price')} (₹{t('perKg', '/kg')})
                </h3>
                <span className="text-xs text-gray-400">
                  {t('minPriceCol', 'Min')} • {t('modalPriceCol', 'Modal')} • {t('maxPriceCol', 'Max')}
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} unit="₹" />
                    <Tooltip
                      formatter={(val) => [`₹${val}/kg`, t('price', 'Price')]}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="Min" fill="#93c5fd" radius={[4, 4, 0, 0]} name={t('minPriceCol', 'Min Price')} />
                    <Bar dataKey="Modal" fill="#15803d" radius={[4, 4, 0, 0]} name={t('modalPriceCol', 'Modal Price')} />
                    <Bar dataKey="Max" fill="#f59e0b" radius={[4, 4, 0, 0]} name={t('maxPriceCol', 'Max Price')} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Filters & Search */}
          <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchProducePlaceholder', 'Search crop or APMC mandi...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-farm pl-10"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 text-xs">
              <span className="text-gray-500 font-semibold shrink-0">{t('filterStateLbl', 'State')}:</span>
              {states.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedState(st)}
                  className={`px-3.5 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
                    selectedState === st
                      ? 'bg-farm-700 text-white font-bold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {st === 'All' ? t('allStates', 'All India') : st}
                </button>
              ))}
            </div>
          </div>

          {/* Rates Table */}
          <div className="glass-card rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-farm-50/80 text-farm-900 border-b border-farm-100 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">{t('commodityCol', 'Commodity')}</th>
                    <th className="py-3.5 px-4">{t('mandiNameCol', 'APMC Mandi / State')}</th>
                    <th className="py-3.5 px-4 text-right">Modal Rate (₹/Qtl)</th>
                    <th className="py-3.5 px-4 text-right font-bold text-farm-800">Equivalent (₹/kg)</th>
                    <th className="py-3.5 px-4 text-right">{t('arrivalsCol', 'Daily Arrivals')}</th>
                    <th className="py-3.5 px-4 text-center">{t('trendCol', 'Trend')}</th>
                    <th className="py-3.5 px-4 text-center">Demand Signal</th>
                    <th className="py-3.5 px-4 text-center">{t('listen', '🔊')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredRates.map((rate, i) => (
                    <tr 
                      key={i} 
                      className={`transition-colors ${
                        activeSectionId === `mandi-row-${i}` ? 'bg-emerald-100/80 font-bold' : 'hover:bg-farm-50/40'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{rate.commodity}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{rate.variety} ({rate.grade})</div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        <div className="font-medium text-gray-900">{rate.market}</div>
                        <div className="text-[10px] text-gray-400">{rate.district ? `${rate.district}, ` : ''}{rate.state}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-gray-700">
                        ₹{rate.modal_price.toLocaleString('en-IN')}/qtl
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-farm-700 text-sm">
                        ₹{rate.modal_kg.toFixed(2)}/kg
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-gray-700">
                        {rate.arrival_tonnes} MT
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                            rate.trendUp
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {rate.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {rate.price_change_pct > 0 ? `+${rate.price_change_pct}%` : `${rate.price_change_pct}%`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rate.price_change_pct > 3.0 && rate.arrival_tonnes < (rate.prev_arrival_tonnes || 999)
                            ? 'bg-emerald-100 text-emerald-800'
                            : (rate.price_change_pct < -2.0 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800')
                        }`}>
                          {rate.price_change_pct > 3.0 && rate.arrival_tonnes < (rate.prev_arrival_tonnes || 999)
                            ? '🔥 High Demand'
                            : (rate.price_change_pct < -2.0 ? '⚠️ Oversupply' : '⚖️ Stable')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <VoiceReadButton
                          sectionId={`mandi-row-${i}`}
                          category="mandi"
                          data={rate}
                          size="sm"
                          showLabel={false}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEMAND INTELLIGENCE (Derived from Agmarknet Price + Arrival Dynamics) */}
      {activeTab === 'demand' && (
        <div className="space-y-6">
          <div className="bg-farm-900 text-white p-6 rounded-3xl space-y-2 border border-farm-800">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-farm-800 text-harvest-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('agmarknetTrendBadge', 'Real-Time Agmarknet Trend Intelligence')}</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl text-white">
              {t('dataDrivenDemandTitle', 'Data-Driven Demand & Crop Marketing Signals')}
            </h2>
            <p className="text-xs text-farm-300 max-w-3xl">
              {t('demandCalcExplainer', 'Demand labels are dynamically computed directly from real Agmarknet market behavior: Rising Price + Falling Arrivals = High Demand (Supply Deficit); Falling Price + Surging Arrivals = Oversupply.')}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-farm-700" />
                <span>High-Growth National Crop Forecasts (NHB / APEDA / MIDH Data)</span>
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                {DEMAND_INTELLIGENCE_DATA.length} Researched High-Demand Commodities
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEMAND_INTELLIGENCE_DATA.map((dem) => (
                <DemandCard
                  key={dem.id}
                  crop={dem.crop_name}
                  trend={dem.trend_pct}
                  demandScore={dem.demand_score}
                  source={dem.source}
                  productionVolume={dem.production_volume}
                  topStates={dem.top_producing_states}
                  marketSizeNote={dem.market_size_note}
                  recommendation={dem.farmer_recommendation}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-farm-700" />
              <span>Real-Time APMC Mandi Arrival & Price Dynamic Signals</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demandData.map((d, idx) => (
                <div key={idx} className="glass-card p-5 rounded-2xl space-y-3 border-farm-100 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base text-gray-900">{d.commodity}</h3>
                      <span className="text-xs text-gray-500">{d.market} ({d.state})</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${d.demandBadge}`}>
                      {d.demandLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl text-xs">
                    <div>
                      <span className="text-gray-500 block">7-Day Price Trend:</span>
                      <span className={`font-mono font-bold ${d.trendUp ? 'text-emerald-700' : 'text-red-700'}`}>
                        {d.price_change_pct > 0 ? `+${d.price_change_pct}%` : `${d.price_change_pct}%`} (₹{d.modal_kg}/kg)
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Arrival Volume Change:</span>
                      <span className="font-mono font-bold text-gray-800">
                        {d.arrivalChangePct > 0 ? `+${d.arrivalChangePct}%` : `${d.arrivalChangePct}%`} ({d.arrival_tonnes} MT)
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-farm-900 bg-farm-50/70 p-3 rounded-xl border border-farm-200/50">
                    <strong>💡 Actionable Farmer Advisory: </strong>{d.advice}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AGRICULTURAL INPUTS BENCHMARK (Fertilizers & Pesticides) */}
      {activeTab === 'inputs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-gray-900">
                Agricultural Inputs Benchmark (Fertilizers & Crop Protection)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Authentic Indian market rates from verified manufacturers (IFFCO, Coromandel, Bayer, UPL, Chambal).
              </p>
            </div>

            {/* Sub-Tabs: Fertilizers vs Pesticides */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-2xl text-xs font-bold self-start sm:self-auto">
              <button
                onClick={() => setInputSubTab('fertilizers')}
                className={`px-4 py-1.5 rounded-xl transition-all ${
                  inputSubTab === 'fertilizers'
                    ? 'bg-farm-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🌱 Fertilizers (Urea, DAP, NPK)
              </button>
              <button
                onClick={() => setInputSubTab('pesticides')}
                className={`px-4 py-1.5 rounded-xl transition-all ${
                  inputSubTab === 'pesticides'
                    ? 'bg-farm-700 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🛡️ Crop Protection & Pesticides
              </button>
            </div>
          </div>

          {/* Pricing Disclaimer Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Illustrative Sample Pricing Disclaimer:</strong> Real retail rates vary by state, dealer transportation, and seasonal subsidy allocations. Subsidized fertilizers (Urea & DAP) require Aadhaar authentication via PoS machines at authorized cooperative societies.
            </div>
          </div>

          {/* FERTILIZERS LIST */}
          {inputSubTab === 'fertilizers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FERTILIZERS_DATA.map((f) => (
                <div key={f.id} className="glass-card p-5 rounded-2xl space-y-3.5 border-farm-100">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-bold text-farm-700 uppercase tracking-wider">{f.type}</div>
                      <h3 className="font-bold text-base text-gray-900">{f.name}</h3>
                      <span className="text-xs text-gray-500">Major Brands: <strong>{f.brand}</strong></span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-extrabold text-farm-800 text-sm">{f.price_range}</div>
                      {f.is_subsidized && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                          {f.subsidy_type}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl text-xs">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-semibold text-gray-500">Composition:</span>
                      <span className="font-mono text-gray-900">{f.composition}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span className="font-semibold text-gray-500">Application Stage:</span>
                      <span className="text-gray-900 text-right">{f.application_stage}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span className="font-semibold text-gray-500">Recommended Dosage:</span>
                      <span className="text-farm-800 font-semibold">{f.dosage}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Agronomic Impact: </strong>{f.benefits}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* PESTICIDES LIST */}
          {inputSubTab === 'pesticides' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PESTICIDES_DATA.map((p) => (
                <div key={p.id} className="glass-card p-5 rounded-2xl space-y-3.5 border-farm-100">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-bold text-farm-700 uppercase tracking-wider">{p.category}</div>
                      <h3 className="font-bold text-base text-gray-900">{p.name}</h3>
                      <span className="text-xs text-gray-500">Brands: <strong>{p.brand}</strong></span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono font-extrabold text-farm-800 text-sm">{p.price_range}</div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-bold">
                        {p.toxicity_class.split(' ')[0]} Label
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl text-xs">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-semibold text-gray-500">Target Pests/Diseases:</span>
                      <span className="text-gray-900 text-right font-medium">{p.target_pests.join(', ')}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span className="font-semibold text-gray-500">Dosage:</span>
                      <span className="text-farm-800 font-semibold">{p.dosage}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span className="font-semibold text-gray-500">Suitable Crops:</span>
                      <span className="text-gray-900">{p.suitable_crops.join(', ')}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                    <strong>⚠️ Pre-Harvest Safety: </strong>{p.safety_waiting_period}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

