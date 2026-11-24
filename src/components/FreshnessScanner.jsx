import React, { useState, useRef } from "react";
import { Camera, X, Loader2, RotateCcw } from "lucide-react";
import { supabase } from "../lib/supabase";
import { runTwoStageFreshnessScan } from "../services/aiVisionService";

const CATEGORY_COLOR = {
  Fresh: "text-emerald-700 bg-emerald-50 border-emerald-300",
  Good: "text-emerald-700 bg-emerald-50 border-emerald-300",
  Moderate: "text-amber-700 bg-amber-50 border-amber-300",
  "Needs Quick Sale": "text-red-700 bg-red-50 border-red-300",
};

export function FreshnessScanner({ onClose }) {
  const [step, setStep] = useState("capture");
  const [imageBase64, setImageBase64] = useState(null);
  const [manualCropOverride, setManualCropOverride] = useState("");
  const [daysSinceHarvest, setDaysSinceHarvest] = useState("");
  const [storageCondition, setStorageCondition] = useState("");
  const [storageTemp, setStorageTemp] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  function handleFileCapture(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const fullData = reader.result;
      const base64 = fullData.split(",")[1]; // strip data: prefix
      setImageBase64(base64);
      runAnalysis(base64, manualCropOverride ? { crop_type_guess: manualCropOverride } : {});
    };
    reader.readAsDataURL(file);
  }

  async function runAnalysis(img, manual) {
    setStep("analyzing");
    setError(null);

    try {
      // 1. Run dynamic Computer Vision & Freshness Engine
      const fullDataUrl = img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`;
      const localResult = await runTwoStageFreshnessScan(fullDataUrl, {
        cropName: manual?.crop_type_guess,
        daysSinceHarvest: manual?.days_since_harvest ? Number(manual.days_since_harvest) : undefined,
        storageCondition: manual?.storage_condition,
        condition: manual?.days_since_harvest && manual.days_since_harvest > 6 ? "bruised" : undefined
      });

      if (!localResult.success) {
        setResult({
          is_produce: false,
          crop_identified: null,
          identification_confidence: "high",
          freshness_score: null,
          freshness_category: null,
          reasons: [],
          rejection_message: localResult.stage1?.message || "This doesn't look like a fruit or vegetable — try again with a clear photo of your produce.",
        });
      } else {
        const score = localResult.stage2.score;
        const category = localResult.stage2.category;

        setResult({
          is_produce: true,
          crop_identified: manual?.crop_type_guess || localResult.stage1.cropName,
          identification_confidence: "high",
          freshness_score: score,
          freshness_category: category,
          shelf_life_days: localResult.stage2.shelfLifeDays,
          reasons: localResult.stage2.visualReasons,
          rejection_message: null,
        });
      }
      setStep("result");
    } catch (err) {
      console.error(err);
      setError("Couldn't analyze the photo — check your connection and try again.");
      setStep("result");
    }
  }

  function handleManualOverrideSubmit() {
    if (!imageBase64 || !manualCropOverride.trim()) return;
    runAnalysis(imageBase64, { crop_type_guess: manualCropOverride.trim() });
  }

  function handleRefinedSubmit() {
    if (!imageBase64) return;
    runAnalysis(imageBase64, {
      crop_type_guess: result?.crop_identified ?? undefined,
      days_since_harvest: daysSinceHarvest ? Number(daysSinceHarvest) : undefined,
      storage_condition: storageCondition || undefined,
      storage_temperature_c: storageTemp ? Number(storageTemp) : undefined,
    });
  }

  function reset() {
    setStep("capture");
    setImageBase64(null);
    setResult(null);
    setError(null);
    setManualCropOverride("");
    setDaysSinceHarvest("");
    setStorageCondition("");
    setStorageTemp("");
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-md p-6 relative overflow-hidden">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {step === "capture" && (
          <div className="text-center space-y-4 py-2">
            <Camera size={48} className="mx-auto text-green-600" />

            {/* Framing guide with tips */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left space-y-2">
              <p className="text-sm font-medium text-green-800">For the best scan:</p>
              <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                <li>Hold the item so most of it is visible — not fully covered by your hand</li>
                <li>Good lighting helps (near a window or outdoors works well)</li>
                <li>If possible, place it on a flat surface instead of holding it</li>
              </ul>
            </div>

            {/* Quick crop selector */}
            <div className="space-y-1.5 text-left">
              <span className="text-xs font-semibold text-gray-700 block">Select Crop Type (Optional):</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "✨ Auto-Detect", value: "" },
                  { label: "🧅 Onion", value: "Nashik Red Onion" },
                  { label: "🥔 Potato", value: "Farm Jyoti Potato" },
                  { label: "🍅 Tomato", value: "Hybrid Tomato" },
                  { label: "🍌 Banana", value: "Fresh Robusta Banana" },
                  { label: "🍎 Apple", value: "Red Apple / Royal Gala" }
                ].map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setManualCropOverride(c.value)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                      manualCropOverride === c.value
                        ? "bg-green-600 text-white border-green-600 shadow-xs"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileCapture}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition"
            >
              Take Photo
            </button>
          </div>
        )}

        {step === "analyzing" && (
          <div className="text-center py-12 space-y-4">
            <Loader2 size={44} className="mx-auto animate-spin text-green-600" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-800">Checking Freshness & Crop Identity…</p>
              <p className="text-xs text-gray-500">Looking past hand/fingers for produce characteristics</p>
            </div>
          </div>
        )}

        {step === "result" && error && (
          <div className="text-center space-y-4 py-6">
            <p className="text-xs text-red-600 font-medium bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>
            <button onClick={reset} className="btn-farm text-xs py-2 px-4 font-bold flex items-center gap-1.5 mx-auto">
              <RotateCcw size={15} /> Try Again
            </button>
          </div>
        )}

        {step === "result" && result && !result.is_produce && (
          <div className="text-center space-y-4 py-2 animate-in fade-in">
            <p className="text-gray-700 text-sm">{result.rejection_message}</p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-left">
              <p className="text-sm text-yellow-800">
                Tip: If you're holding the item, try showing more of it and less of your hand, 
                or place it on a flat surface and try again.
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Not what you expected? Tell us what this is"
                value={manualCropOverride}
                onChange={(e) => setManualCropOverride(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={handleManualOverrideSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded-lg w-full font-medium hover:bg-green-700 transition text-sm"
              >
                Analyze As This Crop
              </button>
            </div>
            <button onClick={reset} className="text-gray-500 text-sm hover:underline">
              Scan a different photo
            </button>
          </div>
        )}

        {step === "result" && result && result.is_produce && (
          <div className="space-y-4 py-1 animate-in fade-in">
            <div className={`rounded-2xl border p-4 text-center shadow-xs ${CATEGORY_COLOR[result.freshness_category ?? "Moderate"] || "text-emerald-700 bg-emerald-50 border-emerald-300"}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">Category</span>
              <p className="text-2xl font-extrabold">{result.freshness_category}</p>
              <p className="text-xs font-bold mt-1 text-gray-800">{result.crop_identified} — <span className="font-mono text-sm">{result.freshness_score}/100</span></p>
            </div>

            {/* Quick 1-click crop change */}
            <div className="flex flex-wrap gap-1 items-center justify-center pt-0.5">
              <span className="text-[10px] text-gray-400 font-medium">Wrong crop?</span>
              {[
                { label: "🧅 Onion", value: "Nashik Red Onion" },
                { label: "🥔 Potato", value: "Farm Jyoti Potato" },
                { label: "🍅 Tomato", value: "Hybrid Tomato" },
                { label: "🍌 Banana", value: "Fresh Robusta Banana" },
                { label: "🍎 Apple", value: "Red Apple / Royal Gala" }
              ].map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => {
                    setManualCropOverride(c.value);
                    runAnalysis(imageBase64, { crop_type_guess: c.value });
                  }}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 hover:bg-green-100 hover:text-green-800 text-gray-600 transition"
                >
                  {c.label}
                </button>
              ))}
            </div>

            {result.identification_confidence === "low" && (
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200 text-center font-medium">
                ⚠️ Crop identification uncertain from this angle — result may be less accurate.
              </p>
            )}

            <div className="bg-gray-50/80 rounded-2xl p-3.5 space-y-1.5 border border-gray-100">
              <span className="text-[11px] font-bold text-gray-800 block">Visual Assessment Reasons:</span>
              <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                {result.reasons?.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>

            {/* Optional refinement form */}
            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
              <p className="font-bold text-gray-800 text-xs">Get a more accurate score (Optional Details):</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Days since harvest"
                  value={daysSinceHarvest}
                  onChange={(e) => setDaysSinceHarvest(e.target.value)}
                  className="input-farm text-xs py-1.5"
                />
                <select
                  value={storageCondition}
                  onChange={(e) => setStorageCondition(e.target.value)}
                  className="input-farm text-xs py-1.5"
                >
                  <option value="">Storage condition</option>
                  <option value="room_temperature">Room temperature</option>
                  <option value="refrigerated">Refrigerated / Cold</option>
                  <option value="open_air">Open air / Outdoors</option>
                </select>
              </div>

              {storageCondition === "refrigerated" && (
                <input
                  type="number"
                  placeholder="Approx. temperature (°C)"
                  value={storageTemp}
                  onChange={(e) => setStorageTemp(e.target.value)}
                  className="input-farm text-xs py-1.5"
                />
              )}
              
              <button
                onClick={handleRefinedSubmit}
                className="btn-outline-farm text-xs py-2 px-4 rounded-xl w-full font-bold justify-center"
              >
                Get Refined Freshness Score
              </button>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <button onClick={reset} className="text-gray-500 hover:text-gray-900 text-xs font-semibold flex items-center gap-1">
                <RotateCcw size={13} /> Scan Again
              </button>
              <button onClick={onClose} className="btn-farm text-xs py-1.5 px-4 font-bold">
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FreshnessScanner;
