import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Warehouse, ThermometerSnowflake, Sun, ShieldCheck, MapPin, Phone, Calendar, Check, X } from 'lucide-react'
import { farmFreshStore } from '../../lib/store'
import toast, { Toaster } from 'react-hot-toast'
import L from 'leaflet'
import { VoiceReadButton } from '../../components/common/VoiceReadButton'
import { useVoice } from '../../contexts/VoiceContext'
import { useLanguage } from '../../contexts/LanguageContext'

// Fix default leaflet marker icon issue
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export const ColdStoragePage = () => {
  const [storages] = useState(() => farmFreshStore.getColdStorages())
  const [selectedStorage, setSelectedStorage] = useState(null)
  const { activeSectionId } = useVoice()
  const { t } = useLanguage()
  const [bookingData, setBookingData] = useState({
    crop: 'Potato',
    quantity_quintals: 50,
    duration_months: 3,
    start_date: new Date().toISOString().split('T')[0],
  })

  const handleBookStorage = (e) => {
    e.preventDefault()
    if (!selectedStorage) return

    const totalCost = Number(bookingData.quantity_quintals) * selectedStorage.rate_per_quintal_per_month * Number(bookingData.duration_months)
    toast.success(`${t('storageBooked')}: ${selectedStorage.name}! ₹${totalCost.toLocaleString()}`)
    setSelectedStorage(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-semibold mb-2">
            <ThermometerSnowflake className="w-3.5 h-3.5" />
            <span>{t('navColdStorage')}</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-gray-900">
            {t('coldStorageTitle')}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t('coldStorageSubtitle')}
          </p>
        </div>

        <VoiceReadButton
          sectionId="cold-storage-overview"
          category="cold_storage"
          data={storages[0]}
          size="md"
        />
      </div>

      {/* Interactive Leaflet Map */}
      <div className="glass-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-farm-600" />
            <span>{t('coldStorageTitle')} ({t('allStates')})</span>
          </h3>
          <span className="text-xs text-gray-400">{t('occupiedSpace')}</span>
        </div>
        <div className="h-72 sm:h-96 w-full rounded-2xl overflow-hidden shadow-inner border border-gray-100">
          <MapContainer center={[22.6916, 75.8634]} zoom={5} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {storages.map((storage) => (
              <Marker key={storage.id} position={[storage.lat, storage.lng]} icon={defaultIcon}>
                <Popup>
                  <div className="p-1 space-y-1 text-xs">
                    <strong className="text-farm-900">{storage.name}</strong>
                    <p>{storage.address}</p>
                    <p className="text-farm-700 font-semibold">{t('capacityAvailableLbl')}: {storage.available_capacity_mt} MT</p>
                    <p className="font-mono">₹{storage.rate_per_quintal_per_month}{t('perQuintal')}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {storages.map((storage) => {
          const occupancyPct = Math.round(((storage.total_capacity_mt - storage.available_capacity_mt) / storage.total_capacity_mt) * 100)
          return (
            <div
              key={storage.id}
              className={`glass-card p-6 rounded-2xl space-y-4 transition-all duration-300 border-cyan-100 flex flex-col justify-between ${
                activeSectionId === `storage-${storage.id}` ? 'ring-4 ring-cyan-500/50 bg-cyan-50/60 shadow-xl border-cyan-300' : 'hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-gray-900 leading-tight">
                      {storage.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{storage.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right whitespace-nowrap">
                      <span className="font-mono font-bold text-lg text-cyan-800">
                        ₹{storage.rate_per_quintal_per_month}
                      </span>
                      <span className="text-[11px] text-gray-500 block">{t('perQuintal')}</span>
                    </div>
                    <VoiceReadButton
                      sectionId={`storage-${storage.id}`}
                      category="cold_storage"
                      data={storage}
                      size="sm"
                      showLabel={false}
                    />
                  </div>
                </div>

                {/* Features Badges */}
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className="glass-badge bg-cyan-50 text-cyan-800 border-cyan-200 flex items-center gap-1">
                    <ThermometerSnowflake className="w-3 h-3" />
                    {storage.temperature_range}
                  </span>
                  {storage.solar_powered && (
                    <span className="glass-badge bg-amber-50 text-amber-800 border-amber-200 flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-500" />
                      {t('powerBackup')}
                    </span>
                  )}
                  {storage.fssai_approved && (
                    <span className="glass-badge bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {t('verified')}
                    </span>
                  )}
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 text-xs pt-1">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>{t('occupiedSpace')} ({occupancyPct}%)</span>
                    <span className="text-farm-700 font-bold">{storage.available_capacity_mt} MT {t('capacityAvailableLbl')}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-cyan-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>

                {/* Suitable crops */}
                <div className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">{t('amenitiesLbl')}: </span>
                  {storage.suitable_crops.join(', ')}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                <a
                  href={`tel:${storage.phone}`}
                  className="btn-outline-farm text-xs py-2 px-3 flex-1 text-center"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t('supportTitle')}</span>
                </a>
                <button
                  onClick={() => setSelectedStorage(storage)}
                  className="btn-farm text-xs py-2 px-4 flex-1 shadow-xs"
                >
                  <Warehouse className="w-3.5 h-3.5" />
                  <span>{t('bookStorage')}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* BOOKING MODAL */}
      {selectedStorage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">{t('bookStorage')}</h3>
              <button onClick={() => setSelectedStorage(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookStorage} className="space-y-3 text-xs">
              <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-200 text-cyan-900">
                <div className="font-bold">{selectedStorage.name}</div>
                <div className="text-[11px] text-cyan-700">{selectedStorage.address}</div>
                <div className="font-mono mt-1 font-semibold">{t('ratePerQtlMonth')}: ₹{selectedStorage.rate_per_quintal_per_month}</div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">{t('cropNameInput')}</label>
                <input
                  type="text"
                  required
                  value={bookingData.crop}
                  onChange={(e) => setBookingData({ ...bookingData, crop: e.target.value })}
                  className="input-farm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{t('quantityInput')} ({t('quintal')})</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={bookingData.quantity_quintals}
                    onChange={(e) => setBookingData({ ...bookingData, quantity_quintals: e.target.value })}
                    className="input-farm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{t('duration_months') || 'Duration'}</label>
                  <select
                    value={bookingData.duration_months}
                    onChange={(e) => setBookingData({ ...bookingData, duration_months: e.target.value })}
                    className="input-farm"
                  >
                    <option value="1">1 Month</option>
                    <option value="2">2 Months</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-gray-600">
                  <span>{t('totalAmountLbl')}:</span>
                  <span className="font-bold text-cyan-900 text-xs">
                    ₹{(Number(bookingData.quantity_quintals) * selectedStorage.rate_per_quintal_per_month * Number(bookingData.duration_months)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStorage(null)}
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
