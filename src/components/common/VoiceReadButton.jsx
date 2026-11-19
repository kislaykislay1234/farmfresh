import React from 'react'
import { Volume2, VolumeX, Pause, Play, Square } from 'lucide-react'
import { useVoice } from '../../contexts/VoiceContext'
import { useLanguage } from '../../contexts/LanguageContext'

export const VoiceReadButton = ({
  sectionId,
  data,
  category = 'generic',
  customText,
  size = 'md',
  className = '',
  showLabel = true,
}) => {
  const { isSpeaking, isPaused, activeSectionId, speakSection, pauseSpeech, resumeSpeech, stopSpeech } = useVoice()
  const { currentLangObj, t } = useLanguage()

  const isActive = activeSectionId === sectionId && isSpeaking

  const handleClick = (e) => {
    e.stopPropagation()
    if (isActive) {
      if (isPaused) {
        resumeSpeech()
      } else {
        pauseSpeech()
      }
    } else {
      speakSection(sectionId, customText || data, category)
    }
  }

  const handleStop = (e) => {
    e.stopPropagation()
    stopSpeech()
  }

  const buttonSizeClasses = {
    sm: 'py-1 px-2.5 text-[11px] rounded-lg gap-1.5',
    md: 'py-1.5 px-3 text.xs rounded-xl gap-2',
    lg: 'py-2 px-4 text-xs sm:text-sm rounded-2xl gap-2',
  }[size]

  return (
    <div className={`inline-flex items-center gap-1 shrink-0 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        title={isActive ? (isPaused ? 'Resume AI Voice' : 'Pause AI Voice') : `Read aloud in ${currentLangObj.native}`}
        className={`btn-farm transition-all duration-200 shadow-xs flex items-center font-bold border ${buttonSizeClasses} ${
          isActive
            ? isPaused
              ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300'
              : 'bg-emerald-600 text-white border-emerald-700 ring-4 ring-emerald-400/30 animate-pulse'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 hover:scale-102'
        }`}
      >
        {isActive ? (
          isPaused ? (
            <Play className="w-3.5 h-3.5 fill-current" />
          ) : (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-3 bg-white rounded-full animate-bounce" />
            </div>
          )
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        )}

        {showLabel && (
          <span>
            {isActive
              ? isPaused
                ? t('paused') || 'Paused'
                : t('speaking') || 'Reading...'
              : currentLangObj.listenBtn || '🔊 सुनें'}
          </span>
        )}
      </button>

      {isActive && (
        <button
          type="button"
          onClick={handleStop}
          title="Stop reading"
          className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
        >
          <Square className="w-3 h-3 fill-current" />
        </button>
      )}
    </div>
  )
}
