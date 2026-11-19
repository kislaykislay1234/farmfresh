// src/constants/languages.js
// Centralized Language Constants for Sarvam AI STT, Translation, and TTS Services

// 1. ALL_LANGUAGES: Supported across UI Translation & Sarvam STT / Text-Translate (23 Languages)
export const ALL_LANGUAGES = [
  { code: 'en', bcp47: 'en-IN', name: 'English', native: 'English', flag: '🇬🇧', listenBtn: '🔊 Listen' },
  { code: 'hi', bcp47: 'hi-IN', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', listenBtn: '🔊 सुनें' },
  { code: 'gu', bcp47: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳', listenBtn: '🔊 સાંભળો' },
  { code: 'mr', bcp47: 'mr-IN', name: 'Marathi', native: 'मराठी', flag: '🇮🇳', listenBtn: '🔊 ऐका' },
  { code: 'bn', bcp47: 'bn-IN', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳', listenBtn: '🔊 শুনুন' },
  { code: 'pa', bcp47: 'pa-IN', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳', listenBtn: '🔊 ਸੁਣੋ' },
  { code: 'ta', bcp47: 'ta-IN', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', listenBtn: '🔊 கேளுங்கள்' },
  { code: 'te', bcp47: 'te-IN', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', listenBtn: '🔊 వినండి' },
  { code: 'kn', bcp47: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', listenBtn: '🔊 ಕೇಳಿ' },
  { code: 'ml', bcp47: 'ml-IN', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', listenBtn: '🔊 കേൾക്കൂ' },
  { code: 'or', bcp47: 'od-IN', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳', listenBtn: '🔊 ଶୁଣନ୍ତୁ' },
  { code: 'as', bcp47: 'as-IN', name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳', listenBtn: '🔊 শুনক' },
  { code: 'ur', bcp47: 'ur-IN', name: 'Urdu', native: 'اردو', flag: '🇮🇳', listenBtn: '🔊 سنیں' },
  { code: 'sa', bcp47: 'sa-IN', name: 'Sanskrit', native: 'संस्कृतम्', flag: '🇮🇳', listenBtn: '🔊 श्रूयताम्' },
  { code: 'ne', bcp47: 'ne-IN', name: 'Nepali', native: 'नेपाली', flag: '🇮🇳', listenBtn: '🔊 सुन्नुहोस्' },
  { code: 'kok', bcp47: 'kok-IN', name: 'Konkani', native: 'कोंकणी', flag: '🇮🇳', listenBtn: '🔊 आयकात' },
  { code: 'ks', bcp47: 'ks-IN', name: 'Kashmiri', native: 'کٲشُر', flag: '🇮🇳', listenBtn: '🔊 بوزِو' },
  { code: 'mai', bcp47: 'mai-IN', name: 'Maithili', native: 'मैथिली', flag: '🇮🇳', listenBtn: '🔊 सुनू' },
  { code: 'mni', bcp47: 'mni-IN', name: 'Manipuri', native: 'মৈতৈলোন্', flag: '🇮🇳', listenBtn: '🔊 তাবিবা' },
  { code: 'brx', bcp47: 'brx-IN', name: 'Bodo', native: 'बर’', flag: '🇮🇳', listenBtn: '🔊 खनासं' },
  { code: 'doi', bcp47: 'doi-IN', name: 'Dogri', native: 'डोगरी', flag: '🇮🇳', listenBtn: '🔊 सुनो' },
  { code: 'sat', bcp47: 'sat-IN', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', flag: '🇮🇳', listenBtn: '🔊 ᱟᱧᱡᱚᱢ' },
  { code: 'sd', bcp47: 'sd-IN', name: 'Sindhi', native: 'سنڌي', flag: '🇮🇳', listenBtn: '🔊 ٻڌو' },
]

// 2. TTS_SUPPORTED_CODES: Exactly 11 languages supported by Sarvam Bulbul v3 TTS
export const TTS_SUPPORTED_CODES = new Set([
  'en-IN',
  'hi-IN',
  'gu-IN',
  'bn-IN',
  'mr-IN',
  'pa-IN',
  'ta-IN',
  'te-IN',
  'kn-IN',
  'ml-IN',
  'od-IN',
])

// 3. TTS_LANGUAGES: Filtered list for spoken voice pickers / audio output (11 languages)
export const TTS_LANGUAGES = ALL_LANGUAGES.filter((l) =>
  TTS_SUPPORTED_CODES.has(l.bcp47)
)

/**
 * Check if a language code or BCP-47 tag has Sarvam TTS Bulbul v3 support
 */
export function isTtsSupported(langOrBcp47) {
  if (!langOrBcp47) return false
  if (TTS_SUPPORTED_CODES.has(langOrBcp47)) return true

  const found = ALL_LANGUAGES.find(
    (l) => l.code === langOrBcp47 || l.bcp47 === langOrBcp47
  )
  return found ? TTS_SUPPORTED_CODES.has(found.bcp47) : false
}
