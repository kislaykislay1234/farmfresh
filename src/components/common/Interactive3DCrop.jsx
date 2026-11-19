import React, { useState, useRef } from 'react'
import { Sparkles, RotateCw, Check } from 'lucide-react'

const PRODUCE_MODELS = [
  {
    name: 'Fresh Tomato',
    emoji: '🍅',
    grade: 'Grade A+ Himsona',
    freshness: '98%',
    color: 'from-red-500 to-rose-700',
    glow: 'rgba(239, 68, 68, 0.4)',
    mandiPrice: '₹26.50/kg',
  },
  {
    name: 'Gir Kesar Mango',
    emoji: '🥭',
    grade: 'GI Protected Premium',
    freshness: '99%',
    color: 'from-amber-400 to-orange-600',
    glow: 'rgba(245, 158, 11, 0.4)',
    mandiPrice: '₹145.00/kg',
  },
  {
    name: 'Nashik Red Onion',
    emoji: '🧅',
    grade: 'Gavran Medium Cured',
    freshness: '95%',
    color: 'from-purple-600 to-pink-800',
    glow: 'rgba(147, 51, 234, 0.4)',
    mandiPrice: '₹29.00/kg',
  },
  {
    name: 'Sharbati Wheat',
    emoji: '🌾',
    grade: 'Sehore Golden Grade-1',
    freshness: '99%',
    color: 'from-yellow-400 to-amber-600',
    glow: 'rgba(234, 179, 8, 0.4)',
    mandiPrice: '₹38.50/kg',
  }
]

export const Interactive3DCrop = () => {
  const [selectedCrop, setSelectedCrop] = useState(PRODUCE_MODELS[0])
  const [rotation, setRotation] = useState({ x: 12, y: -20 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e) => {
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const deltaX = e.clientX - dragStart.current.x
    const deltaY = e.clientY - dragStart.current.y

    setRotation((prev) => ({
      x: Math.max(-60, Math.min(60, prev.x - deltaY * 0.4)),
      y: prev.y + deltaX * 0.4,
    }))

    dragStart.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="glass-card-green p-6 rounded-3xl space-y-4 border-farm-200 shadow-xl relative overflow-hidden select-none">
      {/* 3D Visual Stage Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-farm-900 uppercase tracking-wider">
            Interactive 3D Produce Assayer
          </span>
        </div>
        <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
          <RotateCw className="w-3 h-3 text-farm-600 animate-spin" />
          Drag to Rotate 360°
        </span>
      </div>

      {/* 3D Interactive Canvas Box */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={(e) => {
          setIsDragging(true)
          dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        }}
        onTouchMove={(e) => {
          if (!isDragging) return
          const deltaX = e.touches[0].clientX - dragStart.current.x
          const deltaY = e.touches[0].clientY - dragStart.current.y
          setRotation((prev) => ({
            x: Math.max(-60, Math.min(60, prev.x - deltaY * 0.4)),
            y: prev.y + deltaX * 0.4,
          }))
          dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        }}
        onTouchEnd={() => setIsDragging(false)}
        className="h-64 sm:h-72 w-full rounded-2xl bg-gradient-to-b from-gray-900 via-gray-950 to-black flex items-center justify-center cursor-grab active:cursor-grabbing relative overflow-hidden shadow-inner border border-white/10"
      >
        {/* Glow Ring Behind Crop */}
        <div
          className="absolute w-48 h-48 rounded-full blur-3xl transition-all duration-500 pointer-events-none"
          style={{ background: selectedCrop.glow }}
        />

        {/* Rotatable 3D Produce Sphere */}
        <div
          className="relative transition-transform duration-75 ease-out"
          style={{
            transform: `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Main 3D Produce Icon Orb */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-white/20 via-white/5 to-transparent backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl relative">
            <span className="text-7xl sm:text-8xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] transform hover:scale-110 transition-transform">
              {selectedCrop.emoji}
            </span>

            {/* Orbiting Spec Tag Floating in 3D Space */}
            <div
              className="absolute -top-3 -right-6 px-3 py-1 rounded-full bg-white/90 text-farm-900 font-bold text-[11px] shadow-lg border border-white flex items-center gap-1"
              style={{ transform: 'translateZ(40px)' }}
            >
              <Sparkles className="w-3 h-3 text-harvest-500" />
              <span>{selectedCrop.freshness} Fresh</span>
            </div>

            {/* Orbiting Price Tag */}
            <div
              className="absolute -bottom-3 -left-6 px-3 py-1 rounded-full bg-farm-900 text-white font-mono font-bold text-[11px] shadow-lg border border-farm-700"
              style={{ transform: 'translateZ(30px)' }}
            >
              {selectedCrop.mandiPrice}
            </div>
          </div>
        </div>

        {/* Instructional Hint */}
        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[10px] text-white/60 font-mono pointer-events-none">
          <span>ROTATION: X:{Math.round(rotation.x)}° Y:{Math.round(rotation.y)}°</span>
          <span>[AI SPECTRAL ASSAY]</span>
        </div>
      </div>

      {/* Produce Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        {PRODUCE_MODELS.map((model) => (
          <button
            key={model.name}
            onClick={() => setSelectedCrop(model)}
            className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
              selectedCrop.name === model.name
                ? 'bg-white border-farm-500 font-bold text-farm-900 shadow-sm'
                : 'bg-white/60 border-transparent text-gray-700 hover:bg-white'
            }`}
          >
            <span className="text-lg">{model.emoji}</span>
            <div className="text-left truncate">
              <div className="truncate font-semibold">{model.name}</div>
              <div className="text-[10px] text-gray-400 font-normal">{model.mandiPrice}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
