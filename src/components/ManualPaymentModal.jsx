"use client"

import { useState, useEffect } from "react"
import { X, Upload, CheckCircle, AlertCircle } from "lucide-react"
import manualPaymentService from "@/app/services/api/manualPaymentService"
import { toast } from "sonner"

export default function ManualPaymentModal({ isOpen, onClose, plan }) {
  const [step, setStep] = useState(1) // 1: QR Code, 2: Payment Form, 3: Success
  const [formData, setFormData] = useState({
    upiId: "",
    transactionId: "",
    paymentProof: null
  })
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [qrCodeData, setQrCodeData] = useState(null)
  const [qrLoading, setQrLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchQRCode()
    }
  }, [isOpen])

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  const fetchQRCode = async () => {
    try {
      setQrLoading(true)
      const response = await manualPaymentService.getQRCode()
      if (response.success && response.data) {
        setQrCodeData(response.data)
      } else {
        setQrCodeData(null)
      }
    } catch (error) {
      console.error("Error fetching QR code:", error)
      setQrCodeData(null)
    } finally {
      setQrLoading(false)
    }
  }

  if (!isOpen || !plan) return null

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB")
        return
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, and PDF files are allowed")
        return
      }

      setFormData({ ...formData, paymentProof: file })
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        setPreviewUrl(null)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.upiId || !formData.transactionId) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      
      const formDataToSend = new FormData()
      formDataToSend.append('planId', plan.id)
      formDataToSend.append('upiId', formData.upiId)
      formDataToSend.append('transactionId', formData.transactionId)
      if (formData.paymentProof) {
        formDataToSend.append('paymentProof', formData.paymentProof)
      }

      const response = await manualPaymentService.createManualPayment(formDataToSend)
      
      if (response.success) {
        setStep(3)
        toast.success("Payment submitted successfully! Awaiting admin verification.")
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit payment")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setFormData({ upiId: "", transactionId: "", paymentProof: null })
    setPreviewUrl(null)
    setQrCodeData(null)
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ animation: 'zoomIn 0.2s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 ? "Scan & Pay" : step === 2 ? "Complete Payment" : "Payment Submitted"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{plan.name} - ₹{plan.finalPrice}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: QR Code */}
          {step === 1 && (
            <div className="space-y-6">
              {qrLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-gray-600">Loading QR code...</p>
                </div>
              ) : qrCodeData ? (
                <>
                  <div className="text-center">
                    <div className="inline-block p-4 bg-gray-50 rounded-2xl">
                      <img
                        src={qrCodeData.mediaUrl}
                        alt="UPI QR Code"
                        className="w-64 h-64 object-contain rounded-xl"
                      />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-gray-900">Scan QR Code to Pay</p>
                    {qrCodeData.caption && (
                      <p className="text-sm text-gray-600 mt-1">UPI ID: <span className="font-mono font-semibold">{qrCodeData.caption}</span></p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">Use any UPI app to scan and pay ₹{plan.finalPrice}</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Important Instructions:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                          <li>Scan the QR code above</li>
                          <li>Pay exactly ₹{plan.finalPrice}</li>
                          <li>Save the transaction ID after payment</li>
                          <li>Click "Complete Payment" below to submit details</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition-colors"
                  >
                    I've Made the Payment - Continue
                  </button>
                </>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Not Available</h3>
                  <p className="text-gray-600 mb-6">Payment QR code is not configured yet. Please contact support.</p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Payment Form */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="yourname@paytm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter the UPI ID you used for payment</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  placeholder="T2025011512345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Find this in your UPI app's transaction history</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Proof (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    id="paymentProof"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="paymentProof" className="cursor-pointer">
                    {previewUrl ? (
                      <div className="space-y-3">
                        <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                        <p className="text-sm text-gray-600">{formData.paymentProof?.name}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            setFormData({ ...formData, paymentProof: null })
                            setPreviewUrl(null)
                          }}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-600">
                          Click to upload screenshot
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG or PDF (Max 5MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Verification Required</p>
                    <p>Your payment will be verified by our admin team. You'll receive a notification once your subscription is activated (usually within 24 hours).</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Payment"}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center space-y-6 py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Submitted!</h3>
                <p className="text-gray-600">
                  Your payment details have been submitted successfully.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <p className="text-sm text-blue-800 font-semibold mb-2">What happens next?</p>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Our admin team will verify your payment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>You'll receive a notification once verified (usually within 24 hours)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>Your subscription will be activated automatically</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">4.</span>
                    <span>You can check status in your Billing section</span>
                  </li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => window.location.href = '/billing'}
                  className="flex-1 py-3 px-6 border border-primary text-primary rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  View My Subscriptions
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
