// src/components/common/VoiceAgentButton.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Volume2, Loader2, Sparkles, X } from 'lucide-react'
import { runVoiceTurn, playBase64Audio, stopActiveAudio } from '../../services/sarvamService'
import { useLanguage } from '../../contexts/LanguageContext'

export function VoiceAgentButton({ 
  farmerId = 'f101', 
  languageCode = 'hi', 
  className = '',
  buttonLabel = null,
  compact = false 
}) {
  const { currentLanguage } = useLanguage()
  const activeLang = languageCode || currentLanguage || 'hi'

  const [listening, setListening] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [farmerSaid, setFarmerSaid] = useState('')
  const [replyText, setReplyText] = useState('')
  const [countdown, setCountdown] = useState(6)
  
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const countdownIntervalRef = useRef(null)

  useEffect(() => {
    return () => {
      stopActiveAudio()
      if (timerRef.current) clearTimeout(timerRef.current)
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    }
  }, [])

  async function startListening() {
    stopActiveAudio()
    setPlaying(false)
    setFarmerSaid('')
    setReplyText('')
    setCountdown(6)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = handleStop
      recorder.start()
      setListening(true)

      // Start visual countdown timer
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 1))
      }, 1000)

      // Auto-stop after 6 seconds max
      timerRef.current = setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop()
          stream.getTracks().forEach((track) => track.stop())
        }
      }, 6000)
    } catch (err) {
      console.warn('Microphone access fallback to query prompt:', err)
      // If mic is denied or unavailable, simulate prompt turn
      processTurn('What is the demand for button mushrooms today?')
    }
  }

  function stopManualRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
      mediaRecorderRef.current.stop()
    }
  }

  async function handleStop() {
    setListening(false)
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
    await processTurn(audioBlob)
  }

  const [ttsAvailable, setTtsAvailable] = useState(true)
  const [note, setNote] = useState('')

  async function processTurn(audioOrText) {
    setProcessing(true)
    setNote('')
    try {
      const data = await runVoiceTurn(audioOrText, farmerId, activeLang)
      setFarmerSaid(data.farmer_said || '')
      setReplyText(data.reply_text || '')
      setTtsAvailable(Boolean(data.tts_available))

      if (data.tts_available && data.reply_audio_base64) {
        setPlaying(true)
        playBase64Audio(data.reply_audio_base64)
          .then(() => setPlaying(false))
          .catch(() => setPlaying(false))
      } else if (!data.tts_available) {
        setNote("Spoken reply isn't available in this language yet — showing text instead.")
      }
    } catch (err) {
      console.error('Voice turn failed:', err)
      setReplyText('Could not process voice turn. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative group">
        {/* Glowing ring while listening */}
        {listening && (
          <div className="absolute -inset-2 bg-red-500 rounded-full blur-md opacity-75 animate-pulse" />
        )}
        {playing && (
          <div className="absolute -inset-2 bg-emerald-500 rounded-full blur-md opacity-75 animate-pulse" />
        )}

        <button
          type="button"
          onClick={listening ? stopManualRecording : startListening}
          disabled={processing}
          className={`relative z-10 flex items-center justify-center transition-all duration-300 shadow-lg ${
            compact ? 'w-10 h-10 rounded-xl' : 'w-14 h-14 rounded-2xl'
          } ${
            listening
              ? 'bg-red-500 text-white animate-bounce'
              : playing
              ? 'bg-emerald-600 text-white'
              : processing
              ? 'bg-gray-400 text-white cursor-wait'
              : 'bg-gradient-to-r from-emerald-600 to-farm-700 text-white hover:scale-105 hover:shadow-emerald-500/30'
          }`}
          title={listening ? 'Listening... click to stop' : 'Tap to speak with FarmFresh AI Voice Agent'}
        >
          {processing ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : listening ? (
            <div className="flex flex-col items-center">
              <MicOff className="w-6 h-6" />
              <span className="text-[9px] font-bold mt-0.5">{countdown}s</span>
            </div>
          ) : playing ? (
            <Volume2 className="w-6 h-6 animate-pulse" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>
      </div>

      {buttonLabel && !replyText && (
        <span className="text-xs font-semibold text-gray-700 text-center">
          {buttonLabel}
        </span>
      )}

      {/* Voice turn response popup / drawer */}
      {(listening || processing || replyText) && (
        <div className="mt-2 p-3 bg-white/95 backdrop-blur-md border border-emerald-200 rounded-2xl shadow-xl max-w-sm w-full animate-fadeIn text-left text-xs space-y-2 relative">
          <button
            onClick={() => {
              setReplyText('')
              setFarmerSaid('')
              setNote('')
              stopActiveAudio()
            }}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {listening && (
            <div className="flex items-center gap-2 text-red-600 font-semibold animate-pulse">
              <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
              <span>Listening in {activeLang.toUpperCase()}... ({countdown}s left)</span>
            </div>
          )}

          {processing && (
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sarvam AI is analyzing voice query & executing FarmFresh tools...</span>
            </div>
          )}

          {farmerSaid && !listening && (
            <div className="bg-gray-50 p-2 rounded-xl border border-gray-200">
              <p className="text-[10px] uppercase font-bold text-gray-600">You Asked:</p>
              <p className="text-gray-800 font-medium italic">"{farmerSaid}"</p>
            </div>
          )}

          {replyText && (
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> FarmFresh Voice AI ({activeLang.toUpperCase()})
                </span>
                {playing ? (
                  <span className="text-[10px] text-emerald-700 font-semibold animate-pulse">
                    Speaking 🔊
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-500">
                    {ttsAvailable ? 'Voice Available' : 'Text Output'}
                  </span>
                )}
              </div>
              <p className="text-gray-900 font-medium leading-relaxed">{replyText}</p>
              
              {note && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                  ℹ️ {note}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
