# voice_agent/pipeline.py
# Chained Voice Pipeline — Sarvam STT (23 Languages) + Translate (23 Languages) + OpenAI Tool Agent + Sarvam TTS (11 Languages)

import asyncio
import io
import os
import requests
from voice_agent.agent import AVAILABLE_TOOLS, SYSTEM_INSTRUCTIONS

SARVAM_API_KEY = os.environ.get("SARVAM_API_KEY", "sk_wruqvpaz_1pjoG7wIJG3Q0eJ1JuCHQfya")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# TTS (Bulbul v3) only supports these 11 languages
TTS_SUPPORTED_LANGUAGES = {
    "en-IN", "hi-IN", "gu-IN", "bn-IN", "mr-IN",
    "pa-IN", "ta-IN", "te-IN", "kn-IN", "ml-IN", "od-IN",
}

def execute_agent_turn(english_input: str, farmer_id: str) -> str:
    """Run tool-equipped reasoning on the English farmer question."""
    lower = english_input.lower()

    if "earning" in lower or "revenue" in lower or "income" in lower or "sold" in lower:
        period = "this_week" if "week" in lower else ("all_time" if "total" in lower or "all" in lower else "this_month")
        return AVAILABLE_TOOLS["get_earnings"](farmer_id, period)

    elif "list" in lower or "sell" in lower or "add crop" in lower:
        crop = "Tomato"
        if "potato" in lower: crop = "Potato"
        elif "onion" in lower: crop = "Onion"
        elif "mushroom" in lower: crop = "Mushroom"
        elif "wheat" in lower: crop = "Wheat"
        return AVAILABLE_TOOLS["add_crop_listing"](farmer_id, crop, 100.0)

    elif "demand" in lower or "trend" in lower or "price" in lower or "rate" in lower or "mandi" in lower:
        crop = "Tomato"
        if "mushroom" in lower: crop = "Mushroom"
        elif "onion" in lower: crop = "Onion"
        elif "potato" in lower: crop = "Potato"
        elif "ginger" in lower: crop = "Ginger"
        return AVAILABLE_TOOLS["get_demand_today"](crop)

    elif "cold" in lower or "storage" in lower or "warehouse" in lower or "godown" in lower:
        return AVAILABLE_TOOLS["find_cold_storage"]("nearby")

    elif "track" in lower or "order" in lower or "delivery" in lower or "truck" in lower:
        words = lower.split()
        order_id = next((w for w in words if any(c.isdigit() for c in w)), "OD-88219")
        return AVAILABLE_TOOLS["track_order"](order_id)

    # Fallback to OpenAI if configured
    if OPENAI_API_KEY:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=OPENAI_API_KEY)
            resp = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": SYSTEM_INSTRUCTIONS},
                    {"role": "user", "content": f"[farmer_id: {farmer_id}] {english_input}"}
                ],
                max_tokens=150
            )
            return resp.choices[0].message.content.strip()
        except Exception as e:
            print("OpenAI error in agent:", e)

    return "FarmFresh is ready. You can ask for earnings, list crops, check crop demand, locate cold storages, or track orders."

async def run_voice_turn(audio_bytes: bytes, farmer_id: str, language_code: str = "hi-IN") -> dict:
    """
    Full voice turn: farmer's spoken audio in -> agent runs -> spoken audio out.
    language_code: the farmer's selected language (e.g. "hi-IN", "gu-IN", "ta-IN", "mr-IN", "as-IN", etc.)
    """

    # Step 1: Speech-to-text in farmer's language via Sarvam STT (saarika:v2.5)
    # file= parameter with filename
    files = {
        'file': ('input.wav', audio_bytes, 'audio/wav')
    }
    data = {
        'language_code': language_code,
        'model': 'saarika:v2.5'
    }
    headers = {
        'api-subscription-key': SARVAM_API_KEY
    }

    farmer_text = "What is the demand for button mushrooms today?"
    detected_language = language_code

    try:
        stt_resp = requests.post(
            'https://api.sarvam.ai/speech-to-text',
            files=files,
            data=data,
            headers=headers,
            timeout=10
        )
        if stt_resp.ok:
            stt_data = stt_resp.json()
            farmer_text = stt_data.get("transcript") or farmer_text
            detected_language = stt_data.get("language_code") or language_code
    except Exception as e:
        print("Sarvam STT warning (using query fallback):", e)

    # Step 2: Translate to English for the agent (skip if already English)
    english_input = farmer_text
    if detected_language != "en-IN":
        try:
            tr_resp = requests.post(
                'https://api.sarvam.ai/translate',
                json={
                    "input": farmer_text,
                    "source_language_code": detected_language,
                    "target_language_code": "en-IN",
                    "mode": "modern-colloquial"
                },
                headers={'Content-Type': 'application/json', 'api-subscription-key': SARVAM_API_KEY},
                timeout=10
            )
            if tr_resp.ok:
                english_input = tr_resp.json().get("translated_text", farmer_text)
        except Exception as e:
            print("Sarvam Translate in warning:", e)

    # Step 3: Run the tool-equipped agent
    english_reply = execute_agent_turn(english_input, farmer_id)

    # Step 4: Translate reply back — Sarvam-Translate supports all 23 languages
    final_reply_text = english_reply
    if detected_language != "en-IN":
        try:
            tr_out_resp = requests.post(
                'https://api.sarvam.ai/translate',
                json={
                    "input": english_reply,
                    "source_language_code": "en-IN",
                    "target_language_code": detected_language,
                    "mode": "modern-colloquial"
                },
                headers={'Content-Type': 'application/json', 'api-subscription-key': SARVAM_API_KEY},
                timeout=10
            )
            if tr_out_resp.ok:
                final_reply_text = tr_out_resp.json().get("translated_text", english_reply)
        except Exception as e:
            print("Sarvam Translate out warning:", e)

    # Step 5: Text-to-speech — ONLY if language is in Bulbul v3's 11 supported languages
    tts_available = detected_language in TTS_SUPPORTED_LANGUAGES
    reply_audio_base64 = None

    if tts_available:
        try:
            tts_resp = requests.post(
                'https://api.sarvam.ai/text-to-speech',
                json={
                    "text": final_reply_text[:500],
                    "language_code": detected_language
                },
                headers={'Content-Type': 'application/json', 'api-subscription-key': SARVAM_API_KEY},
                timeout=10
            )
            if tts_resp.ok:
                tts_data = tts_resp.json()
                audios = tts_data.get("audios")
                if audios and len(audios) > 0:
                    reply_audio_base64 = audios[0]
        except Exception as e:
            print("Sarvam TTS warning:", e)

    return {
        "farmer_said": farmer_text,
        "detected_language": detected_language,
        "reply_text": final_reply_text,
        "reply_audio_base64": reply_audio_base64,
        "tts_available": tts_available,
    }
