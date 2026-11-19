import React, { useState } from 'react'
import { Globe, Search, X, Check, Sparkles, Volume2 } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { isTtsSupported } from '../../constants/languages'

export const LanguageSelectorModal = ({ isOpen, onClose }) => {
  const { lang, setLang, SUPPORTED_LANGUAGES, t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMode, setFilterMode] = useState('all') // 'all' | 'voice'

  if (!isOpen) return null

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (l) => {
      const matchesSearch = 
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.native.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.code.toLowerCase().includes(searchTerm.toLowerCase())
      
      if (filterMode === 'voice') {
        return matchesSearch && isTtsSupported(l.bcp47)
      }
      return matchesSearch
    }
  )

  const handleSelect = (code) => {
    setLang(code)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-farm-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-farm-800 flex items-center justify-center text-harvest-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">{t('language', 'Select Language / भाषा चुनें')}</h3>
              <p className="text-xs text-farm-300">Choose from 22 official Indian languages + English</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar and Tabs */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/70 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search language (e.g. Hindi, ગુજરાતી, தமிழ், Marathi, Urdu)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-farm pl-10 text-xs py-2.5 bg-white shadow-xs"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  filterMode === 'all'
                    ? 'bg-farm-700 text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                All Languages (23)
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('voice')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  filterMode === 'voice'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Voice Supported (11)</span>
              </button>
            </div>

            {/* Quick Switch English, Hindi & Gujarati */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-gray-400">Quick:</span>
              <button
                type="button"
                onClick={() => handleSelect('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition ${
                  lang === 'en'
                    ? 'bg-farm-600 text-white border-farm-700 ring-2 ring-farm-400/40 shadow-xs'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect('hi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition ${
                  lang === 'hi'
                    ? 'bg-farm-600 text-white border-farm-700 ring-2 ring-farm-400/40 shadow-xs'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                <span>🇮🇳</span>
                <span>हिन्दी</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect('gu')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition ${
                  lang === 'gu'
                    ? 'bg-farm-600 text-white border-farm-700 ring-2 ring-farm-400/40 shadow-xs'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                <span>🇮🇳</span>
                <span>ગુજરાતી</span>
              </button>
            </div>
          </div>
        </div>

        {/* Languages Grid */}
        <div className="p-4 overflow-y-auto max-h-[58vh] flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {filteredLanguages.map((item) => {
              const isSelected = item.code === lang
              const hasTts = isTtsSupported(item.bcp47)
              return (
                <button
                  key={item.code}
                  onClick={() => handleSelect(item.code)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 group ${
                    isSelected
                      ? 'bg-farm-50 border-farm-500 font-bold text-farm-950 ring-2 ring-farm-500/20 shadow-xs'
                      : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-farm-300'
                  }`}
                >
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.flag}</span>
                      <span className="font-bold text-sm text-gray-900 group-hover:text-farm-700">
                        {item.native}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-gray-500 truncate">
                        {item.name}
                      </span>
                      {hasTts && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200" title="Sarvam Bulbul v3 TTS Voice Supported">
                          🔊 Voice
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="w-6 h-6 rounded-full bg-farm-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-mono shrink-0 uppercase">
                      {item.code}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-harvest-600" />
            <span>Powered by Sarvam AI Multilingual Engine</span>
          </span>
          <button
            onClick={onClose}
            className="btn-outline-farm text-xs py-1.5 px-4 font-bold"
          >
            {t('close', 'Close')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LanguageSelectorModal
