import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { Truck, Navigation, MapPin, CheckCircle2, Clock, Play, Pause, RefreshCw, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import L from 'leaflet'

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

// Route waypoints: Anand (GJ) to Bhiwandi/Mumbai (MH)
const ROUTE_POINTS = [
  { lat: 22.5645, lng: 72.9289, label: 'Origin: Anand Mandi Yard, GJ' },
  { lat: 22.3072, lng: 73.1812, label: 'Transit Hub 1: Vadodara Bypass' },
  { lat: 21.1702, lng: 72.8311, label: 'Transit Hub 2: Surat Highway Gate' },
  { lat: 20.3893, lng: 72.9106, label: 'Transit Hub 3: Vapi Checkpost' },
  { lat: 19.2812, lng: 73.0489, label: 'Destination: Bhiwandi Mega Cold Hub, MH' }
]

export const TrackingPage = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState(2) // Currently at Surat
  const [isDemoRunning, setIsDemoRunning] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    let timer
    if (isDemoRunning) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => (prev + 1) % ROUTE_POINTS.length)
      }, 2500)
    }
    return () => clearInterval(timer)
  }, [isDemoRunning])

  const currentPos = ROUTE_POINTS[currentStepIdx]

  const timelineSteps = [
    { label: t('tabPendingOrders'), time: '06:30 AM', done: true },
    { label: t('tabInTransitOrders'), time: '08:15 AM', done: true },
    { label: t('navTransport'), time: '09:40 AM', done: true },
    { label: `${t('inTransit')} (NH-48)`, time: 'En Route', done: currentStepIdx >= 2, active: currentStepIdx < 4 },
    { label: t('pickupCityLbl'), time: 'Est. 08:30 PM', done: currentStepIdx === 4 },
    { label: t('tabDeliveredOrders'), time: 'Pending', done: false },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>{t('navTracking')}</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-gray-900">
            {t('navTracking')}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t('orderIdLbl')}: <span className="font-mono font-bold text-gray-900">#FF-2026-8901</span>
          </p>
        </div>

        {/* DEMO TRACKING MODE TOGGLE */}
        <button
          onClick={() => setIsDemoRunning(!isDemoRunning)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
            isDemoRunning
              ? 'bg-amber-500 text-white animate-pulse'
              : 'bg-farm-700 text-white hover:bg-farm-800'
          }`}
        >
          {isDemoRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isDemoRunning ? t('paused') : t('demoMode')}</span>
        </button>
      </div>

      {/* Map & Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Leaflet GPS Map */}
        <div className="lg:col-span-8 space-y-3">
          <div className="glass-card p-4 rounded-3xl space-y-3">
            <div className="flex items-center justify-between px-2 text-xs">
              <span className="font-bold text-gray-800 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-blue-600" />
                {t('liveSpeedLbl')}: 58 km/h • {currentPos.lat.toFixed(4)}°N, {currentPos.lng.toFixed(4)}°E
              </span>
              <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                {t('liveTempLbl')}: +3.2°C ({t('verified')})
              </span>
            </div>

            <div className="h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
              <MapContainer center={[currentPos.lat, currentPos.lng]} zoom={7} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline positions={ROUTE_POINTS.map(p => [p.lat, p.lng])} color="#15803d" weight={4} dashArray="8, 8" />
                <Marker position={[currentPos.lat, currentPos.lng]} icon={markerIcon}>
                  <Popup>
                    <div className="p-1 text-xs">
                      <strong>Reefer Truck (GJ-01-BX-8921)</strong>
                      <p>{currentPos.label}</p>
                      <p className="text-emerald-700 font-bold">{t('driverNameLbl')}: Sukhdev Singh</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="lg:col-span-4">
          <div className="glass-card p-6 rounded-3xl space-y-6">
            <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
              {t('ordersTitle')}
            </h3>

            <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4 text-xs">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 z-10 ${
                    step.done ? 'bg-farm-600' : (step.active ? 'bg-amber-500 animate-bounce ring-4 ring-amber-200' : 'bg-gray-300')
                  }`}>
                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div className="space-y-0.5">
                    <div className={`font-bold ${step.done ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono">{step.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 bg-farm-50/80 p-3 rounded-xl text-xs space-y-1 text-farm-900">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-farm-600" />
                <span>{t('escrowStatus')}</span>
              </div>
              <p className="text-[11px] text-farm-800">
                {t('paymentModalSubtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
