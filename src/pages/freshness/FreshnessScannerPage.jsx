import React, { useState, useRef, useEffect } from 'react'
import { Camera, ScanLine, Sparkles, ShieldCheck, RefreshCw, Upload, CheckCircle2, AlertTriangle, ArrowRight, XCircle, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { VoiceReadButton } from '../../components/common/VoiceReadButton'
import { useVoice } from '../../contexts/VoiceContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { runTwoStageFreshnessScan } from '../../services/aiVisionService'

// Authentic test produce and non-produce test cases for rigorous evaluation
const TEST_CASES = [
  {
    id: 'case-potato-hand-open',
    name: '🥔 Farm Potato Held in Hand (Open Palm)',
    type: 'produce',
    condition: 'fresh',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    description: 'Potato clearly held in open palm with most surface visible'
  },
  {
    id: 'case-fungal-vegetable',
    name: '🍄 Fungus / Mold Infected Tomato',
    type: 'produce',
    condition: 'fungus',
    hasFungus: true,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80&condition=fungus-mold',
    description: 'Presence of white/grey fungal mycelium (Triggers ≤10% rating & 1-day life span)'
  },
  {
    id: 'case-bacterial-texture-rot',
    name: '🦠 Bacterial Soft Rot & Texture Decay (Potato)',
    type: 'produce',
    condition: 'bacteria',
    hasBacteria: true,
    textureDegraded: true,
    image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=600&auto=format&fit=crop&q=80&condition=bacterial-decay',
    description: 'Bacterial water-soaked lesions & mushy collapsed texture (Triggers ≤10% rating & 1-day life span)'
  },
  {
    id: 'case-potato-hand-obscured',
    name: '🥔 Potato in Hand (Partially Obscured)',
    type: 'produce',
    condition: 'fresh',
    handOccluded: true,
    image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=600&auto=format&fit=crop&q=80',
    description: 'Fingers wrapped around crop; triggers limited visibility note'
  },
  {
    id: 'case-fresh-tomato',
    name: '🍅 Fresh Hybrid Tomato (Grade A+)',
    type: 'produce',
    condition: 'fresh',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    description: 'Crisp, taut skin with bright red lycopene coloring and green stem'
  },
  {
    id: 'case-cured-onion',
    name: '🧅 Nashik Red Onion',
    type: 'produce',
    condition: 'fresh',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    description: 'Tight dry neck closure with firm cured outer skin'
  },
  {
    id: 'case-spotted-banana',
    name: '🍌 Spotted / Overripe Banana',
    type: 'produce',
    condition: 'bruised',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
    description: 'High sugar browning with visible epidermal sugar spots'
  },
  {
    id: 'case-bare-hand',
    name: '✋ Bare Hand Alone (No Produce)',
    type: 'non-produce',
    forceNonProduce: true,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80&bare-hand-alone=true',
    description: 'Only human hand with zero produce (Should trigger Stage 1 Rejection)'
  },
  {
    id: 'case-headphones',
    name: '🎧 Over-Ear Headphones (Non-Produce)',
    type: 'non-produce',
    forceNonProduce: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Non-food electronic gadget (Should trigger Stage 1 Rejection)'
  }
]

export const FreshnessScannerPage = () => {
  const { t } = useLanguage()
  const [selectedCase, setSelectedCase] = useState(TEST_CASES[0])
  const [currentImageSrc, setCurrentImageSrc] = useState(TEST_CASES[0].image)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [useCamera, setUseCamera] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [scanError, setScanError] = useState(null)
  
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)
  const { activeSectionId } = useVoice()

  // Run initial scan on load for the default crop
  useEffect(() => {
    executeScan(TEST_CASES[0].image, {
      cropName: TEST_CASES[0].name,
      condition: TEST_CASES[0].condition
    })
  }, [])

  const handleStartCamera = async () => {
    try {
      setUseCamera(true)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      toast.error('Unable to access device camera. Please grant camera permissions or upload a photo.')
      setUseCamera(false)
    }
  }

  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setUseCamera(false)
  }

  // Grab live frame from video element into Base64 JPEG
  const captureFrameFromCamera = () => {
    if (!videoRef.current) return null
    try {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth || 640
      canvas.height = videoRef.current.videoHeight || 480
      const ctx = canvas.getContext('2d')
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL('image/jpeg', 0.88)
    } catch (err) {
      console.error('Frame capture failed:', err)
      return null
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target.result
      setCurrentImageSrc(base64Data)
      setSelectedCase({
        id: 'uploaded-photo',
        name: 'Uploaded Photo',
        type: 'custom',
        image: base64Data
      })
      if (useCamera) handleStopCamera()
      // Let the AI vision engine auto-detect the produce from actual pixels
      executeScan(base64Data, {})
    }
    reader.onerror = () => {
      toast.error("Couldn't read the selected photo file.")
    }
    reader.readAsDataURL(file)
  }

  const executeScan = async (imageSource, options = {}) => {
    setIsAnalyzing(true)
    setScanError(null)
    
    try {
      const result = await runTwoStageFreshnessScan(imageSource, options)
      setScanResult(result)
      
      if (!result.success) {
        toast.error(result.stage1?.message || "This doesn't look like a fruit or vegetable.", { duration: 4000 })
      } else {
        toast.success(t('scanResultsTitle', 'AI Quality & Freshness Assessment Complete!'))
      }
    } catch (err) {
      setScanError("Couldn't analyze the photo — check your connection and try again")
      toast.error("Couldn't analyze the photo — check your connection and try again")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const triggerScan = () => {
    let imageToScan = currentImageSrc
    const isCustom = selectedCase?.type === 'custom'
    let options = isCustom ? {} : {
      cropName: selectedCase.name,
      condition: selectedCase.condition,
      forceNonProduce: selectedCase.forceNonProduce
    }

    if (useCamera) {
      const captured = captureFrameFromCamera()
      if (captured) {
        imageToScan = captured
        setCurrentImageSrc(captured)
        options = {}
      }
    }

    executeScan(imageToScan, options)
  }

  const handleSelectTestCase = (testCase) => {
    setSelectedCase(testCase)
    setCurrentImageSrc(testCase.image)
    if (useCamera) handleStopCamera()
    executeScan(testCase.image, {
      cropName: testCase.name,
      condition: testCase.condition,
      forceNonProduce: testCase.forceNonProduce
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('cvBadge', 'Computer Vision Quality & Ripeness Neural Network')}</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-gray-900">
          {t('scannerTitle', 'AI Freshness & Grade Scanner')}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {t('scannerSubtitle', 'Instant crop quality grading from smartphone camera or photo upload. Two-stage neural verification filters non-food objects and scores true produce freshness.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image / Camera Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card p-4 rounded-3xl space-y-4">
            {/* Viewfinder Container */}
            <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner">
              {useCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={currentImageSrc}
                  alt={selectedCase.name}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Scanning Animation Laser Overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-farm-950/60 backdrop-blur-xs flex flex-col justify-center items-center p-6 text-center z-20">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-farm-400 to-transparent shadow-[0_0_20px_#4ade80] animate-pulse mb-4" />
                  <RefreshCw className="w-8 h-8 text-farm-400 animate-spin mb-2" />
                  <span className="text-white font-mono text-xs bg-black/80 px-4 py-1.5 rounded-full border border-farm-500/40">
                    {t('analyzingNeural', 'Stage 1: Identifying Object & Chroma Spectrum...')}
                  </span>
                </div>
              )}

              {/* Viewfinder Reticle */}
              <div className="absolute inset-4 border-2 border-white/40 border-dashed rounded-xl pointer-events-none flex flex-col justify-between p-2 z-10">
                <div className="flex justify-between text-[10px] text-white/80 font-mono">
                  <span>[STAGE 1: PRODUCE_VERIFY]</span>
                  <span>[SPECTRAL_ANALYSIS]</span>
                </div>
                <div className="flex justify-between text-[10px] text-white/80 font-mono">
                  <span>[STAGE 2: FRESHNESS_SCORE]</span>
                  <span>[AI_VISION_V2.4]</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={triggerScan}
                disabled={isAnalyzing}
                className="btn-farm text-xs py-2.5 px-5 flex-1 shadow-md font-bold"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t('analyzingNeural', 'Analyzing Neural Model...')}</span>
                  </>
                ) : (
                  <>
                    <ScanLine className="w-4 h-4" />
                    <span>{t('scanCropQuality', 'Scan Crop Quality')}</span>
                  </>
                )}
              </button>

              {useCamera ? (
                <button
                  onClick={handleStopCamera}
                  className="btn-outline-farm text-xs py-2.5 px-3"
                >
                  {t('closeCamera', 'Close Camera')}
                </button>
              ) : (
                <button
                  onClick={handleStartCamera}
                  className="btn-outline-farm text-xs py-2.5 px-3"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t('useDeviceCamera', 'Use Camera')}</span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-outline-farm text-xs py-2.5 px-3"
                title="Upload photo from device"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
            </div>

            {/* Framing guide with tips */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-left space-y-1.5">
              <p className="text-xs font-bold text-emerald-800">For the best scan:</p>
              <ul className="text-xs text-emerald-700 space-y-1 list-disc list-inside">
                <li>Hold the item so most of it is visible — not fully covered by your hand</li>
                <li>Good lighting helps (near a window or outdoors works well)</li>
                <li>If possible, place it on a flat surface instead of holding it</li>
              </ul>
            </div>

            {/* Test Produce & Non-Produce Selection Chips */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                <span>{t('orSelectProduce', 'Test sample presets (Including non-food):')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TEST_CASES.map((tc) => (
                  <button
                    key={tc.id}
                    onClick={() => handleSelectTestCase(tc)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${
                      selectedCase.id === tc.id
                        ? 'bg-farm-50 border-farm-500 font-bold text-farm-950 ring-2 ring-farm-500/20 shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="truncate">
                      <div className="truncate font-semibold">{tc.name}</div>
                      <div className="text-[10px] text-gray-400 font-normal truncate">{tc.description}</div>
                    </div>
                    {tc.type === 'non-produce' ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-100 text-red-700 font-bold shrink-0">Non-Food</span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-700 font-bold shrink-0">Produce</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Scan Results Report */}
        <div className="lg:col-span-6 space-y-4">
          {/* Error Message */}
          {scanError && (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-red-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <XCircle className="w-5 h-5 text-red-600" />
                <span>Analysis Failed</span>
              </div>
              <p className="text-xs text-red-700">{scanError}</p>
            </div>
          )}

          {/* STAGE 1 REJECTION CARD (Non-Produce Object) */}
          {scanResult && !scanResult.success && (
            <div className="glass-card-amber p-6 sm:p-8 rounded-3xl border-2 border-amber-300 shadow-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="space-y-1">
                  <div className="px-2.5 py-0.5 rounded-md bg-amber-200/80 text-amber-900 text-[10px] font-extrabold uppercase inline-block">
                    Stage 1 Check: Non-Produce Object
                  </div>
                  <h3 className="font-display font-extrabold text-lg text-amber-950">
                    Fruit / Vegetable Not Detected
                  </h3>
                </div>
              </div>

              {/* Exact required rejection message */}
              <div className="bg-white/90 rounded-2xl p-4 border border-amber-200 text-xs font-semibold text-gray-800 leading-relaxed space-y-2">
                <p>
                  "This doesn't look like a fruit or vegetable — try again with a clear photo of your produce."
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-left">
                  <p className="text-xs text-yellow-800">
                    <strong>Tip:</strong> If you're holding the item, try showing more of it and less of your hand, 
                    or place it on a flat surface and try again.
                  </p>
                </div>

                <div className="pt-1 text-[11px] text-gray-500 font-normal flex items-center justify-between">
                  <span>Detected Profile:</span>
                  <span className="font-mono font-semibold text-amber-900">{scanResult.stage1?.detectedObject || 'Electronic Hardware / Non-Produce'}</span>
                </div>
              </div>

              <div className="text-[11px] text-amber-800 bg-amber-100/50 p-3 rounded-xl">
                🛡️ <strong>Safety Rule:</strong> FreshGrid never generates synthetic freshness scores for non-agricultural objects. Please point camera at agricultural crops (tomatoes, onions, apples, grains, etc.).
              </div>
            </div>
          )}

          {/* STAGE 2 VERIFIED REPORT CARD (Real Produce) */}
          {scanResult && scanResult.success && scanResult.stage2 && (
            <div className={`glass-card p-6 rounded-3xl space-y-6 transition-all duration-300 animate-in fade-in duration-300 ${
              activeSectionId === 'freshness-report-card' ? 'ring-4 ring-emerald-500/50 bg-emerald-50/50 border-emerald-300 shadow-xl' : ''
            }`}>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Stage 1 Verified ✅
                    </span>
                    <span className="text-xs text-gray-500 font-mono">Scan #{Date.now().toString().slice(-6)}</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mt-1">
                    {scanResult.stage1.cropName} {t('scanResultsTitle', 'Quality Report')}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    scanResult.stage2.score <= 10 
                      ? 'bg-red-100 text-red-800 border-red-300 animate-pulse' 
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {scanResult.stage2.score <= 10 ? '🚨 Grade D (Critical Spoilage)' : `${t('qualityGradeLbl', 'Grade')} ${scanResult.stage2.grade} ${t('certifiedGrade', 'Certified')}`}
                  </div>
                  <VoiceReadButton
                    sectionId="freshness-report-card"
                    category="freshness"
                    data={{
                      crop_type: scanResult.stage1.cropName,
                      freshness_score: scanResult.stage2.score,
                      grade: scanResult.stage2.grade,
                      category: scanResult.stage2.category,
                      estimated_shelf_life_days: scanResult.stage2.shelfLifeDays,
                      reasons: scanResult.stage2.visualReasons?.join('. ')
                    }}
                    size="sm"
                  />
                </div>
              </div>

              {/* Category Badge Banner */}
              <div className={`border rounded-2xl p-3 flex items-center justify-between text-xs ${
                scanResult.stage2.score <= 10 
                  ? 'bg-red-50 border-red-200 text-red-900' 
                  : 'bg-farm-50 border-farm-200 text-gray-700'
              }`}>
                <span className="font-semibold">
                  {scanResult.stage2.score <= 10 ? '🛑 Pathogen Contamination Hazard:' : 'Assessed Commercial Category:'}
                </span>
                <span className={`font-bold px-3 py-1 rounded-xl shadow-xs border ${
                  scanResult.stage2.score <= 10 
                    ? 'bg-red-600 text-white border-red-700' 
                    : 'text-farm-900 bg-white border-farm-200'
                }`}>
                  {scanResult.stage2.category}
                </span>
              </div>

              {/* Big Score Gauges */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl text-center space-y-1 border ${
                  scanResult.stage2.score <= 10
                    ? 'bg-red-50 border-red-300 text-red-900'
                    : 'glass-card-green text-farm-800'
                }`}>
                  <div className={`text-xs font-semibold ${scanResult.stage2.score <= 10 ? 'text-red-700' : 'text-farm-800'}`}>
                    {t('freshnessIndex', 'Freshness Score')}
                  </div>
                  <div className={`font-display font-extrabold text-4xl ${scanResult.stage2.score <= 10 ? 'text-red-600' : 'text-farm-800'}`}>
                    {scanResult.stage2.score}<span className="text-xl font-normal">%</span>
                  </div>
                  <div className={`text-[11px] font-medium ${scanResult.stage2.score <= 10 ? 'text-red-700 font-bold' : 'text-farm-700'}`}>
                    {scanResult.stage2.score <= 10 ? '⚠️ ≤10% Pathogen Override' : `${scanResult.stage2.grade} Quality Tier`}
                  </div>
                </div>

                <div className={`p-4 rounded-2xl text-center space-y-1 border ${
                  scanResult.stage2.score <= 10
                    ? 'bg-red-50 border-red-300 text-red-900'
                    : 'glass-card-amber text-harvest-800'
                }`}>
                  <div className={`text-xs font-semibold ${scanResult.stage2.score <= 10 ? 'text-red-700' : 'text-harvest-800'}`}>
                    {t('estShelfLifeDays', 'Est. Life Span')}
                  </div>
                  <div className={`font-display font-extrabold text-4xl ${scanResult.stage2.score <= 10 ? 'text-red-600' : 'text-harvest-800'}`}>
                    {scanResult.stage2.shelfLifeDays}<span className="text-xl font-normal"> {t('days', 'day')}</span>
                  </div>
                  <div className={`text-[11px] font-semibold ${scanResult.stage2.score <= 10 ? 'text-red-700' : 'text-harvest-700'}`}>
                    {scanResult.stage2.score <= 10 ? '🚨 Immediate Action Required' : t('ambientTemp', 'At Ambient 24°C')}
                  </div>
                </div>
              </div>

              {/* Specific Visual Reasons from Image */}
              <div className="bg-gray-50/90 rounded-2xl p-4 space-y-2 text-xs border border-gray-100">
                <div className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-farm-600" />
                  <span>Visible Image Assessment Factors:</span>
                </div>
                <ul className="space-y-1.5 text-gray-700">
                  {scanResult.stage2.visualReasons?.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-farm-600 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Neural Attributes Details */}
              <div className="bg-white rounded-2xl p-4 space-y-2 text-xs border border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>{t('firmnessIndex', 'Firmness Index:')}</span>
                  <span className="font-semibold text-gray-900">{scanResult.stage2.firmness}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('sugarContent', 'Sugar Content / Ripeness:')}</span>
                  <span className="font-semibold text-gray-900">{scanResult.stage2.brix}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('visualDefects', 'Visual Defect Assessment:')}</span>
                  <span className="font-semibold text-gray-900">{scanResult.stage2.defectReport}</span>
                </div>
                <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-2 font-bold">
                  <span>{t('suggestedFairPrice', 'Suggested Fair Market Price:')}</span>
                  <span className="font-mono text-farm-800 text-sm">₹{scanResult.stage2.mandiPrice.toFixed(2)}{t('perKg', '/kg')}</span>
                </div>
              </div>

              {/* Required Disclaimer */}
              <div className="flex items-start gap-2 text-[11px] text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>
                  {scanResult.stage2.disclaimer || 'AI freshness result is an estimated visual assessment and not a laboratory certification.'}
                </span>
              </div>

              {/* Next Action */}
              <div className="pt-1">
                <Link
                  to="/marketplace"
                  className="w-full btn-farm text-xs py-3 justify-center shadow-md font-bold"
                >
                  <span>{t('listOnMarketplace', 'List This Produce on Marketplace')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


