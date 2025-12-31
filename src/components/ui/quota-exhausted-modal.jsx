"use client"
import { AlertTriangle, X, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"

export default function QuotaExhaustedModal({ 
  isOpen, 
  onClose
}) {
  const router = useRouter()

  if (!isOpen) return null

  const handlePurchasePlan = () => {
    onClose()
    router.push("/pricing")
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        style={{ animation: 'zoomIn 0.2s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Listing Quota Exhausted</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-6 ml-13">
          You need to purchase additional listing slots to submit this listing for approval. 
          Your listing has been saved as a draft and you can submit it once you have available quota.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={handlePurchasePlan}
            className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Purchase Plan
          </button>
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
