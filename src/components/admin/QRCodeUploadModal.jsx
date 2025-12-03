"use client"

import { useState, useEffect } from "react"
import { X, Upload, Image as ImageIcon } from "lucide-react"
import manualPaymentService from "@/app/services/api/manualPaymentService"
import { toast } from "sonner"

export default function QRCodeUploadModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    qrCode: null,
    upiId: ""
  })
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)

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

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB")
        return
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG and PNG files are allowed")
        return
      }

      setFormData({ ...formData, qrCode: file })
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.qrCode) {
      toast.error("Please select a QR code image")
      return
    }

    if (!formData.upiId) {
      toast.error("Please enter UPI ID")
      return
    }

    try {
      setLoading(true)
      
      const formDataToSend = new FormData()
      formDataToSend.append('qrCode', formData.qrCode)
      formDataToSend.append('caption', formData.upiId) // UPI ID stored as caption

      const response = await manualPaymentService.uploadQRCode(formDataToSend)
      
      if (response.success) {
        toast.success(response.message || "QR code uploaded successfully")
        handleClose()
        if (onSuccess) onSuccess()
      }
    } catch (error) {
      toast.error(error.message || "Failed to upload QR code")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ qrCode: null, upiId: "" })
    setPreviewUrl(null)
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
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{ animation: 'zoomIn 0.2s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload QR Code</h2>
            <p className="text-sm text-gray-600 mt-1">Upload payment QR code for manual subscriptions</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* UPI ID Input */}
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
            <p className="text-xs text-gray-500 mt-1">This UPI ID will be displayed to users</p>
          </div>

          {/* QR Code Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QR Code Image <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                id="qrCodeFile"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <label htmlFor="qrCodeFile" className="cursor-pointer">
                {previewUrl ? (
                  <div className="space-y-3">
                    <img 
                      src={previewUrl} 
                      alt="QR Code Preview" 
                      className="max-h-64 mx-auto rounded-lg border border-gray-200" 
                    />
                    <p className="text-sm text-gray-600">{formData.qrCode?.name}</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setFormData({ ...formData, qrCode: null })
                        setPreviewUrl(null)
                      }}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">
                      Click to upload QR code
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG or PNG (Max 2MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Note:</span> This QR code will be shown to all users when they subscribe to a plan. Make sure it's a valid UPI payment QR code.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "Upload QR Code"}
            </button>
          </div>
        </form>
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
