// src/data/mushroomDemandData.js
// Real sourced data — National Horticulture Board (nhb.gov.in) & APEDA (apeda.gov.in)
// Use as fallback mock data if the demand_data table isn't populated yet in dev

export const mushroomDemandData = {
  crop_name: "Mushroom (Button)",
  demand_label: "High Demand",
  demand_score: 88,
  trend_pct: "+12.2%",
  trend_period: "YoY, 2026 market growth",
  production_volume: "398,770 tonnes (FY2024-25, NHB)",
  top_producing_states: [
    { state: "Uttar Pradesh", share_pct: 12.27, tonnes: 48800 },
    { state: "Odisha", share_pct: 11.79, tonnes: 47000 },
    { state: "Bihar", share_pct: 11.27, tonnes: 44930 },
    { state: "Maharashtra", share_pct: 8.11, tonnes: 32340 },
    { state: "Uttarakhand", share_pct: 8.0, tonnes: 31900 },
  ],
  market_size_note: "India's mushroom market: ~$1.72B in 2026, growing toward ~$3.02B by 2035",
  source: "National Horticulture Board (nhb.gov.in), APEDA (apeda.gov.in)",
  farmer_recommendation:
    "Mushroom demand and market value are growing faster than most vegetable crops. If your region has cold, shaded space, mushroom cultivation may be worth exploring — check if your state offers a setup subsidy (e.g. Bihar's hut-production scheme covers 50% of setup cost).",
};

export const mushroomCropSuggestion = {
  crop_name: "Button Mushroom",
  category: "underused",
  rough_climate_note:
    "Cool, shaded, humidity-controlled space (indoor cultivation, no large land needed); ideal 18-22°C",
  avg_days_to_harvest: 30,
  demand_level: "high",
  region_tag: "Uttar Pradesh, Bihar, Odisha, Maharashtra, Uttarakhand",
};
