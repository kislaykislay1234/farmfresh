import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

export const useVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState('')
  const [supported, setSupported] = useState(false)
  const { lang } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSupported(true)
    }
  }, [])

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      if (lang === 'hi') utterance.lang = 'hi-IN'
      else if (lang === 'gu') utterance.lang = 'gu-IN'
      else utterance.lang = 'en-IN'
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleCommand = useCallback((spokenText) => {
    const text = spokenText.toLowerCase()
    
    // Command routing
    if (text.includes('market') || text.includes('बाजार') || text.includes('बજાર') || text.includes('crop') || text.includes('टमाटर') || text.includes('tomato')) {
      setFeedback('Opening Marketplace...')
      speak(lang === 'hi' ? 'बाज़ार खोला जा रहा है' : 'Opening Marketplace')
      navigate('/marketplace')
    } else if (text.includes('auction') || text.includes('नीलामी') || text.includes('હરાજી') || text.includes('bid')) {
      setFeedback('Opening Live Auctions...')
      speak(lang === 'hi' ? 'लाइव नीलामी खोली जा रही है' : 'Opening Live Auctions')
      navigate('/auctions')
    } else if (text.includes('rate') || text.includes('mandi') || text.includes('भाव') || text.includes('मंडी')) {
      setFeedback('Opening Mandi Rates...')
      speak(lang === 'hi' ? 'मंडी भाव दिखाए जा रहे हैं' : 'Showing Mandi Rates')
      navigate('/mandi-rates')
    } else if (text.includes('cold') || text.includes('storage') || text.includes('कोल्ड') || text.includes('સ્ટોરેજ')) {
      setFeedback('Opening Cold Storage Network...')
      speak(lang === 'hi' ? 'कोल्ड स्टोरेज खोला जा रहा है' : 'Opening Cold Storage')
      navigate('/cold-storage')
    } else if (text.includes('transport') || text.includes('गाड़ी') || text.includes('ટ્રાન્સપોર્ટ') || text.includes('truck')) {
      setFeedback('Opening Transport Logistics...')
      speak(lang === 'hi' ? 'परिवहन गाड़ियां दिखाई जा रही हैं' : 'Opening Logistics')
      navigate('/transport')
    } else if (text.includes('scheme') || text.includes('योजना') || text.includes('યોજના') || text.includes('subsidy')) {
      setFeedback('Opening Government Schemes...')
      speak(lang === 'hi' ? 'सरकारी योजनाएं खोली जा रही हैं' : 'Opening Govt Schemes')
      navigate('/schemes')
    } else if (text.includes('order') || text.includes('ऑर्डर') || text.includes('ઓર્ડર')) {
      setFeedback('Opening Orders...')
      speak(lang === 'hi' ? 'ऑर्डर खोले जा रहे हैं' : 'Opening Orders')
      navigate('/orders')
    } else if (text.includes('scan') || text.includes('freshness') || text.includes('स्कैन') || text.includes('ताज़गी')) {
      setFeedback('Opening AI Freshness Scanner...')
      speak(lang === 'hi' ? 'एआई स्कैनर चालू हो रहा है' : 'Starting AI Scanner')
      navigate('/freshness-scanner')
    } else if (text.includes('dashboard') || text.includes('होम') || text.includes('ડેશબોર્ડ')) {
      setFeedback('Opening Dashboard...')
      navigate('/dashboard')
    } else {
      setFeedback(`Recognized: "${spokenText}". Try "Mandi rates" or "Marketplace"`)
    }
  }, [navigate, lang])

  const startListening = () => {
    if (!supported) {
      alert('Speech Recognition is not supported in this browser. Try Chrome or Edge.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    if (lang === 'hi') recognition.lang = 'hi-IN'
    else if (lang === 'gu') recognition.lang = 'gu-IN'
    else recognition.lang = 'en-IN'

    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
      setFeedback('Listening...')
    }

    recognition.onresult = (event) => {
      const current = event.resultIndex
      const spoken = event.results[current][0].transcript
      setTranscript(spoken)
      handleCommand(spoken)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error)
      setIsListening(false)
      setFeedback('Microphone permission needed or timed out.')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    try {
      recognition.start()
    } catch (e) {
      console.error(e)
      setIsListening(false)
    }
  }

  return {
    isListening,
    transcript,
    feedback,
    supported,
    startListening,
    speak,
  }
}
