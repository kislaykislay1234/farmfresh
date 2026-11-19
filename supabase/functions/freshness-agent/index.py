# supabase/functions/freshness-agent/index.py
# Server-side vision freshness agent with anti-hedging & hard rot scoring anchors
# NEVER call this from the frontend directly — API key must stay server-side

import base64
import json
import os
from openai import OpenAI

client = OpenAI()  # OPENAI_API_KEY read from environment, never hardcoded

SYSTEM_PROMPT = """You are FarmFresh's produce freshness inspector. You will be shown a photo of a fruit or vegetable, possibly with a hand holding it, imperfect lighting, or dirt — this is real farm photography.

Assess freshness STRICTLY based on visible evidence. Do not hedge toward a middle score out of caution — commit to the score the image actually supports.

Use these anchors as a hard reference, not a suggestion:
- 90-100 (Fresh): Vibrant natural color, firm/taut skin, no visible spots, no wrinkling, no discoloration
- 70-89 (Good): Minor surface blemishes or slight dulling of color, still firm, no rot or mold
- 40-69 (Moderate): Visible soft spots, noticeable wrinkling/shriveling, dull or uneven color, early browning
- 0-39 (Needs Quick Sale / Rotten): ANY of the following is present — visible mold, dark/black soft patches, significant shriveling, leaking or mushy texture, sprouting decay, strong visual signs of rot

CRITICAL RULE: If you see mold, dark soft patches, mushy or collapsed texture, or clear rot — the score MUST be below 40, regardless of how much of the item still looks intact elsewhere. One clearly rotten section overrides an otherwise okay-looking item, because rot spreads and the item is not sellable. Do not average a rotten patch against good-looking areas to land on a moderate score — rot is disqualifying, not a minor deduction.

Identify the crop first. Only return is_produce: false if you're highly confident the image shows something with no agricultural crop visible at all (pure hand, unrelated object). A hand holding produce is normal — assess the visible produce, ignore the hand.

Respond with ONLY this JSON, no other text:
{
  "is_produce": boolean,
  "crop_identified": string or null,
  "identification_confidence": "high" | "medium" | "low",
  "freshness_score": number 0-100 or null,
  "freshness_category": "Fresh" | "Good" | "Moderate" | "Needs Quick Sale" or null,
  "reasons": [string, string, string],
  "rejection_message": string or null
}"""

def analyze_freshness(image_base64: str, manual_details: dict = None):
    details_text = "No manual details provided — assess from image alone."
    if manual_details:
        details_text = (
            f"Farmer-provided: crop type = {manual_details.get('crop_type_guess', 'not provided')}, "
            f"days since harvest = {manual_details.get('days_since_harvest', 'not provided')}, "
            f"storage = {manual_details.get('storage_condition', 'not provided')}, "
            f"temperature = {manual_details.get('storage_temperature_c', 'not provided')}°C"
        )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": details_text},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"},
                    },
                ],
            },
        ],
        response_format={"type": "json_object"}
    )

    raw = response.choices[0].message.content.strip()
    clean = raw.replace("```json", "").replace("```", "").strip()

    try:
        result = json.loads(clean)
    except json.JSONDecodeError:
        return {"error": "Could not parse AI response", "raw": raw}

    return result
