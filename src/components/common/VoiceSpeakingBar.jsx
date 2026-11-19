import React from 'react'
import { Volume2, Pause, Play, Square, X, Sparkles } from 'lucide-react'
import { useVoice } from '../../contexts/VoiceContext'
import { useLanguage } from '../../contexts/LanguageContext'

export const VoiceSpeakingBar = () => {
  const { isSpeaking, isPaused, speakingText, pauseSpeech, resumeSpeech, stopSpeech } = useVoice()
  const { lang, currentLangObj } = useLanguage()

  if (!isSpeaking && !speakingText) return null

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[540px] transition-all duration-300 transform ${
      isSpeaking ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
    }`}>
      <div className="bg-farm-900/95 backdrop-blur-xl border border-farm-700/60 shadow-2xl rounded-2xl p-3.5 text-white flex items-center justify-between gap-3 ring-4 ring-emerald-500/20">
        
        {/* Equalizer & Language Indicator */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-farm-800 border border-farm-600 flex items-center justify-center shrink-0">
            {isPaused ? (
              <Pause className="w-5 h-5 text-amber-400" />
            ) : (
              <div className="flex items-center gap-0.5">
                <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-5 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {currentLangObj.flag} AI Voice • {currentLangObj.native}
              </span>
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-harvest-400" /> Grounded APMC Data
              </span>
            </div>
            <p className="text-xs font-medium text-gray-100 truncate mt-0.5">
              "{speakingText}"
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isPaused ? (
            <button
              onClick={resumeSpeech}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              title="Resume"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              onClick={pauseSpeech}
              className="p-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition-colors"
              title="Pause"
            >
              <Pause className="w-4 h-4 fill-current" />
            </button>
          )}

          <button
            onClick={stopSpeech}
            className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition-colors"
            title="Stop"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        </div>

      </div>
    </div>
  )
}
