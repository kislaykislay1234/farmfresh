import React, { createContext, useContext, useState, useEffect } from 'react'
import { TRANSLATIONS } from '../i18n/index'

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', bcp47: 'en-IN', flag: '🇬🇧', listenBtn: '🔊 Listen' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', bcp47: 'hi-IN', flag: '🇮🇳', listenBtn: '🔊 सुनें' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', bcp47: 'gu-IN', flag: '🇮🇳', listenBtn: '🔊 સાંભળો' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', bcp47: 'mr-IN', flag: '🇮🇳', listenBtn: '🔊 ऐका' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', bcp47: 'bn-IN', flag: '🇮🇳', listenBtn: '🔊 শুনুন' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', bcp47: 'pa-IN', flag: '🇮🇳', listenBtn: '🔊 ਸੁਣੋ' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', bcp47: 'ta-IN', flag: '🇮🇳', listenBtn: '🔊 கேளுங்கள்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', bcp47: 'te-IN', flag: '🇮🇳', listenBtn: '🔊 వినండి' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', bcp47: 'kn-IN', flag: '🇮🇳', listenBtn: '🔊 ಕೇಳಿ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', bcp47: 'ml-IN', flag: '🇮🇳', listenBtn: '🔊 കേൾക്കൂ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', bcp47: 'od-IN', flag: '🇮🇳', listenBtn: '🔊 ଶୁଣନ୍ତୁ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', bcp47: 'as-IN', flag: '🇮🇳', listenBtn: '🔊 শুনক' },
  { code: 'ur', name: 'Urdu', native: 'اردو', bcp47: 'ur-IN', flag: '🇮🇳', listenBtn: '🔊 سنیں' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', bcp47: 'sa-IN', flag: '🇮🇳', listenBtn: '🔊 श्रूयताम्' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', bcp47: 'ne-IN', flag: '🇮🇳', listenBtn: '🔊 सुन्नुहोस्' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी', bcp47: 'kok-IN', flag: '🇮🇳', listenBtn: '🔊 आयकात' },
  { code: 'ks', name: 'Kashmiri', native: 'کٲشُر', bcp47: 'ks-IN', flag: '🇮🇳', listenBtn: '🔊 بوزِو' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली', bcp47: 'mai-IN', flag: '🇮🇳', listenBtn: '🔊 सुनू' },
  { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্', bcp47: 'mni-IN', flag: '🇮🇳', listenBtn: '🔊 তাবিবা' },
  { code: 'brx', name: 'Bodo', native: 'बर’', bcp47: 'brx-IN', flag: '🇮🇳', listenBtn: '🔊 खनासं' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी', bcp47: 'doi-IN', flag: '🇮🇳', listenBtn: '🔊 सुनो' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', bcp47: 'sat-IN', flag: '🇮🇳', listenBtn: '🔊 ᱟᱧᱡᱚᱢ' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي', bcp47: 'sd-IN', flag: '🇮🇳', listenBtn: '🔊 ٻڌو' },
]

export { TRANSLATIONS }

const LanguageContext = createContext(null)

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('farmfresh_lang') || 'hi'
  })

  useEffect(() => {
    localStorage.setItem('farmfresh_lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES.find(l => l.code === 'hi')

  const t = (key, fallback) => {
    if (!key) return ''
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.hi?.[key] || TRANSLATIONS.en?.[key] || fallback || key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, currentLangObj, SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}

export default LanguageProvider
