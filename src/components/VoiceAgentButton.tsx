// src/components/VoiceAgentButton.tsx
import { useState, useRef } from "react";

export function VoiceAgentButton({ farmerId = "f101", languageCode = "hi-IN" }: { farmerId?: string; languageCode?: string }) {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [note, setNote] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startListening() {
    try {
      setNote("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = handleStop;
      recorder.start();
      setListening(true);

      // Auto-stop after 6 seconds of button being held
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          stream.getTracks().forEach((track) => track.stop());
        }
      }, 6000);
    } catch (err) {
      console.warn("Microphone access error:", err);
      setReplyText("Could not access microphone. Please enable audio permissions.");
    }
  }

  async function handleStop() {
    setListening(false);
    setProcessing(true);
    setNote("");
    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "input.webm");
      formData.append("farmer_id", farmerId);
      formData.append("language_code", languageCode);

      const res = await fetch("/api/voice-turn", { method: "POST", body: formData });
      const data = await res.json();

      const { reply_text, reply_audio_base64, tts_available } = data;
      setReplyText(reply_text || "Voice response received.");

      if (tts_available && reply_audio_base64) {
        const audio = new Audio(`data:audio/wav;base64,${reply_audio_base64}`);
        audio.play().catch(console.warn);
      } else if (!tts_available) {
        setNote("Spoken reply isn't available in this language yet — showing text instead.");
      }
    } catch (e) {
      console.error("Voice turn API error:", e);
      setReplyText("FarmFresh Voice Assistant is ready. (Check your network connection)");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={listening ? () => mediaRecorderRef.current?.stop() : startListening}
        disabled={processing}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition shadow-xl text-2xl ${
          listening ? "bg-red-500 animate-pulse text-white" : processing ? "bg-amber-500 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
        }`}
        title="Tap to speak in your regional language"
      >
        {processing ? "⏳" : "🎤"}
      </button>
      {listening && <p className="text-xs text-red-600 font-bold animate-pulse">Listening... Speak now</p>}
      {processing && <p className="text-xs text-amber-700 font-semibold">Running Sarvam AI & Tools...</p>}
      {replyText && (
        <div className="bg-white/90 border border-emerald-200 p-3 rounded-2xl shadow-md max-w-xs text-center space-y-1">
          <p className="text-sm text-gray-800">{replyText}</p>
          {note && <p className="text-xs text-amber-700 bg-amber-50 p-1 rounded-lg">ℹ️ {note}</p>}
        </div>
      )}
    </div>
  );
}
