import React, { useState } from 'react'
import { Truck, ThermometerSnowflake, MapPin, Phone, ShieldCheck, Star, Navigation, X } from 'lucide-react'
import { farmFreshStore } from '../../lib/store'
import toast, { Toaster } from 'react-hot-toast'
import { VoiceReadButton } from '../../components/common/VoiceReadButton'
import { useVoice } from '../../contexts/VoiceContext'
import { useLanguage } from '../../contexts/LanguageContext'

export const TransportPage = () => {
  const [vehicles] = useState(() => farmFreshStore.getVehicles())
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const { activeSectionId } = useVoice()
  const { t } = useLanguage()
  const [tripData, setTripData] = useState({
    pickup: 'Anand Mandi Yard, Gujarat',
    destination: 'Vashi APMC Market, Navi Mumbai',
    estimated_km: 440,
    cargo_type: 'Tomato Crates',
    cargo_weight_kg: 3500,
  })

  const handleBookTransport = (e) => {
    e.preventDefault()
    if (!selectedVehicle) return

    const totalEstimate = Number(tripData.estimated_km) * selectedVehicle.base_rate_per_km
    toast.success(`${t('bookVehicleBtn')}: ${selectedVehicle.vehicle_number} (${selectedVehicle.driver_name}) ₹${totalEstimate.toLocaleString()}`)
    setSelectedVehicle(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>{t('navTransport')}</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-gray-900">
            {t('transportTitle')}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t('transportSubtitle')}
          </p>
        </div>

        <VoiceReadButton
          sectionId="transport-overview"
          category="transport"
          data={vehicles[0]}
          size="md"
        />
      </div>

      {/* Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className={`glass-card p-6 rounded-2xl space-y-4 border-blue-100 flex flex-col justify-between transition-all duration-300 ${
              activeSectionId === `vehicle-${v.id}` ? 'ring-4 ring-blue-500/50 bg-blue-50/60 shadow-xl border-blue-300' : 'hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-gray-900">{v.vehicle_type}</span>
                    {v.is_refrigerated && (
                      <span className="glass-badge bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                        <ThermometerSnowflake className="w-3 h-3" />
                        {t('reeferTruck')}
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-xs text-gray-500 font-semibold tracking-wider">
                    {v.vehicle_number}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right whitespace-nowrap">
                    <span className="font-mono font-bold text-lg text-blue-800">
                      ₹{v.base_rate_per_km}
                    </span>
                    <span className="text-[11px] text-gray-500 block">/km base</span>
                  </div>
                  <VoiceReadButton
                    sectionId={`vehicle-${v.id}`}
                    category="transport"
                    data={v}
                    size="sm"
                    showLabel={false}
                  />
                </div>
              </div>

              {/* Driver & Specs */}
              <div className="bg-gray-50/80 rounded-xl p-3.5 text-xs space-y-2">
                <div className="flex justify-between items-center text-gray-600">
                  <span>{t('driverNameLbl')}:</span>
                  <div className="flex items-center gap-1 font-semibold text-gray-900">
                    <span>{v.driver_name}</span>
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{v.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>{t('payloadWeightLbl')}:</span>
                  <span className="font-bold text-gray-900">{(v.capacity_kg / 1000).toFixed(1)} MT ({v.capacity_kg} kg)</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>{t('harvestLocation')}:</span>
                  <span className="text-farm-700 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {v.current_location}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>{t('liveTempLbl')}:</span>
                  <span className="text-gray-800 font-mono text-[11px]">{v.temp_range}</span>
                </div>
              </div>

              {/* Corridors */}
              <div className="text-xs text-gray-500 space-y-1">
                <span className="font-semibold text-gray-700">{t('operating_routes') || 'Routes'}:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {v.operating_routes.map((rt, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] border border-blue-100">
                      {rt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
              <a
                href={`tel:${v.driver_phone}`}
                className="btn-outline-farm text-xs py-2 px-3 flex-1 text-center"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t('driverPhoneLbl')}</span>
              </a>
              <button
                onClick={() => setSelectedVehicle(v)}
                className="btn-farm text-xs py-2 px-4 flex-1 shadow-xs"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{t('bookVehicleBtn')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">{t('bookVehicleBtn')}</h3>
              <button onClick={() => setSelectedVehicle(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookTransport} className="space-y-3 text-xs">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-blue-900">
                <div className="font-bold">{selectedVehicle.vehicle_type} ({selectedVehicle.vehicle_number})</div>
                <div className="text-[11px] text-blue-700">{t('driverNameLbl')}: {selectedVehicle.driver_name} • ₹{selectedVehicle.base_rate_per_km}/km</div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">{t('pickupCityLbl')}</label>
                <input
                  type="text"
                  required
                  value={tripData.pickup}
                  onChange={(e) => setTripData({ ...tripData, pickup: e.target.value })}
                  className="input-farm"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">{t('dropCityLbl')}</label>
                <input
                  type="text"
                  required
                  value={tripData.destination}
                  onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
                  className="input-farm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    required
                    value={tripData.estimated_km}
                    onChange={(e) => setTripData({ ...tripData, estimated_km: e.target.value })}
                    className="input-farm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{t('quantity')} (kg)</label>
                  <input
                    type="number"
                    required
                    value={tripData.cargo_weight_kg}
                    onChange={(e) => setTripData({ ...tripData, cargo_weight_kg: e.target.value })}
                    className="input-farm"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-gray-600">
                  <span>{t('estimatedCostLbl')}:</span>
                  <span className="font-bold text-blue-900 text-xs">
                    ₹{(Number(tripData.estimated_km) * selectedVehicle.base_rate_per_km).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedVehicle(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  {t('cancel')}
                </button>
                <button type="submit" className="btn-farm text-xs py-2 px-5">
                  {t('confirm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
