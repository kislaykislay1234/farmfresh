import React from 'react'
import { TrendingUp, Sparkles, ShieldCheck, BarChart2 } from 'lucide-react'
import { VoiceReadButton } from '../common/VoiceReadButton'

export const DemandCard = ({
  crop,
  trend,
  demandScore = 88,
  source = "National Horticulture Board (nhb.gov.in)",
  market,
  state,
  productionVolume,
  topStates = [],
  marketSizeNote,
  recommendation
}) => {
  return (
    <div className="glass-card p-5 rounded-2xl space-y-3.5 border-farm-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-gray-900">{crop}</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              🔥 High Demand ({demandScore}/100)
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {market ? `${market} (${state})` : 'National Benchmark • High Growth Sector'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <VoiceReadButton
            sectionId={`demand-${crop.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            category="mandi"
            data={{
              commodity: crop,
              demand_level: "High Demand",
              trend: trend,
              demand_score: demandScore,
              recommendation: recommendation || "High market growth crop with rising demand."
            }}
            size="sm"
          />
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 gap-2 bg-emerald-50/60 p-3 rounded-xl text-xs border border-emerald-100/80">
        <div>
          <span className="text-gray-500 block text-[11px]">Demand Growth:</span>
          <span className="font-mono font-bold text-emerald-700 text-sm flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {trend} (YoY Growth)
          </span>
        </div>
        <div>
          <span className="text-gray-500 block text-[11px]">Demand Score:</span>
          <span className="font-mono font-bold text-gray-800 text-sm">
            {demandScore} / 100
          </span>
        </div>
      </div>

      {/* Production Volume & Top States */}
      {topStates.length > 0 && (
        <div className="space-y-1.5 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
          <span className="text-gray-600 font-semibold block text-[11px]">Top Producing States (NHB Data):</span>
          <div className="flex flex-wrap gap-1.5">
            {topStates.map((st, idx) => (
              <span key={idx} className="bg-white px-2 py-0.5 rounded-md text-[10px] font-medium text-gray-700 border border-gray-200 shadow-2xs">
                {st.state}: <strong>{st.share_pct}%</strong> ({st.tonnes.toLocaleString()} MT)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actionable recommendation */}
      {recommendation && (
        <div className="text-xs text-farm-900 bg-farm-50/80 p-3 rounded-xl border border-farm-200/70 leading-relaxed">
          <div className="font-bold text-farm-950 flex items-center gap-1 mb-0.5">
            <Sparkles className="w-3 h-3 text-harvest-600" />
            <span>Actionable Farmer Advisory:</span>
          </div>
          <span>{recommendation}</span>
        </div>
      )}

      {/* Data Source Badge */}
      <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-gray-100">
        <span>Verified Sourced Data</span>
        <span className="font-mono">{source}</span>
      </div>
    </div>
  )
}

export default DemandCard
