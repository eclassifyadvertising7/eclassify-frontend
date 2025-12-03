"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock, AlertCircle, CreditCard, FileText, Package, User } from "lucide-react"
import transactionService from "@/app/services/api/transactionService"
import { toast } from "sonner"
import { formatDateTime } from "@/lib/dateTimeUtils"

export default function TransactionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchTransaction()
    }
  }, [params.id])

  const fetchTransaction = async () => {
    try {
      setLoading(true)
      const response = await transactionService.getTransactionById(params.id)
      if (response.success) {
        setTransaction(response.data)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch transaction details')
      router.push('/billing')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Completed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      processing: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Processing' },
      failed: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Failed' },
      refunded: { color: 'bg-purple-100 text-purple-800', icon: XCircle, label: 'Refunded' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Cancelled' },
      initiated: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Initiated' },
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading transaction details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push('/billing')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Billing
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-primary p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">Transaction Details</h1>
                <p className="text-blue-100">{transaction.transactionNumber}</p>
              </div>
              {getStatusBadge(transaction.status)}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-100">Transaction Type</p>
                <p className="font-medium uppercase">{transaction.transactionType}</p>
              </div>
              <div>
                <p className="text-blue-100">Context</p>
                <p className="font-medium capitalize">{transaction.transactionContext?.replace(/_/g, ' ')}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Amount Info */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Amount Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Transaction Amount</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {transaction.currency || 'INR'} {transaction.amount}
                  </p>
                </div>
                {transaction.hasProration && transaction.prorationAmount > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Proration Amount</p>
                    <p className="text-2xl font-bold text-green-600">
                      {transaction.currency || 'INR'} {transaction.prorationAmount}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Gateway Info */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Gateway Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Gateway</span>
                  <span className="font-medium text-gray-900 uppercase">{transaction.paymentGateway}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transaction Method</span>
                  <span className="font-medium text-gray-900 uppercase">{transaction.transactionMethod}</span>
                </div>
                {transaction.gatewayOrderId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gateway Order ID</span>
                    <span className="font-mono text-xs text-gray-900">{transaction.gatewayOrderId}</span>
                  </div>
                )}
                {transaction.gatewayPaymentId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gateway Payment ID</span>
                    <span className="font-mono text-xs text-gray-900">{transaction.gatewayPaymentId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Payment Metadata */}
            {transaction.manualPaymentMetadata && Object.keys(transaction.manualPaymentMetadata).length > 0 && (
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Payment Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {Object.entries(transaction.manualPaymentMetadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Transaction Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Initiated At</p>
                    <p className="text-base font-medium text-gray-900">
                      {formatDateTime(transaction.initiatedAt, 'datetime')}
                    </p>
                  </div>
                </div>
                {transaction.completedAt && (
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Completed At</p>
                      <p className="text-base font-medium text-gray-900">
                        {formatDateTime(transaction.completedAt, 'datetime')}
                      </p>
                    </div>
                  </div>
                )}
                {transaction.expiresAt && (
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Expires At</p>
                      <p className="text-base font-medium text-gray-900">
                        {formatDateTime(transaction.expiresAt, 'datetime')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transaction.invoice && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FileText className="w-5 h-5 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-700">Invoice</p>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{transaction.invoice.invoiceNumber}</p>
                    <p className="text-xs text-gray-600">
                      Amount: {transaction.currency || 'INR'} {transaction.invoice.totalAmount}
                    </p>
                  </div>
                )}
                {transaction.plan && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Package className="w-5 h-5 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-700">Plan</p>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{transaction.plan.name}</p>
                    <p className="text-xs text-gray-600">Code: {transaction.plan.code}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Verification Info */}
            {transaction.verifiedBy && (
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Details</h3>
                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Transaction Verified</span>
                  </div>
                  {transaction.verifier && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Verified By</span>
                      <span className="font-medium text-gray-900">{transaction.verifier.email}</span>
                    </div>
                  )}
                  {transaction.verifiedAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Verified At</span>
                      <span className="font-medium text-gray-900">
                        {formatDateTime(transaction.verifiedAt, 'datetime')}
                      </span>
                    </div>
                  )}
                  {transaction.verificationNotes && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 font-medium mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{transaction.verificationNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Failure Info */}
            {transaction.status === 'failed' && transaction.failureReason && (
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Failure Details</h3>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center text-red-700 mb-2">
                    <XCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Transaction Failed</span>
                  </div>
                  <p className="text-sm text-gray-700">{transaction.failureReason}</p>
                </div>
              </div>
            )}

            {/* Additional Info */}
            {transaction.ipAddress && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IP Address</span>
                    <span className="font-mono text-xs text-gray-900">{transaction.ipAddress}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
