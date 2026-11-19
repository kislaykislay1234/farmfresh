import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Bot, User, X, Sparkles, Mic, MicOff, Volume2, Loader2 } from 'lucide-react'
import { farmFreshStore } from '../../lib/store'
import { useVoice } from '../../contexts/VoiceContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { VoiceReadButton } from './VoiceReadButton'
import { askMultilingualChatbot, playBase64Audio } from '../../services/sarvamService'

export const AIChatbox = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { currentLangObj, t, lang } = useLanguage()
  const { isListening, startListening, stopListening, speakSection } = useVoice()
  const [isBotThinking, setIsBotThinking] = useState(false)

  const [messages, setMessages] = useState(() => [
    {
      id: 'msg-init',
      sender: 'bot',
      text: t('aiChatGreeting', 'नमस्ते! मैं आपका फार्मफ्रेश एआई सहायक हूँ। आप मुझसे मंडी भाव, फसल ताज़गी, पीएम किसान योजनाओं या वाहन बुकिंग के बारे में पूछ सकते हैं।'),
      time: 'Just now',
    }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  // Update initial message if language changes and chat is at start
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'msg-init') {
        return [{ id: 'msg-init', sender: 'bot', text: t('aiChatGreeting', 'Welcome! I am your FarmFresh AI assistant. Ask me about Mandi rates, crop freshness, PM-KISAN schemes, or transport.'), time: 'Just now' }]
      }
      return prev
    })
  }, [lang])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isOpen, isBotThinking])

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening(async ({ query }) => {
        if (!query) return
        handleSend(query)
      })
    }
  }

  const handleSend = async (userQuery) => {
    const query = userQuery || input
    if (!query.trim()) return

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const newMsg = { id: `u-${Date.now()}`, sender: 'user', text: query, time: timeNow }
    setMessages((prev) => [...prev, newMsg])
    if (!userQuery) setInput('')
    setIsBotThinking(true)

    try {
      const userLangBcp47 = currentLangObj?.bcp47 || 'hi-IN'
      const response = await askMultilingualChatbot(query, userLangBcp47)
      
      const botMsg = { 
        id: `b-${Date.now()}`, 
        sender: 'bot', 
        text: response.text, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        audio_base64: response.audio_base64,
        category: 'generic' 
      }
      
      setMessages((prev) => [...prev, botMsg])
      setIsBotThinking(false)

      // Play audio automatically via Sarvam TTS if available, else use voice provider
      if (response.audio_base64) {
        try {
          await playBase64Audio(response.audio_base64)
        } catch (audioErr) {
          console.warn('Audio playback notice:', audioErr)
        }
      } else {
        speakSection(`chat-${botMsg.id}`, response.text, 'generic')
      }
    } catch (err) {
      console.error('Chat error:', err)
      const fallbackReply = t('aiChatGreeting') || 'Understood. Please ask about Mandi rates, crop freshness, or transport.'
      const botMsg = { id: `b-${Date.now()}`, sender: 'bot', text: fallbackReply, time: timeNow, category: 'generic' }
      setMessages((prev) => [...prev, botMsg])
      setIsBotThinking(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Trigger Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-farm rounded-full p-4 shadow-2xl flex items-center gap-2 hover:scale-105 transition-all ring-4 ring-farm-500/20"
        >
          <Bot className="w-6 h-6 animate-pulse text-harvest-400" />
          <span className="font-bold text-xs pr-1 hidden sm:inline">{t('voiceAssistant')}</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-80 sm:w-96 h-[520px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-farm-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-farm-700 flex items-center justify-center text-harvest-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">{t('aiChatTitle')}</h4>
                <span className="text-[10px] text-farm-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {currentLangObj?.native || 'Multilingual'}
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fafcf9] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-farm-100 flex items-center justify-center text-farm-700 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-line leading-relaxed relative group ${
                    m.sender === 'user'
                      ? 'bg-farm-700 text-white rounded-tr-none font-medium'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-xs'
                  }`}
                >
                  <div>{m.text}</div>
                  
                  {/* Inline Audio Read Button for Bot Replies */}
                  {m.sender === 'bot' && (
                    <div className="mt-2 pt-1.5 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[9px] text-gray-400">{m.time}</span>
                      <VoiceReadButton
                        sectionId={`chat-${m.id}`}
                        data={m.data || m.text}
                        category={m.category || 'generic'}
                        size="sm"
                      />
                    </div>
                  )}
                  {m.sender === 'user' && (
                    <span className="block text-[9px] opacity-60 mt-1 text-right">{m.time}</span>
                  )}
                </div>
              </div>
            ))}

            {isBotThinking && (
              <div className="flex gap-2 justify-start items-center animate-in fade-in">
                <div className="w-6 h-6 rounded-full bg-farm-100 flex items-center justify-center text-farm-700 shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-500 rounded-tl-none shadow-xs flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-farm-600" />
                  <span className="text-[11px] font-medium">{t('speaking', 'AI translating & preparing audio...')}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Voice Suggestions Chips */}
          <div className="p-2 bg-gray-50 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {[
              t('quickAsk1'),
              t('quickAsk2'),
              t('quickAsk3'),
              t('quickAsk4'),
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-farm-50 shrink-0 font-medium text-[11px]"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input & Voice Command Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleMicClick}
              title={t('voiceClickPrompt')}
              className={`p-2.5 rounded-xl transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-300'
                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-800" />}
            </button>

            <input
              type="text"
              placeholder={isListening ? t('voiceListening') : t('aiChatPlaceholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-farm py-2 text-xs flex-1"
            />
            <button type="submit" className="btn-farm p-2 rounded-xl">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
