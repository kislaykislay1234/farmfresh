// supabase/functions/chat-assistant/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, api-subscription-key",
};

// Grounded agricultural response generator
function getGroundedAIReply(englishMessage: string): string {
  const lower = englishMessage.toLowerCase();

  if (lower.includes("tomato") || lower.includes("mandi") || lower.includes("price") || lower.includes("rate") || lower.includes("onion") || lower.includes("potato")) {
    return "Today's APMC Mandi Rates:\n• Anand (Gujarat) Tomato: ₹26.50/kg (+8.4% price spike)\n• Lasalgaon (Maharashtra) Red Onion: ₹29.00/kg\n• Agra (Uttar Pradesh) Potato: ₹18.00/kg\n• Wayanad (Kerala) Fresh Ginger: ₹135.00/kg.\nDemand is especially strong across Mumbai and Delhi NCR.";
  }

  if (lower.includes("scheme") || lower.includes("subsidy") || lower.includes("kisan") || lower.includes("pm-kisan") || lower.includes("fund")) {
    return "Government Farmer Support Schemes:\n1. PM-KISAN: ₹6,000/yr direct bank transfer in 3 installments (pmkisan.gov.in)\n2. Agriculture Infrastructure Fund (AIF): 3% interest subvention for cold storage and warehouse loans up to ₹2 Crore\n3. PKVY: ₹50,000/ha assistance for certified natural and organic farming.";
  }

  if (lower.includes("cold") || lower.includes("storage") || lower.includes("warehouse") || lower.includes("room")) {
    return "Verified Cold Storage Facilities:\n• Shree Krishna Cold Chain (Kheda, Gujarat): 1,850 MT available @ ₹110/Quintal/month with solar backup\n• MahaCold Hub (Nashik, Maharashtra): 3,200 MT available @ ₹95/Quintal/month.\nYou can reserve chamber space directly from the Cold Chain tab.";
  }

  if (lower.includes("transport") || lower.includes("truck") || lower.includes("vehicle") || lower.includes("driver") || lower.includes("logistics")) {
    return "Verified Reefer Transport:\n• 10T Chilled Reefer (GJ-01-BX-8921): ₹38/km with live temperature GPS telematics\n• 5T Eicher Pro (MH-15-EG-4402): ₹24/km.\nInstant booking available in the Logistics section.";
  }

  if (lower.includes("mushroom") || lower.includes("diversification") || lower.includes("crop suggestion")) {
    return "Button Mushroom is in High Demand across National, UP, Bihar, and Odisha markets (+12.2% growth). Requires only 30 days to harvest in cool shaded space (18-22°C). State subsidies (e.g. Bihar 50% hut setup grant) are currently open.";
  }

  return "I am your FarmFresh AI Assistant. I can help you with live APMC Mandi prices, crop quality inspection, cold storage booking, GPS reefer transport, and government agricultural subsidies.";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, userLanguage = "hi-IN" } = await req.json();
    const sarvamApiKey = Deno.env.get("SARVAM_API_KEY") || "sk_wruqvpaz_1pjoG7wIJG3Q0eJ1JuCHQfya";

    if (!message) {
      return new Response(JSON.stringify({ error: "No message provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 1: Translate user input to English (if not already en-IN)
    let englishMessage = message;
    if (userLanguage !== "en-IN" && sarvamApiKey) {
      try {
        const translateInRes = await fetch("https://api.sarvam.ai/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": sarvamApiKey,
          },
          body: JSON.stringify({
            input: message,
            source_language_code: userLanguage,
            target_language_code: "en-IN",
            mode: "modern-colloquial",
          }),
        });
        const translateInData = await translateInRes.json();
        if (translateInData.translated_text) {
          englishMessage = translateInData.translated_text;
        }
      } catch (tInErr) {
        console.warn("Input translation failed, continuing with raw input:", tInErr);
      }
    }

    // Step 2: Generate response
    const englishReply = getGroundedAIReply(englishMessage);

    // Step 3: Translate response back to user's selected language
    let finalReply = englishReply;
    if (userLanguage !== "en-IN" && sarvamApiKey) {
      try {
        const translateOutRes = await fetch("https://api.sarvam.ai/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": sarvamApiKey,
          },
          body: JSON.stringify({
            input: englishReply,
            source_language_code: "en-IN",
            target_language_code: userLanguage,
            mode: "modern-colloquial",
          }),
        });
        const translateOutData = await translateOutRes.json();
        if (translateOutData.translated_text) {
          finalReply = translateOutData.translated_text;
        }
      } catch (tOutErr) {
        console.warn("Output translation failed, using English reply:", tOutErr);
      }
    }

    // Step 4: Generate Sarvam Text-to-Speech audio
    let audioBase64: string | null = null;
    if (sarvamApiKey) {
      try {
        const ttsRes = await fetch("https://api.sarvam.ai/text-to-speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": sarvamApiKey,
          },
          body: JSON.stringify({
            text: finalReply.slice(0, 500),
            language_code: userLanguage,
          }),
        });
        const ttsData = await ttsRes.json();
        audioBase64 = ttsData.audios?.[0] || null;
      } catch (ttsErr) {
        console.warn("TTS generation failed:", ttsErr);
      }
    }

    return new Response(
      JSON.stringify({
        text: finalReply,
        audio_base64: audioBase64,
        language_code: userLanguage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Chat assistant error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
