import React, { useState } from 'react'
import { Gavel, Clock, MapPin, Sparkles, TrendingUp, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { farmFreshStore } from '../../lib/store'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import toast, { Toaster } from 'react-hot-toast'

export const AuctionsPage = () => {
  const { profile } = useAuth()
  const { t } = useLanguage()
  const [auctions, setAuctions] = useState(() => farmFreshStore.getAuctions())
  const [bidAmounts, setBidAmounts] = useState({})

  const handleBidSubmit = (auction) => {
    const inputAmount = Number(bidAmounts[auction.id])
    const currentHigh = Number(auction.current_highest_bid)

    if (!inputAmount || inputAmount <= currentHigh) {
      toast.error(`Bid must be higher than current highest bid of ₹${currentHigh}`)
      return
    }

    const bidderName = profile?.full_name || 'You (Verified Buyer)'
    const updated = farmFreshStore.placeBid(auction.id, inputAmount, bidderName)
    setAuctions(updated)
    setBidAmounts({ ...bidAmounts, [auction.id]: '' })
    toast.success(`${t('placeBid')}: ₹${inputAmount}/kg (${auction.crop_name})`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-harvest-100 text-harvest-800 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-harvest-600 animate-ping" />
            <span>e-NAM • {t('liveBiddingTab')}</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-gray-900">
            {t('auctionsTitle')}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t('auctionsSubtitle')}
          </p>
        </div>
      </div>

      {/* Auction Lots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => {
          const currentBidInput = bidAmounts[auction.id] || ''
          return (
            <div
              key={auction.id}
              className="glass-card overflow-hidden rounded-2xl flex flex-col justify-between border-harvest-200/60 shadow-sm hover:shadow-lg transition-all"
            >
              {/* Image & Expiry */}
              <div className="relative h-48 w-full bg-gray-100">
                <img
                  src={auction.image_url}
                  alt={auction.crop_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>{t('liveBiddingTab')}</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-harvest-400" />
                  <span>{t('navFreshness')}: {auction.freshness_score}%</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-gray-900 leading-snug">
                    {auction.crop_name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{auction.farmer_name} • {auction.location}</span>
                  </div>
                </div>

                {/* Auction Metrics */}
                <div className="bg-harvest-50/60 border border-harvest-100 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>{t('quantity')}:</span>
                    <span className="font-bold text-gray-900">{auction.total_quantity_kg.toLocaleString()} {t('kg')}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>{t('startingBidPrice')}:</span>
                    <span className="font-mono">₹{auction.starting_price_per_kg}{t('perKg')}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-harvest-200/60 pt-2">
                    <span className="font-semibold text-harvest-950">{t('currentHighBid')}:</span>
                    <span className="font-mono font-bold text-lg text-harvest-700">
                      ₹{auction.current_highest_bid}{t('perKg')}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {t('buyerNameLbl')}: <span className="font-medium text-gray-800">{auction.highest_bidder}</span> ({auction.total_bids} bids)
                  </div>
                </div>

                {/* Place Bid Input & Action */}
                <div className="space-y-2 pt-1">
                  <label className="block text-[11px] font-semibold text-gray-600">
                    {t('yourBidInput')}:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.5"
                      placeholder={`₹${(auction.current_highest_bid + 1).toFixed(1)}`}
                      value={currentBidInput}
                      onChange={(e) =>
                        setBidAmounts({ ...bidAmounts, [auction.id]: e.target.value })
                      }
                      className="input-farm py-2 font-mono text-sm"
                    />
                    <button
                      onClick={() => handleBidSubmit(auction)}
                      className="btn-harvest text-xs px-4 py-2 whitespace-nowrap shadow-xs"
                    >
                      <Gavel className="w-3.5 h-3.5" />
                      <span>{t('placeBid')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
