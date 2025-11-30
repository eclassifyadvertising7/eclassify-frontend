"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Shield, CheckCircle, User, CreditCard, Save } from "lucide-react"
import { userAdminService } from "@/app/services/api/userAdminService"
import { toast } from "sonner"
import { formatDateTime } from "@/lib/dateTimeUtils"
import Tooltip from "@/components/ui/tooltip"
import ConfirmModal from "@/components/ui/confirm-modal"

export default function UserEdit({ userId }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activeSubscription, setActiveSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showKycModal, setShowKycModal] = useState(false)
  const [selectedKycStatus, setSelectedKycStatus] = useState('')
  
  // Editable subscription fields
  const [subscriptionData, setSubscriptionData] = useState({
    maxTotalListings: 0,
    maxActiveListings: 0,
    maxFeaturedListings: 0,
    isAutoApproveEnabled: false
  })

  useEffect(() => {
    fetchUserDetails()
  }, [userId])

  const fetchUserDetails = async () => {
    try {
      setLoading(true)
      const response = await userAdminService.getUserDetails(userId)
      setUser(response.data.user)
      setActiveSubscription(response.data.activeSubscription)
      
      // Initialize subscription data if exists
      if (response.data.activeSubscription) {
        setSubscriptionData({
          maxTotalListings: response.data.activeSubscription.maxTotalListings || 0,
          maxActiveListings: response.data.activeSubscription.maxActiveListings || 0,
          maxFeaturedListings: response.data.activeSubscription.maxFeaturedListings || 0,
          isAutoApproveEnabled: response.data.activeSubscription.isAutoApproveEnabled || false
        })
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch user details')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    try {
      await userAdminService.toggleUserStatus(userId, !user.isActive)
      toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'} successfully`)
      fetchUserDetails()
    } catch (error) {
      toast.error(error.message || 'Failed to update user status')
    }
  }

  const handleToggleAutoApprove = async () => {
    try {
      await userAdminService.toggleAutoApprove(userId, !user.isAutoApproveEnabled)
      toast.success(`Auto-approve ${!user.isAutoApproveEnabled ? 'enabled' : 'disabled'} successfully`)
      fetchUserDetails()
    } catch (error) {
      toast.error(error.message || 'Failed to update auto-approve status')
    }
  }

  const handleVerifyUser = async () => {
    try {
      await userAdminService.verifyUser(userId)
      toast.success('User verified successfully')
      fetchUserDetails()
    } catch (error) {
      toast.error(error.message || 'Failed to verify user')
    }
  }

  const handleUpdateKycStatus = async () => {
    if (!selectedKycStatus) {
      toast.error('Please select a KYC status')
      return
    }
    try {
      await userAdminService.updateKycStatus(userId, selectedKycStatus)
      toast.success('KYC status updated successfully')
      setShowKycModal(false)
      fetchUserDetails()
    } catch (error) {
      toast.error(error.message || 'Failed to update KYC status')
    }
  }

  const handleSaveSubscription = async () => {
    if (!activeSubscription) {
      toast.error('No active subscription to update')
      return
    }
    
    try {
      setSaving(true)
      await userAdminService.updateUserSubscription(activeSubscription.id, subscriptionData)
      toast.success('Subscription updated successfully')
      fetchUserDetails()
    } catch (error) {
      toast.error(error.message || 'Failed to update subscription')
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      blocked: { bg: 'bg-red-100', text: 'text-red-800', label: 'Blocked' },
      suspended: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Suspended' },
      deleted: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Deleted' }
    }
    const config = statusConfig[status] || statusConfig.active
    return (
      <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getKycBadge = (kycStatus) => {
    const kycConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    }
    const config = kycConfig[kycStatus] || kycConfig.pending
    return (
      <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">User not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/admin/users/${userId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Edit: {user.fullName}
              {user.isVerified && (
                <Tooltip content="Verified User" position="right">
                  <Shield className="w-6 h-6 text-blue-500 cursor-pointer" />
                </Tooltip>
              )}
            </h2>
            <p className="text-sm text-gray-500">{user.role?.name}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {!user.isVerified && (
            <Tooltip content="Mark this user as verified" position="left">
              <button
                onClick={handleVerifyUser}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
              >
                Verify User
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info (Read-only) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.countryCode} {user.mobile}
                    {user.isPhoneVerified && (
                      <Tooltip content="Phone Verified" position="right">
                        <CheckCircle className="w-4 h-4 text-green-500 inline ml-1 cursor-pointer" />
                      </Tooltip>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.email || 'N/A'}
                    {user.isEmailVerified && user.email && (
                      <Tooltip content="Email Verified" position="right">
                        <CheckCircle className="w-4 h-4 text-green-500 inline ml-1 cursor-pointer" />
                      </Tooltip>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(user.createdAt, 'date')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          {user.profile && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="space-y-4">
                {user.profile.profilePhoto && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Profile Photo</p>
                    <img
                      src={user.profile.profilePhoto}
                      alt={user.fullName}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.profile.dob && (
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-sm font-medium text-gray-900">{user.profile.dob}</p>
                    </div>
                  )}
                  {user.profile.gender && (
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{user.profile.gender}</p>
                    </div>
                  )}
                  {user.profile.businessName && (
                    <div>
                      <p className="text-sm text-gray-500">Business Name</p>
                      <p className="text-sm font-medium text-gray-900">{user.profile.businessName}</p>
                    </div>
                  )}
                  {user.profile.gstin && (
                    <div>
                      <p className="text-sm text-gray-500">GSTIN</p>
                      <p className="text-sm font-medium text-gray-900">{user.profile.gstin}</p>
                    </div>
                  )}
                  {user.profile.panNumber && (
                    <div>
                      <p className="text-sm text-gray-500">PAN Number</p>
                      <p className="text-sm font-medium text-gray-900">{user.profile.panNumber}</p>
                    </div>
                  )}
                  {user.profile.aadharNumber && (
                    <div>
                      <p className="text-sm text-gray-500">Aadhar Number</p>
                      <p className="text-sm font-medium text-gray-900">{user.profile.aadharNumber}</p>
                    </div>
                  )}
                </div>
                {user.profile.about && (
                  <div>
                    <p className="text-sm text-gray-500">About</p>
                    <p className="text-sm font-medium text-gray-900">{user.profile.about}</p>
                  </div>
                )}
                {(user.profile.addressLine1 || user.profile.city) && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user.profile.addressLine1}
                        {user.profile.addressLine2 && `, ${user.profile.addressLine2}`}
                        <br />
                        {user.profile.city}, {user.profile.stateName} - {user.profile.pincode}
                        <br />
                        {user.profile.country}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Editable Subscription */}
          {activeSubscription && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Active Subscription (Editable)
                </h3>
                <button
                  onClick={handleSaveSubscription}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Plan Name</p>
                  <p className="text-sm font-medium text-gray-900">{activeSubscription.planName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {activeSubscription.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Starts At</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(activeSubscription.startsAt, 'date')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ends At</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(activeSubscription.endsAt, 'date')}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h4 className="font-medium text-gray-900">Subscription Limits (Editable)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Total Listings
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={subscriptionData.maxTotalListings}
                      onChange={(e) => setSubscriptionData({
                        ...subscriptionData,
                        maxTotalListings: parseInt(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Active Listings
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={subscriptionData.maxActiveListings}
                      onChange={(e) => setSubscriptionData({
                        ...subscriptionData,
                        maxActiveListings: parseInt(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Featured Listings
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={subscriptionData.maxFeaturedListings}
                      onChange={(e) => setSubscriptionData({
                        ...subscriptionData,
                        maxFeaturedListings: parseInt(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auto Approve (Subscription)
                    </label>
                    <button
                      onClick={() => setSubscriptionData({
                        ...subscriptionData,
                        isAutoApproveEnabled: !subscriptionData.isAutoApproveEnabled
                      })}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      style={{ backgroundColor: subscriptionData.isAutoApproveEnabled ? '#3b82f6' : '#9ca3af' }}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          subscriptionData.isAutoApproveEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Controls</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Account Status</p>
                {getStatusBadge(user.status)}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Active</p>
                <button
                  onClick={handleToggleStatus}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  style={{ backgroundColor: user.isActive ? '#10b981' : '#ef4444' }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      user.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {user.role?.slug === 'user' && (
                <>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">KYC Status</p>
                    <div className="flex items-center gap-2">
                      {getKycBadge(user.kycStatus)}
                      <button
                        onClick={() => {
                          setSelectedKycStatus(user.kycStatus)
                          setShowKycModal(true)
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Auto Approve Listings (User Level)</p>
                    <button
                      onClick={handleToggleAutoApprove}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      style={{ backgroundColor: user.isAutoApproveEnabled ? '#3b82f6' : '#9ca3af' }}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          user.isAutoApproveEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Info</h3>
            <div className="space-y-3 text-sm">
              {user.lastLoginAt && (
                <div>
                  <p className="text-gray-500">Last Login</p>
                  <p className="font-medium text-gray-900">{formatDateTime(user.lastLoginAt)}</p>
                </div>
              )}
              {user.phoneVerifiedAt && (
                <div>
                  <p className="text-gray-500">Phone Verified At</p>
                  <p className="font-medium text-gray-900">{formatDateTime(user.phoneVerifiedAt)}</p>
                </div>
              )}
              {user.emailVerifiedAt && (
                <div>
                  <p className="text-gray-500">Email Verified At</p>
                  <p className="font-medium text-gray-900">{formatDateTime(user.emailVerifiedAt)}</p>
                </div>
              )}
              {user.subscriptionType && (
                <div>
                  <p className="text-gray-500">Subscription Type</p>
                  <p className="font-medium text-gray-900 capitalize">{user.subscriptionType}</p>
                </div>
              )}
              {user.maxDevices && (
                <div>
                  <p className="text-gray-500">Max Devices</p>
                  <p className="font-medium text-gray-900">{user.maxDevices}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KYC Status Modal */}
      {showKycModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update KYC Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select KYC Status
                </label>
                <select
                  value={selectedKycStatus}
                  onChange={(e) => setSelectedKycStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowKycModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateKycStatus}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
