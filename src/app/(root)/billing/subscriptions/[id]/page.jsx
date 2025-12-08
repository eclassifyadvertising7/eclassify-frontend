"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock, AlertCircle, Package } from "lucide-react"
import subscriptionService from "@/app/services/api/subscriptionService"
import { toast } from "sonner"
import { formatDateTime } from "@/lib/dateTimeUtils"
import Header from "@/components/Header"
import FooterSection from "@/components/Footer"

export default function SubscriptionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchSubscription()
    }
  }, [params.id])

  const fetchSubscription = async () => {
    try {
      setLoading(true)
      const response = await subscriptionService.getMySubscriptionById(params.id)
      if (response.success) {
        setSubscription(response.data)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch subscription details')
      router.push('/billing')
    } finally {
      setLoading(false)
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
      <>
        <Header />
        <section className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-gray-600">Loading subscription details...</p>
            </div>
          </div>
        </section>
        <FooterSection />
      </>
    )
  }

  if (!subscription) {
    return null
  }

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gray-50 py-8">
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">{subscription.planName}</h1>
                <p className="text-blue-100">Subscription Details</p>
              </div>
              {getStatusBadge(subscription.status)}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Pricing Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Plan Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subscription.currency || 'INR'} {subscription.finalPrice}
                </p>
                {subscription.basePrice && subscription.basePrice !== subscription.finalPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    {subscription.currency || 'INR'} {subscription.basePrice}
                  </p>
                )}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subscription.currency || 'INR'} {subscription.amountPaid}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Duration</p>
                <p className="text-2xl font-bold text-gray-900">{subscription.durationDays} days</p>
              </div>
            </div>

            {/* Dates */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Period</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Features */}
            {subscription.features && Object.keys(subscription.features).length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(subscription.features).map(([key, value]) => (
                    value === true && (
                      <div key={key} className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Quotas */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Quotas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {subscription.listingQuotaLimit !== undefined && subscription.listingQuotaLimit !== null && (
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{subscription.listingQuotaLimit}</p>
                    <p className="text-xs text-gray-600 mt-1">Listings per {subscription.listingQuotaRollingDays || 30} days</p>
                  </div>
                )}
                {subscription.maxActiveListings !== undefined && subscription.maxActiveListings !== null && (
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{subscription.maxActiveListings}</p>
                    <p className="text-xs text-gray-600 mt-1">Active Listings</p>
                  </div>
                )}
                {subscription.maxFeaturedListings !== undefined && subscription.maxFeaturedListings !== null && (
                  <div className={`text-center p-3 rounded-lg ${subscription.maxFeaturedListings > 0 ? 'bg-purple-50' : 'bg-gray-100 opacity-60'}`}>
                    <p className={`text-2xl font-bold ${subscription.maxFeaturedListings > 0 ? 'text-purple-600' : 'text-gray-400'}`}>
                      {subscription.maxFeaturedListings}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Featured Listings</p>
                    {subscription.maxFeaturedListings === 0 && (
                      <p className="text-xs text-gray-500 mt-1">Upgrade to unlock</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            {subscription.paymentMethod && (
              <div className="border-t border-gray-200 pt-6">
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
                </div>
              </div>
            )}

            {/* Notes */}
            {subscription.notes && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                <p className="text-sm text-gray-600">{subscription.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </section>
      <FooterSection />
    </>
  )
}
