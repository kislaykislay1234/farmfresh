// supabase/functions/tts-proxy/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, api-subscription-key",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, language_code = "hi-IN" } = await req.json();
    const sarvamApiKey = Deno.env.get("SARVAM_API_KEY") || "sk_wruqvpaz_1pjoG7wIJG3Q0eJ1JuCHQfya";

    if (!text) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": sarvamApiKey,
      },
      body: JSON.stringify({
        text: text.slice(0, 500), // optimal length for TTS latency
        language_code: language_code,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.warn("Sarvam TTS API error:", data);
      return new Response(JSON.stringify({ error: data }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const audioBase64 = data.audios?.[0] || null;
    return new Response(
      JSON.stringify({
        audio_base64: audioBase64,
        request_id: data.request_id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("TTS proxy error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
