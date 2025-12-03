"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle, Clock, User, CreditCard, Calendar, FileText, Image as ImageIcon, Download } from "lucide-react"
import manualPaymentService from "@/app/services/api/manualPaymentService"
import { toast } from "sonner"
import { formatDateTime } from "@/lib/dateTimeUtils"
import ConfirmModal from "@/components/ui/confirm-modal"

export default function ManualPaymentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [verifyModal, setVerifyModal] = useState({ 
    isOpen: false, 
    approved: true,
    notes: ''
  })

  useEffect(() => {
    if (params.id) {
      fetchPaymentDetails()
    }
  }, [params.id])

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true)
      const response = await manualPaymentService.getManualPaymentById(params.id)
      if (response.success) {
        setPayment(response.data)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch payment details')
      router.push('/admin/manual-payments')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    try {
      const response = await manualPaymentService.verifyManualPayment(
        params.id,
        verifyModal.approved,
        verifyModal.notes || ""
      )
      if (response.success) {
        toast.success(verifyModal.approved ? 'Payment approved successfully' : 'Payment rejected successfully')
        fetchPaymentDetails()
        setVerifyModal({ isOpen: false, approved: true, notes: '' })
      }
    } catch (error) {
      toast.error(error.message || 'Failed to verify payment')
    }
  }

  const openVerifyModal = (approved) => {
    setVerifyModal({
      isOpen: true,
      approved,
      notes: ''
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
    }
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-1.5" />
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading payment details...</p>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Payment not found</p>
      </div>
    )
  }

  const paymentProof = payment.transaction?.manualPaymentMetadata?.paymentProof

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/admin/manual-payments')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
            <p className="text-gray-600 mt-1">Subscription ID: {payment.id}</p>
          </div>
        </div>
        <div>
          {getStatusBadge(payment.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">User Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="text-base font-medium text-gray-900">{payment.user?.fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mobile</p>
                <p className="text-base font-medium text-gray-900">{payment.user?.mobile || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-base font-medium text-gray-900">{payment.user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">User ID</p>
                <p className="text-base font-medium text-gray-900">{payment.userId}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">UPI ID</p>
                <p className="text-base font-medium text-gray-900 font-mono">
                  {payment.transaction?.manualPaymentMetadata?.upiId || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Transaction ID</p>
                <p className="text-base font-medium text-gray-900 font-mono">
                  {payment.transaction?.gatewayPaymentId || payment.transactionId || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-base font-medium text-gray-900">
                  ₹{payment.transaction?.amount || payment.finalPrice}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="text-base font-medium text-gray-900 capitalize">
                  {payment.paymentMethod || 'Manual'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submitted At</p>
                <p className="text-base font-medium text-gray-900">
                  {formatDateTime(payment.transaction?.manualPaymentMetadata?.submittedAt || payment.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Transaction Status</p>
                <p className="text-base font-medium text-gray-900 capitalize">
                  {payment.transaction?.status || 'Pending'}
                </p>
              </div>
            </div>
          </div>

          {/* Plan Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Plan Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Plan Name</p>
                <p className="text-base font-medium text-gray-900">{payment.planName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Plan Code</p>
                <p className="text-base font-medium text-gray-900">{payment.planCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Plan Version</p>
                <p className="text-base font-medium text-gray-900">v{payment.planVersion}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Final Price</p>
                <p className="text-base font-medium text-gray-900">₹{payment.finalPrice}</p>
              </div>
              {payment.planDetails && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-base font-medium text-gray-900">
                      {payment.planDetails.durationDays} days
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Base Price</p>
                    <p className="text-base font-medium text-gray-900">
                      ₹{payment.planDetails.basePrice}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Subscription Dates */}
          {payment.status === 'active' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Subscription Period</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="text-base font-medium text-gray-900">
                    {formatDateTime(payment.startsAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="text-base font-medium text-gray-900">
                    {formatDateTime(payment.endsAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Activated At</p>
                  <p className="text-base font-medium text-gray-900">
                    {formatDateTime(payment.activatedAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Proof */}
          {paymentProof && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <ImageIcon className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Payment Proof</h3>
              </div>
              <div className="space-y-3">
                {paymentProof.mimeType?.startsWith('image/') ? (
                  <img
                    src={paymentProof.fullUrl}
                    alt="Payment Proof"
                    className="w-full rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">File:</span> {paymentProof.originalName}</p>
                  <p><span className="font-medium">Type:</span> {paymentProof.mimeType}</p>
                  <p><span className="font-medium">Size:</span> {(paymentProof.size / 1024).toFixed(2)} KB</p>
                </div>
                <a
                  href={paymentProof.fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          )}

          {/* Actions */}
          {payment.status === 'pending' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => openVerifyModal(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Accept Payment</span>
                </button>
                <button
                  onClick={() => openVerifyModal(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  <span>Reject Payment</span>
                </button>
              </div>
            </div>
          )}

          {/* Invoice Information */}
          {payment.invoice && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Invoice Number</p>
                  <p className="text-base font-medium text-gray-900">{payment.invoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-base font-medium text-gray-900">₹{payment.invoice.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="text-base font-medium text-gray-900">₹{payment.invoice.amountPaid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Due</p>
                  <p className="text-base font-medium text-gray-900">₹{payment.invoice.amountDue}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-base font-medium text-gray-900 capitalize">{payment.invoice.status}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {payment.notes && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
              <p className="text-sm text-gray-700">{payment.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Verify/Reject Confirmation Modal */}
      <ConfirmModal
        isOpen={verifyModal.isOpen}
        onClose={() => setVerifyModal({ isOpen: false, approved: true, notes: '' })}
        onConfirm={handleVerify}
        title={verifyModal.approved ? "Accept Payment" : "Reject Payment"}
        message={
          verifyModal.approved 
            ? `Are you sure you want to accept this payment? The subscription will be activated immediately.`
            : `Are you sure you want to reject this payment? The subscription will be cancelled.`
        }
        confirmText={verifyModal.approved ? "Accept" : "Reject"}
        cancelText="Cancel"
        variant={verifyModal.approved ? "success" : "danger"}
      >
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={verifyModal.notes || ''}
            onChange={(e) => setVerifyModal({ ...verifyModal, notes: e.target.value })}
            placeholder="Add verification notes..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </ConfirmModal>
    </div>
  )
}
