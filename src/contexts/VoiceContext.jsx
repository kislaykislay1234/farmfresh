import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useLanguage, SUPPORTED_LANGUAGES } from './LanguageContext'
import { generateFarmerExplanation } from '../services/voiceExplainEngine'
import { convertTextToSpeech, playBase64Audio, stopActiveAudio } from '../services/sarvamService'
import { farmFreshStore } from '../lib/store'

const VoiceContext = createContext(null)

export const VoiceProvider = ({ children }) => {
  const { lang, currentLangObj } = useLanguage()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState(null)
  const [speakingText, setSpeakingText] = useState('')
  const [speakingCategory, setSpeakingCategory] = useState('')
  const [availableVoices, setAvailableVoices] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [recognizedQuery, setRecognizedQuery] = useState('')
  const [voiceSupported, setVoiceSupported] = useState(true)

  const utteranceRef = useRef(null)
  const recognitionRef = useRef(null)

  // Load browser voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        setAvailableVoices(voices)
      }
      updateVoices()
      window.speechSynthesis.onvoiceschanged = updateVoices
    } else {
      setVoiceSupported(false)
    }
  }, [])

  // Find best matching TTS voice for given language code
  const getVoiceForLanguage = (targetLangCode) => {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === targetLangCode) || currentLangObj
    const targetTag = langObj.bcp47.toLowerCase()

    if (!availableVoices || availableVoices.length === 0) return null

    // Exact match (e.g. hi-IN)
    let match = availableVoices.find(v => v.lang.toLowerCase() === targetTag)
    if (match) return match

    // Prefix match (e.g. hi)
    match = availableVoices.find(v => v.lang.toLowerCase().startsWith(targetLangCode.toLowerCase()))
    if (match) return match

    // Fallback: Hindi voice for Indian regional, or English
    match = availableVoices.find(v => v.lang.toLowerCase().includes('hi')) ||
            availableVoices.find(v => v.lang.toLowerCase().includes('en'))

    return match || availableVoices[0]
  }

  // Speak Text / Section Explanation
  const speakSection = async (sectionId, rawTextOrData, category = 'generic') => {
    // Stop any existing speech / audio
    stopActiveAudio()
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    // Generate farmer-friendly explanation text
    const explanation = generateFarmerExplanation(category, rawTextOrData, lang)
    setIsSpeaking(true)
    setIsPaused(false)
    setActiveSectionId(sectionId)
    setSpeakingText(explanation)
    setSpeakingCategory(category)

    // 1. Primary: Try High-Fidelity Sarvam AI Text-to-Speech (native across 22 Indian languages)
    try {
      const targetBcp47 = currentLangObj?.bcp47 || 'hi-IN'
      const ttsResult = await convertTextToSpeech(explanation, targetBcp47)
      if (ttsResult?.audio_base64) {
        await playBase64Audio(ttsResult.audio_base64)
        setIsSpeaking(false)
        setActiveSectionId(null)
        return
      }
    } catch (sarvamErr) {
      console.warn('Sarvam TTS unavailable, falling back to browser SpeechSynthesis:', sarvamErr)
    }

    // 2. Fallback: Browser Web Speech API
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(explanation)
      utteranceRef.current = utterance

      const matchedVoice = getVoiceForLanguage(lang)
      if (matchedVoice) {
        utterance.voice = matchedVoice
        utterance.lang = matchedVoice.lang
      } else {
        utterance.lang = currentLangObj?.bcp47 || 'hi-IN'
      }

      utterance.rate = 0.9
      utterance.pitch = 1.0

      utterance.onend = () => {
        setIsSpeaking(false)
        setIsPaused(false)
        setActiveSectionId(null)
      }

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e)
        setIsSpeaking(false)
        setIsPaused(false)
        setActiveSectionId(null)
      }

      window.speechSynthesis.speak(utterance)
    } else {
      setIsSpeaking(false)
      setActiveSectionId(null)
    }
  }

  const pauseSpeech = () => {
    stopActiveAudio()
    if (window.speechSynthesis && isSpeaking && !isPaused) {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }

  const resumeSpeech = () => {
    if (window.speechSynthesis && isSpeaking && isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    }
  }

  const stopSpeech = () => {
    stopActiveAudio()
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
    setIsPaused(false)
    setActiveSectionId(null)
  }

  // Voice Command Speech-to-Text Recognition
  const startListening = (onRecognizedCallback) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported on your browser. Please try Google Chrome.')
      return
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.lang = currentLangObj.bcp47 || 'hi-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setRecognizedQuery('')
    }

    recognition.onresult = (event) => {
      const query = event.results[0][0].transcript
      setRecognizedQuery(query)
      setIsListening(false)

      // Match farmer voice intent against real Supabase / store data
      processVoiceQuery(query, onRecognizedCallback)
    }

    recognition.onerror = (event) => {
      console.warn('SpeechRecognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
      setIsListening(false)
    }
  }

  // Grounded intent processor for voice queries
  const processVoiceQuery = (query, callback) => {
    const lower = query.toLowerCase()
    let replyText = ''
    let category = 'generic'
    let dataPayload = null

    // Intent 1: Mandi Bhav / Market rates
    if (lower.includes('मंडी') || lower.includes('भाव') || lower.includes('रेट') || lower.includes('mandi') || lower.includes('price') || lower.includes('rate') || lower.includes('tomato')) {
      category = 'mandi'
      const prices = farmFreshStore.getMandiPrices()
      const tomato = prices.find(p => p.crop.toLowerCase().includes('tomato')) || prices[0]
      dataPayload = tomato
      replyText = generateFarmerExplanation('mandi', tomato, lang)
    } 
    // Intent 2: Harvest / Freshness
    else if (lower.includes('फसल') || lower.includes('ताज़गी') || lower.includes('freshness') || lower.includes('quality') || lower.includes('crop')) {
      category = 'freshness'
      const freshData = {
        crop_type: 'Himsona Tomato',
        freshness_score: 92,
        grade: 'A+',
        estimated_shelf_life_days: 12
      }
      dataPayload = freshData
      replyText = generateFarmerExplanation('freshness', freshData, lang)
    }
    // Intent 3: Orders / Delivery
    else if (lower.includes('ऑर्डर') || lower.includes('order') || lower.includes('डिलीवरी') || lower.includes('status')) {
      category = 'order'
      const orders = farmFreshStore.getOrders()
      const latestOrder = orders[0] || { order_number: 'FF-2026-8901', crop_name: 'Grade A+ Tomatoes', order_status: 'confirmed', quantity_kg: 1500 }
      dataPayload = latestOrder
      replyText = generateFarmerExplanation('order', latestOrder, lang)
    }
    // Intent 4: Earnings / Profit
    else if (lower.includes('कमाई') || lower.includes('मुनाफा') || lower.includes('earning') || lower.includes('revenue')) {
      category = 'earnings'
      const earningsData = { revenue: '11,45,000', yield_qtl: 482 }
      dataPayload = earningsData
      replyText = generateFarmerExplanation('earnings', earningsData, lang)
    }
    // Intent 5: Cold Storage / Reefer
    else if (lower.includes('कोल्ड') || lower.includes('स्टोरेज') || lower.includes('storage')) {
      category = 'cold_storage'
      const storages = farmFreshStore.getColdStorages()
      dataPayload = storages[0]
      replyText = generateFarmerExplanation('cold_storage', storages[0], lang)
    }
    // Generic Default Fallback
    else {
      replyText = lang === 'hi' 
        ? `आपकी बात समझ आ गई है: "${query}"। आप मंडी भाव, फसल ताज़गी, या ऑर्डर स्टेटस की जानकारी पूछ सकते हैं।`
        : `Understood: "${query}". You can ask about Mandi rates, crop freshness, or order status.`
    }

    // Speak reply aloud
    speakSection('voice-assistant-reply', replyText, category)

    if (callback) {
      callback({
        query,
        reply: replyText,
        category,
        data: dataPayload
      })
    }
  }

  return (
    <VoiceContext.Provider
      value={{
        isSpeaking,
        isPaused,
        activeSectionId,
        speakingText,
        speakingCategory,
        isListening,
        recognizedQuery,
        voiceSupported,
        speakSection,
        pauseSpeech,
        resumeSpeech,
        stopSpeech,
        startListening,
        stopListening,
        processVoiceQuery,
      }}
    >
      {children}
    </VoiceContext.Provider>
  )
}

export const useVoice = () => {
  const context = useContext(VoiceContext)
  if (!context) throw new Error('useVoice must be used within VoiceProvider')
  return context
}

export default VoiceProvider
