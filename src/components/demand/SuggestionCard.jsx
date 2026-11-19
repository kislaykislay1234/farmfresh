import React from 'react'
import { Lightbulb, Clock, CloudSun, MapPin, Sparkles, CheckCircle2 } from 'lucide-react'
import { VoiceReadButton } from '../common/VoiceReadButton'

export const SuggestionCard = ({
  cropName,
  climateNote,
  daysToHarvest,
  demandLevel = 'high',
  recommendation,
  regionTag = 'Uttar Pradesh, Bihar, Odisha, Maharashtra, Uttarakhand'
}) => {
  return (
    <div className="glass-card p-5 rounded-2xl border-harvest-200 bg-white/95 space-y-3.5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1 rounded-lg bg-harvest-100 text-harvest-800">
              <Lightbulb className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-base text-gray-900">{cropName}</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
              {demandLevel} Demand Crop
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>Harvest Cycle: <strong>{daysToHarvest} Days</strong> (Rapid Turnover)</span>
          </div>
        </div>

        <VoiceReadButton
          sectionId={`suggestion-${cropName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
          category="recommendation"
          data={{
            crop: cropName,
            harvest_period: `${daysToHarvest} days`,
            demand_level: demandLevel,
            description: recommendation
          }}
          size="sm"
        />
      </div>

      {/* Climate & Growth Space Note */}
      <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 text-xs text-amber-950 space-y-1">
        <div className="font-bold flex items-center gap-1 text-[11px] text-amber-900">
          <CloudSun className="w-3.5 h-3.5 text-amber-700" />
          <span>Optimal Growing Conditions:</span>
        </div>
        <p className="text-gray-700 leading-relaxed">{climateNote}</p>
      </div>

      {/* Farmer Recommendation & Subsidies */}
      {recommendation && (
        <div className="bg-farm-50/80 p-3 rounded-xl border border-farm-200/70 text-xs text-farm-900 space-y-1">
          <div className="font-bold flex items-center gap-1 text-[11px] text-farm-950">
            <Sparkles className="w-3.5 h-3.5 text-harvest-600" />
            <span>Market Opportunity & Subsidies:</span>
          </div>
          <p className="leading-relaxed">{recommendation}</p>
        </div>
      )}

      {/* Recommended Regions */}
      {regionTag && (
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
          <MapPin className="w-3.5 h-3.5 text-harvest-600 shrink-0" />
          <span className="truncate">Top Suitable States: <strong>{regionTag}</strong></span>
        </div>
      )}
    </div>
  )
}

export default SuggestionCard
