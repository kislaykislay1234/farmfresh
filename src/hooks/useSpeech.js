import { useState, useEffect, useRef, useCallback } from 'react';
import { LANGUAGES } from '../contexts/LanguageContext';

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
const SpeechRecognition = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

export function useSpeech(lang = 'en') {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voices, setVoices] = useState([]);
  const [voiceFallback, setVoiceFallback] = useState(false);
  const [synthSupported] = useState(!!synth);
  const [recogSupported] = useState(!!SpeechRecognition);
  const recognizerRef = useRef(null);

  // Load voices after voiceschanged fires
  useEffect(() => {
    if (!synth) return;
    const loadVoices = () => setVoices(synth.getVoices());
    loadVoices();
    synth.addEventListener('voiceschanged', loadVoices);
    return () => synth.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const getVoice = useCallback(() => {
    const targetLang = LANGUAGES[lang]?.voiceLang || 'en-IN';
    const match = voices.find(v => v.lang === targetLang)
      || voices.find(v => v.lang.startsWith(lang))
      || voices.find(v => v.lang.startsWith('en'))
      || voices[0];

    if (match && match.lang !== targetLang) setVoiceFallback(true);
    else setVoiceFallback(false);
    return match;
  }, [voices, lang]);

  const speak = useCallback((text) => {
    if (!synth || !text) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = getVoice();
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.onstart  = () => setIsSpeaking(true);
    utter.onend    = () => setIsSpeaking(false);
    utter.onerror  = () => setIsSpeaking(false);
    synth.speak(utter);
  }, [getVoice]);

  const stop = useCallback(() => {
    if (synth) synth.cancel();
    setIsSpeaking(false);
  }, []);

  const startListening = useCallback((onResult) => {
    if (!SpeechRecognition) return;
    if (recognizerRef.current) recognizerRef.current.stop();
    const recog = new SpeechRecognition();
    recog.lang = LANGUAGES[lang]?.voiceLang || 'en-IN';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onstart  = () => setIsListening(true);
    recog.onend    = () => setIsListening(false);
    recog.onerror  = () => setIsListening(false);
    recog.onresult = (e) => {
      const result = e.results[0][0].transcript;
      setTranscript(result);
      onResult?.(result);
    };
    recog.start();
    recognizerRef.current = recog;
  }, [lang]);

  const stopListening = useCallback(() => {
    recognizerRef.current?.stop();
    setIsListening(false);
  }, []);

  return {
    speak, stop, startListening, stopListening,
    isSpeaking, isListening, transcript,
    synthSupported, recogSupported, voiceFallback,
  };
}
