"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock, AlertCircle, FileText, Download, CreditCard } from "lucide-react"
import invoiceService from "@/app/services/api/invoiceService"
import { toast } from "sonner"
import { formatDateTime } from "@/lib/dateTimeUtils"

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchInvoice()
    }
  }, [params.id])

  const fetchInvoice = async () => {
    try {
      setLoading(true)
      const response = await invoiceService.getInvoiceById(params.id)
      if (response.success) {
        setInvoice(response.data)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch invoice details')
      router.push('/billing')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await invoiceService.downloadInvoice(params.id)
      if (response.success) {
        toast.success('Invoice ready for download')
        console.log('Invoice data:', response.data)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to download invoice')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Paid' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      issued: { color: 'bg-blue-100 text-blue-800', icon: FileText, label: 'Issued' },
      overdue: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Overdue' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Cancelled' },
      refunded: { color: 'bg-purple-100 text-purple-800', icon: XCircle, label: 'Refunded' },
      partially_paid: { color: 'bg-orange-100 text-orange-800', icon: Clock, label: 'Partially Paid' },
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
            <p className="text-gray-600">Loading invoice details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/billing')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Billing
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-primary p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">Invoice</h1>
                <p className="text-blue-100">{invoice.invoiceNumber}</p>
              </div>
              {getStatusBadge(invoice.status)}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-100">Invoice Date</p>
                <p className="font-medium">{formatDateTime(invoice.invoiceDate, 'date')}</p>
              </div>
              {invoice.paymentDate && (
                <div>
                  <p className="text-blue-100">Payment Date</p>
                  <p className="font-medium">{formatDateTime(invoice.paymentDate, 'date')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Customer Info */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill To</h3>
              <div className="space-y-1">
                <p className="text-base font-medium text-gray-900">{invoice.customerName}</p>
                <p className="text-sm text-gray-600">{invoice.customerMobile}</p>
                {invoice.user?.email && (
                  <p className="text-sm text-gray-600">{invoice.user.email}</p>
                )}
              </div>
            </div>

            {/* Plan Details */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{invoice.planName}</p>
                    <p className="text-sm text-gray-600">Code: {invoice.planCode}</p>
                    {invoice.planVersion && (
                      <p className="text-sm text-gray-600">Version: {invoice.planVersion}</p>
                    )}
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {invoice.currency || 'INR'} {invoice.subtotal}
                  </p>
                </div>
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amount Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {invoice.currency || 'INR'} {invoice.subtotal}
                  </span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Discount {invoice.discountPercentage ? `(${invoice.discountPercentage}%)` : ''}
                      {invoice.discountCode && ` - ${invoice.discountCode}`}
                    </span>
                    <span className="font-medium text-green-600">
                      - {invoice.currency || 'INR'} {invoice.discountAmount}
                    </span>
                  </div>
                )}
                {invoice.prorationCredit > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Proration Credit</span>
                    <span className="font-medium text-green-600">
                      - {invoice.currency || 'INR'} {invoice.prorationCredit}
                    </span>
                  </div>
                )}
                {invoice.adjustedSubtotal && invoice.adjustedSubtotal !== invoice.subtotal && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Adjusted Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {invoice.currency || 'INR'} {invoice.adjustedSubtotal}
                    </span>
                  </div>
                )}
                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Tax {invoice.taxPercentage ? `(${invoice.taxPercentage}%)` : ''}
                    </span>
                    <span className="font-medium text-gray-900">
                      {invoice.currency || 'INR'} {invoice.taxAmount}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-gray-900">
                    {invoice.currency || 'INR'} {invoice.totalAmount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-medium text-green-600">
                    {invoice.currency || 'INR'} {invoice.amountPaid}
                  </span>
                </div>
                {invoice.amountDue > 0 && (
                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-red-600">Amount Due</span>
                    <span className="text-red-600">
                      {invoice.currency || 'INR'} {invoice.amountDue}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            {invoice.paymentMethod && (
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-900 uppercase">{invoice.paymentMethod}</span>
                  </div>
                  {invoice.paymentDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Date</span>
                      <span className="font-medium text-gray-900">
                        {formatDateTime(invoice.paymentDate, 'datetime')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Transactions */}
            {invoice.transactions && invoice.transactions.length > 0 && (
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Transactions</h3>
                <div className="space-y-2">
                  {invoice.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.transactionNumber}</p>
                        <p className="text-xs text-gray-600">
                          {formatDateTime(transaction.createdAt, 'datetime')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {invoice.currency || 'INR'} {transaction.amount}
                        </p>
                        <p className="text-xs text-gray-600 capitalize">{transaction.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {(invoice.notes || invoice.customerNotes) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                {invoice.customerNotes && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Customer Notes</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{invoice.customerNotes}</p>
                  </div>
                )}
                {invoice.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Additional Notes</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{invoice.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
