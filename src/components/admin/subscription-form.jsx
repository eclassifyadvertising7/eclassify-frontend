"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import subscriptionService from "@/app/services/api/subscriptionService"
import { toast } from "sonner"

export default function SubscriptionForm({ planId = null, mode = 'create' }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Basic Info
    planCode: '',
    name: '',
    description: '',
    tagline: '',
    
    // Pricing
    basePrice: '',
    discountAmount: '0',
    currency: 'INR',
    billingCycle: 'monthly',
    durationDays: 30,
    
    // Display
    showOriginalPrice: false,
    showOfferBadge: false,
    offerBadgeText: '',
    sortOrder: 1,
    
    // Quotas
    maxTotalListings: 10,
    maxActiveListings: 3,
    listingQuotaLimit: 10,
    listingQuotaRollingDays: 30,
    
    // Featured
    maxFeaturedListings: 0,
    maxBoostedListings: 0,
    maxSpotlightListings: 0,
    maxHomepageListings: 0,
    featuredDays: 0,
    boostedDays: 0,
    spotlightDays: 0,
    
    // Visibility & Priority
    priorityScore: 50,
    searchBoostMultiplier: 1.0,
    recommendationBoostMultiplier: 1.0,
    crossCityVisibility: false,
    nationalVisibility: false,
    
    // Renewal
    autoRenewal: true,
    maxRenewals: 12,
    listingDurationDays: 30,
    autoRefreshEnabled: false,
    refreshFrequencyDays: 7,
    manualRefreshPerCycle: 0,
    
    // Support & Features
    supportLevel: 'standard',
    features: {
      showPhoneNumber: true,
      showWhatsapp: true,
      allowChat: true,
      priorityChatSupport: false,
      analyticsEnabled: false,
      viewCountVisible: true,
      trackLeads: false,
      sellerVerificationIncluded: false,
      trustBadge: false,
      warrantyBadge: false,
      geoTargetingEnabled: false,
      radiusTargetingKm: 0,
      socialSharingEnabled: true,
      createPromotions: false,
      autoApproval: false,
      priorityModeration: false,
      appealRejectedListings: true
    },
    
    // Status
    isActive: true,
    isPublic: true,
    isDefault: false,
    isFeatured: false,
    
    // Additional
    termsAndConditions: '',
    internalNotes: ''
  })

  useEffect(() => {
    if (planId && mode !== 'create') {
      fetchPlanData()
    }
  }, [planId, mode])

  const fetchPlanData = async () => {
    try {
      setLoading(true)
      const response = await subscriptionService.getPlanById(planId)
      if (response.success && response.data) {
        setFormData({
          ...formData,
          ...response.data,
          features: response.data.features || formData.features
        })
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch plan data')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Calculate final price automatically
  const calculateFinalPrice = () => {
    const base = parseFloat(formData.basePrice) || 0
    const discount = parseFloat(formData.discountAmount) || 0
    return Math.max(0, base - discount).toFixed(2)
  }

  // Prevent scroll wheel from changing number inputs
  const handleWheel = (e) => {
    e.target.blur()
  }

  const handleFeatureChange = (featureName, value) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureName]: value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Prepare data
      const finalPrice = calculateFinalPrice()
      const submitData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice) || 0,
        discountAmount: parseFloat(formData.discountAmount) || 0,
        finalPrice: parseFloat(finalPrice) || 0,
        durationDays: parseInt(formData.durationDays) || 30,
        maxTotalListings: parseInt(formData.maxTotalListings) || 0,
        maxActiveListings: parseInt(formData.maxActiveListings) || 0,
        listingQuotaLimit: parseInt(formData.listingQuotaLimit) || 0,
        listingQuotaRollingDays: parseInt(formData.listingQuotaRollingDays) || 30,
        maxFeaturedListings: parseInt(formData.maxFeaturedListings) || 0,
        maxBoostedListings: parseInt(formData.maxBoostedListings) || 0,
        maxSpotlightListings: parseInt(formData.maxSpotlightListings) || 0,
        maxHomepageListings: parseInt(formData.maxHomepageListings) || 0,
        featuredDays: parseInt(formData.featuredDays) || 0,
        boostedDays: parseInt(formData.boostedDays) || 0,
        spotlightDays: parseInt(formData.spotlightDays) || 0,
        priorityScore: parseInt(formData.priorityScore) || 50,
        searchBoostMultiplier: parseFloat(formData.searchBoostMultiplier) || 1.0,
        recommendationBoostMultiplier: parseFloat(formData.recommendationBoostMultiplier) || 1.0,
        maxRenewals: parseInt(formData.maxRenewals) || 12,
        listingDurationDays: parseInt(formData.listingDurationDays) || 30,
        refreshFrequencyDays: parseInt(formData.refreshFrequencyDays) || 7,
        manualRefreshPerCycle: parseInt(formData.manualRefreshPerCycle) || 0,
        sortOrder: parseInt(formData.sortOrder) || 1
      }
      
      let response
      if (mode === 'create') {
        response = await subscriptionService.createPlan(submitData)
      } else {
        response = await subscriptionService.updatePlan(planId, submitData)
      }
      
      if (response.success) {
        toast.success(`Plan ${mode === 'create' ? 'created' : 'updated'} successfully`)
        router.push('/admin/subscriptions')
      }
    } catch (error) {
      toast.error(error.message || `Failed to ${mode} plan`)
    } finally {
      setLoading(false)
    }
  }

  if (loading && mode !== 'create') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">Loading plan data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Create' : mode === 'view' ? 'View' : 'Edit'} Subscription Plan
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="planCode"
                value={formData.planCode}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                placeholder="e.g., premium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={mode === 'view'}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                placeholder="e.g., Premium Plan"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                placeholder="e.g., Most Popular"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={mode === 'view'}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                placeholder="Full description"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                onWheel={handleWheel}
                disabled={mode === 'view'}
                required
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Amount
              </label>
              <input
                type="number"
                name="discountAmount"
                value={formData.discountAmount}
                onChange={handleChange}
                onWheel={handleWheel}
                disabled={mode === 'view'}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Final Price (Auto-calculated)
              </label>
              <input
                type="text"
                value={calculateFinalPrice()}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Cycle
              </label>
              <select
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
                <option value="one_time">One Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (Days)
              </label>
              <input
                type="number"
                name="durationDays"
                value={formData.durationDays}
                onChange={handleChange}
                onWheel={handleWheel}
                disabled={mode === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="showOriginalPrice"
                checked={formData.showOriginalPrice}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Show Original Price</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="showOfferBadge"
                checked={formData.showOfferBadge}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Show Offer Badge</span>
            </label>
            {formData.showOfferBadge && (
              <input
                type="text"
                name="offerBadgeText"
                value={formData.offerBadgeText}
                onChange={handleChange}
                disabled={mode === 'view'}
                placeholder="e.g., 20% OFF"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
              />
            )}
          </div>
        </div>

        {/* Quotas & Limits */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quotas & Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Total Listings
              </label>
              <input
                type="number"
                name="maxTotalListings"
                value={formData.maxTotalListings}
                onChange={handleChange}
                onWheel={handleWheel}
                disabled={mode === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Active Listings
              </label>
              <input
                type="number"
                name="maxActiveListings"
                value={formData.maxActiveListings}
                onChange={handleChange}
                onWheel={handleWheel}
                disabled={mode === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Listing Quota Limit
              </label>
              <input
                type="number"
                name="listingQuotaLimit"
                value={formData.listingQuotaLimit}
                onChange={handleChange}
                onWheel={handleWheel}
                disabled={mode === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quota Rolling Days
              </label>
              <input
                type="number"
                name="listingQuotaRollingDays"
                value={formData.listingQuotaRollingDays}
                onChange={handleChange}
                onWheel={handleWheel}
                disabled={mode === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Featured Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Featured Listings
              </label>
              <input
                type="number"
                name="maxFeaturedListings"
                value={formData.maxFeaturedListings}
                onChange={handleChange}
                onWheel={handleWheel}
                disabled={mode === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured Days
              </label>
              <input
                type="number"
                name="featuredDays"
                value={formData.featuredDays}
                onChange={handleChange}
                onWheel={handleWheel}
                disabled={mode === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Boosted Listings
              </label>
              <input
                type="number"
                name="maxBoostedListings"
                value={formData.maxBoostedListings}
                onChange={handleChange}
                onWheel={handleWheel}
                disabled={mode === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Boosted Days
              </label>
              <input
                type="number"
                name="boostedDays"
                value={formData.boostedDays}
                onChange={handleChange}
                onWheel={handleWheel}
                disabled={mode === 'view'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Support & Features */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Support & Features</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Support Level
            </label>
            <select
              name="supportLevel"
              value={formData.supportLevel}
              onChange={handleChange}
              disabled={mode === 'view'}
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
            >
              <option value="none">None</option>
              <option value="standard">Standard</option>
              <option value="priority">Priority</option>
              <option value="dedicated">Dedicated</option>
            </select>
          </div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Feature Toggles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(formData.features).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleFeatureChange(key, e.target.checked)}
                  disabled={mode === 'view'}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Visibility</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Public</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        {mode !== 'view' && (
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Plan' : 'Update Plan'}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
