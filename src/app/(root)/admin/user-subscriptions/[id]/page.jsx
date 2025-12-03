"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock, AlertCircle, User, Package, CreditCard, Edit2 } from "lucide-react"
import subscriptionService from "@/app/services/api/subscriptionService"
import { toast } from "sonner"
import { formatDateTime } from "@/lib/dateTimeUtils"
import ConfirmModal from "@/components/ui/confirm-modal"

export default function AdminSubscriptionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showExtendModal, setShowExtendModal] = useState(false)
  const [extensionDays, setExtensionDays] = useState(30)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchSubscription()
    }
  }, [params.id])

  const fetchSubscription = async () => {
    try {
      setLoading(true)
      const response = await subscriptionService.getUserSubscriptionById(params.id)
      if (response.success) {
        setSubscription(response.data)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch subscription details')
      router.push('/admin/user-subscriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleExtendSubscription = async () => {
    try {
      const response = await subscriptionService.extendSubscription(params.id, extensionDays)
      if (response.success) {
        toast.success(`Subscription extended by ${extensionDays} days`)
        setShowExtendModal(false)
        fetchSubscription()
      }
    } catch (error) {
      toast.error(error.message || 'Failed to extend subscription')
    }
  }

  const handleUpdateStatus = async () => {
    try {
      const response = await subscriptionService.updateUserSubscriptionStatus(params.id, newStatus)
      if (response.success) {
        toast.success('Subscription status updated successfully')
        setShowStatusModal(false)
        fetchSubscription()
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update status')
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-1.5" />
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    )
  }

  if (!subscription) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/admin/user-subscriptions')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to User Subscriptions
        </button>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowStatusModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Update Status</span>
          </button>
          <button
            onClick={() => setShowExtendModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Extend Subscription</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-primary p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{subscription.planName}</h1>
              <p className="text-blue-100">Subscription ID: {subscription.id}</p>
            </div>
            {getStatusBadge(subscription.status)}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              User Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-base font-medium text-gray-900">{subscription.user?.fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mobile</p>
                <p className="text-base font-medium text-gray-900">{subscription.user?.mobile || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium text-gray-900">{subscription.user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Pricing Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Base Price</p>
                <p className="text-xl font-bold text-gray-900">
                  {subscription.currency || 'INR'} {subscription.basePrice}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Discount</p>
                <p className="text-xl font-bold text-green-600">
                  - {subscription.currency || 'INR'} {subscription.discountAmount || '0.00'}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Final Price</p>
                <p className="text-xl font-bold text-blue-600">
                  {subscription.currency || 'INR'} {subscription.finalPrice}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
                <p className="text-xl font-bold text-green-600">
                  {subscription.currency || 'INR'} {subscription.amountPaid}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Period */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Subscription Period
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-base font-medium text-gray-900">
                    {formatDateTime(subscription.startsAt, 'datetime')}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="text-base font-medium text-gray-900">
                    {formatDateTime(subscription.endsAt, 'datetime')}
                  </p>
                </div>
              </div>
              {subscription.activatedAt && (
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Activated At</p>
                    <p className="text-base font-medium text-gray-900">
                      {formatDateTime(subscription.activatedAt, 'datetime')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Plan Details */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Plan Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{subscription.durationDays}</p>
                <p className="text-xs text-gray-600 mt-1">Duration (days)</p>
              </div>
              {subscription.maxActiveListings && (
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{subscription.maxActiveListings}</p>
                  <p className="text-xs text-gray-600 mt-1">Active Listings</p>
                </div>
              )}
              {subscription.maxFeaturedListings && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{subscription.maxFeaturedListings}</p>
                  <p className="text-xs text-gray-600 mt-1">Featured Listings</p>
                </div>
              )}
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-600">v{subscription.planVersion}</p>
                <p className="text-xs text-gray-600 mt-1">Plan Version</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {subscription.paymentMethod && (
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <span className="text-sm font-medium text-gray-900 uppercase">{subscription.paymentMethod}</span>
                </div>
                {subscription.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transaction ID</span>
                    <span className="text-sm font-mono text-gray-900">{subscription.transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Auto Renew</span>
                  <span className="text-sm font-medium text-gray-900">{subscription.autoRenew ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Is Trial</span>
                  <span className="text-sm font-medium text-gray-900">{subscription.isTrial ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {subscription.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">{subscription.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Extend Subscription Modal */}
      <ConfirmModal
        isOpen={showExtendModal}
        onClose={() => setShowExtendModal(false)}
        onConfirm={handleExtendSubscription}
        title="Extend Subscription"
        message={
          <div>
            <p className="mb-4">How many days would you like to extend this subscription?</p>
            <input
              type="number"
              value={extensionDays}
              onChange={(e) => setExtensionDays(parseInt(e.target.value) || 0)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        }
        confirmText="Extend"
        cancelText="Cancel"
        variant="primary"
      />

      {/* Update Status Modal */}
      <ConfirmModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleUpdateStatus}
        title="Update Subscription Status"
        message={
          <div>
            <p className="mb-4">Select new status for this subscription:</p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select status...</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        }
        confirmText="Update Status"
        cancelText="Cancel"
        variant="primary"
      />
    </div>
  )
}
