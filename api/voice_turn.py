# api/voice_turn.py
# FastAPI route for Chained Multilingual Voice Turn

from fastapi import FastAPI, UploadFile, Form, File
from voice_agent.pipeline import run_voice_turn
import asyncio

app = FastAPI(title="FarmFresh Voice Turn Agent")

@app.post("/api/voice-turn")
async def voice_turn(
    audio: UploadFile = File(...),
    farmer_id: str = Form(...),
    language_code: str = Form("hi-IN")
):
    """
    Full voice turn endpoint:
    Farmer speaks in regional language -> Sarvam STT -> Translate -> Tool Agent -> Translate -> Sarvam TTS Audio
    """
    audio_bytes = await audio.read()
    result = await run_voice_turn(audio_bytes, farmer_id, language_code)
    return result
