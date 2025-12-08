"use client"

import { useState, useEffect } from "react"
import { Package, FileText, CreditCard, Calendar, CheckCircle, XCircle, Clock, AlertCircle, Download, Eye } from "lucide-react"
import subscriptionService from "@/app/services/api/subscriptionService"
import invoiceService from "@/app/services/api/invoiceService"
import transactionService from "@/app/services/api/transactionService"
import { toast } from "sonner"
import { formatDateTime } from "@/lib/dateTimeUtils"
import ConfirmModal from "@/components/ui/confirm-modal"
import Header from "@/components/Header"
import FooterSection from "@/components/Footer"

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("subscriptions")
  const [subscriptions, setSubscriptions] = useState([])
  const [invoices, setInvoices] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelModal, setCancelModal] = useState({ isOpen: false, subscriptionId: null, planName: '' })
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    if (activeTab === "subscriptions") {
      fetchSubscriptions()
    } else if (activeTab === "invoices") {
      fetchInvoices()
    } else if (activeTab === "transactions") {
      fetchTransactions()
    }
  }, [activeTab])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const response = await subscriptionService.getMySubscriptions()
      if (response.success) {
        setSubscriptions(response.data || [])
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch subscriptions')
    } finally {
      setLoading(false)
    }
  }

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const response = await invoiceService.getMyInvoices()
      if (response.success) {
        setInvoices(response.data || [])
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await transactionService.getMyTransactions()
      if (response.success) {
        setTransactions(response.data || [])
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      const response = await subscriptionService.cancelSubscription(cancelModal.subscriptionId, cancelReason)
      if (response.success) {
        toast.success('Subscription cancelled successfully')
        fetchSubscriptions()
        setCancelModal({ isOpen: false, subscriptionId: null, planName: '' })
        setCancelReason('')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to cancel subscription')
    }
  }

  const handleDownloadInvoice = async (invoiceId) => {
    try {
      const response = await invoiceService.downloadInvoice(invoiceId)
      if (response.success) {
        toast.success('Invoice ready for download')
        // In a real implementation, you would generate and download the PDF here
        console.log('Invoice data:', response.data)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to download invoice')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      expired: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Expired' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
      suspended: { color: 'bg-orange-100 text-orange-800', icon: AlertCircle, label: 'Suspended' },
    }
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const getInvoiceStatusBadge = (status) => {
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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const getTransactionStatusBadge = (status) => {
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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const tabs = [
    { id: "subscriptions", label: "Subscriptions", icon: Package },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "transactions", label: "Transactions", icon: CreditCard },
  ]

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
          <p className="mt-2 text-gray-600">Manage your subscriptions, invoices, and transactions</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "subscriptions" && (
              <div>
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Loading subscriptions...</p>
                  </div>
                ) : subscriptions.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subscriptions Yet</h3>
                    <p className="text-gray-600 mb-6">You haven't subscribed to any plans yet.</p>
                    <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors">
                      Browse Plans
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subscriptions.map((subscription) => (
                      <div key={subscription.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">{subscription.planName}</h3>
                              {getStatusBadge(subscription.status)}
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                v{subscription.planVersion}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              <div>
                                <p className="text-sm text-gray-500">Price</p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {subscription.currency || 'INR'} {subscription.finalPrice}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Start Date</p>
                                <p className="text-sm font-medium text-gray-900 flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {formatDateTime(subscription.startsAt, 'date')}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">End Date</p>
                                <p className="text-sm font-medium text-gray-900 flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {formatDateTime(subscription.endsAt, 'date')}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex flex-col space-y-2">
                            <button 
                              onClick={() => window.location.href = `/billing/subscriptions/${subscription.id}`}
                              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              View Details
                            </button>
                            {/* {subscription.status === 'active' && (
                              <button 
                                onClick={() => setCancelModal({ 
                                  isOpen: true, 
                                  subscriptionId: subscription.id, 
                                  planName: subscription.planName 
                                })}
                                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                Cancel
                              </button>
                            )} */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "invoices" && (
              <div>
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Loading invoices...</p>
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Invoices Yet</h3>
                    <p className="text-gray-600">Your invoices will appear here once you make a purchase.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                              {getInvoiceStatusBadge(invoice.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{invoice.planName}</p>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Invoice Date</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {formatDateTime(invoice.invoiceDate, 'date')}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {invoice.currency || 'INR'} {invoice.totalAmount}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Amount Paid</p>
                                <p className="text-sm font-medium text-green-600">
                                  {invoice.currency || 'INR'} {invoice.amountPaid}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Amount Due</p>
                                <p className="text-sm font-medium text-red-600">
                                  {invoice.currency || 'INR'} {invoice.amountDue}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex flex-col space-y-2">
                            <button 
                              onClick={() => window.location.href = `/billing/invoices/${invoice.id}`}
                              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-blue-50 transition-colors flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </button>
                            <button 
                              onClick={() => handleDownloadInvoice(invoice.id)}
                              className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "transactions" && (
              <div>
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Loading transactions...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
                    <p className="text-gray-600">Your transaction history will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{transaction.transactionNumber}</h3>
                              {getTransactionStatusBadge(transaction.status)}
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded uppercase">
                                {transaction.transactionType}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                              <div>
                                <p className="text-sm text-gray-500">Amount</p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {transaction.currency || 'INR'} {transaction.amount}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Payment Gateway</p>
                                <p className="text-sm font-medium text-gray-900 uppercase">
                                  {transaction.paymentGateway}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Initiated At</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {formatDateTime(transaction.initiatedAt, 'datetime')}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Completed At</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {transaction.completedAt ? formatDateTime(transaction.completedAt, 'datetime') : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <button 
                              onClick={() => window.location.href = `/billing/transactions/${transaction.id}`}
                              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-blue-50 transition-colors flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        </div>
      </section>
      <FooterSection />
      
      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={cancelModal.isOpen}
        onClose={() => {
          setCancelModal({ isOpen: false, subscriptionId: null, planName: '' })
          setCancelReason('')
        }}
        onConfirm={handleCancelSubscription}
        title="Cancel Subscription"
        message={
          <div>
            <p className="mb-4">Are you sure you want to cancel "{cancelModal.planName}"?</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please tell us why you're cancelling (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>
        }
        confirmText="Cancel Subscription"
        cancelText="Keep Subscription"
        variant="danger"
      />
    </>
  )
}
