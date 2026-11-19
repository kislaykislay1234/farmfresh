import React, { useState } from 'react'
import { ShieldCheck, CheckCircle2, AlertCircle, X, CreditCard, Lock, RefreshCw } from 'lucide-react'
import { paymentService, PAYMENT_MODES } from '../../lib/payment'
import { useLanguage } from '../../contexts/LanguageContext'
import toast from 'react-hot-toast'

export const PaymentModal = ({ isOpen, onClose, amount, purpose, relatedType, relatedId, onSuccess }) => {
  const [selectedMode, setSelectedMode] = useState('upi')
  const [paymentState, setPaymentState] = useState('idle') // idle | processing | success | failed
  const [upiId, setUpiId] = useState('farmer@upi')
  const { t } = useLanguage()

  if (!isOpen) return null

  const handleStartPayment = async (simulateFailure = false) => {
    setPaymentState('processing')

    setTimeout(async () => {
      if (simulateFailure) {
        setPaymentState('failed')
        toast.error('Payment declined. Please retry safely.')
        return
      }

      try {
        const result = await paymentService.processPayment({
          amount,
          purpose,
          relatedType,
          relatedId,
          paymentMode: selectedMode,
        })

        setPaymentState('success')
        toast.success(`Payment of ₹${amount.toLocaleString()} successful!`)

        setTimeout(() => {
          setPaymentState('idle')
          if (onSuccess) onSuccess(result)
          onClose()
        }, 1200)
      } catch (err) {
        setPaymentState('failed')
        toast.error('Transaction error: ' + err.message)
      }
    }, 1600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl border border-gray-100 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-farm-600 flex items-center justify-center text-white font-bold text-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">{t('paymentModalTitle')}</h3>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> 256-bit Encrypted SSL
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="bg-farm-50/80 p-4 rounded-2xl border border-farm-200 text-center space-y-0.5">
          <span className="text-xs text-farm-800 font-medium">{purpose || t('payableTotal')}</span>
          <div className="font-mono font-extrabold text-3xl text-farm-900">
            ₹{Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-farm-700 block">{t('paymentModalSubtitle')}</span>
        </div>

        {/* Payment Processing Spinner State */}
        {paymentState === 'processing' && (
          <div className="py-8 text-center space-y-3">
            <RefreshCw className="w-10 h-10 text-farm-600 animate-spin mx-auto" />
            <h4 className="font-bold text-sm text-gray-900">{t('loading')}</h4>
            <p className="text-xs text-gray-500">{t('escrowLocked')}</p>
          </div>
        )}

        {/* Success State */}
        {paymentState === 'success' && (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-bold text-base text-gray-900">{t('paymentSuccessTitle')}</h4>
            <p className="text-xs text-emerald-700 font-medium">{t('paymentSuccessDesc')}</p>
          </div>
        )}

        {/* Failed State */}
        {paymentState === 'failed' && (
          <div className="py-6 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h4 className="font-bold text-sm text-gray-900">{t('failed')}</h4>
            <p className="text-xs text-gray-500">Transaction declined. Please try again.</p>
            <button
              onClick={() => setPaymentState('idle')}
              className="btn-farm text-xs py-2 px-4"
            >
              {t('confirm')}
            </button>
          </div>
        )}

        {/* Payment Modes Selector (Idle State) */}
        {paymentState === 'idle' && (
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="block font-semibold text-gray-700">{t('selectPaymentMethod')}:</label>
              <div className="space-y-2">
                {PAYMENT_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedMode === mode.id
                        ? 'bg-farm-50 border-farm-500 ring-2 ring-farm-500/20 text-farm-900 font-bold'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{mode.icon}</span>
                      <span>{mode.name}</span>
                    </span>
                    {selectedMode === mode.id && <span className="w-2 h-2 rounded-full bg-farm-600" />}
                  </button>
                ))}
              </div>
            </div>

            {selectedMode === 'upi' && (
              <div>
                <label className="block font-semibold text-gray-700 mb-1">{t('upiIdLbl')}:</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="input-farm font-mono text-xs"
                  placeholder="name@upi"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => handleStartPayment(false)}
                className="w-full btn-farm text-xs py-3 justify-center shadow-md font-bold"
              >
                <span>{t('paySecurelyBtn')} (₹{Number(amount).toLocaleString()})</span>
              </button>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <button
                  type="button"
                  onClick={() => handleStartPayment(true)}
                  className="text-gray-400 hover:text-red-600 underline"
                >
                  Test Fail
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 font-medium"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
