import React, { useState, useEffect } from 'react'
import { Sparkles, ShieldCheck, ThermometerSnowflake, Truck, ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=1200&auto=format&fit=crop&q=80',
    title: 'Fresh Tomato Harvest — Anand, Gujarat',
    badge: '98% AI Freshness Verified',
    icon: Sparkles,
    stats: '₹26.50/kg • 2,400 kg Available',
  },
  {
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
    title: 'Solar Cold Chain — Nadiad Mega Facility',
    badge: 'Controlled Atmosphere (0-4°C)',
    icon: ThermometerSnowflake,
    stats: '1,850 MT Capacity Open • ₹110/Qtl/mo',
  },
  {
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&auto=format&fit=crop&q=80',
    title: 'Refrigerated Reefer Fleet — NH-48 Corridor',
    badge: 'Zero Spoilage Transit',
    icon: Truck,
    stats: '10T Chilled Carrier • Gujarat to Mumbai',
  },
  {
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=1200&auto=format&fit=crop&q=80',
    title: 'GI-Tagged Nashik Red Onions',
    badge: 'Direct Farmer Procurement',
    icon: ShieldCheck,
    stats: 'Escrow Secured • 8,500 kg Listed',
  }
]

export const KenBurnsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [isPaused])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length)
  }

  const current = SLIDES[currentIndex]
  const Icon = current.icon

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 group"
    >
      {/* Slides with crossfade and Ken Burns zoom */}
      {SLIDES.map((slide, idx) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover transform ${
              idx === currentIndex ? 'scale-105 transition-transform duration-7000 ease-out' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
        </div>
      ))}

      {/* Manual Left / Right Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-white hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-200"
        title="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-white hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-200"
        title="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Floating Info Overlay at bottom */}
      <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold">
            <Icon className="w-3.5 h-3.5 text-harvest-400" />
            <span>{current.badge}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md">
            {current.title}
          </h3>
          <p className="text-xs sm:text-sm text-farm-100 font-medium">
            {current.stats}
          </p>
        </div>

        {/* Carousel Slide Dot Indicators */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-8 bg-harvest-400' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              title={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
