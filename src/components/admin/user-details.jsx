"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Shield, CheckCircle, User, CreditCard, Edit } from "lucide-react"
import { userAdminService } from "@/app/services/api/userAdminService"
import { toast } from "sonner"
import { formatDateTime } from "@/lib/dateTimeUtils"
import Tooltip from "@/components/ui/tooltip"

export default function UserDetails({ userId }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activeSubscription, setActiveSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserDetails()
  }, [userId])

  const fetchUserDetails = async () => {
    try {
      setLoading(true)
      const response = await userAdminService.getUserDetails(userId)
      setUser(response.data.user)
      setActiveSubscription(response.data.activeSubscription)
    } catch (error) {
      toast.error(error.message || 'Failed to fetch user details')
    } finally {
      setLoading(false)
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
            onClick={() => router.push('/admin/users')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {user.fullName}
              {user.isVerified && (
                <Tooltip content="Verified User" position="right">
                  <Shield className="w-6 h-6 text-blue-500 cursor-pointer" />
                </Tooltip>
              )}
            </h2>
            <p className="text-sm text-gray-500">{user.role?.name}</p>
          </div>
        </div>
        <Tooltip content="Edit User Details" position="left">
          <button
            onClick={() => router.push(`/admin/users/${userId}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            Edit User
          </button>
        </Tooltip>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info */}
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

          {/* Active Subscription */}
          {activeSubscription && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Active Subscription
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <p className="text-sm text-gray-500">Max Total Listings</p>
                  <p className="text-sm font-medium text-gray-900">{activeSubscription.maxTotalListings}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Max Active Listings</p>
                  <p className="text-sm font-medium text-gray-900">{activeSubscription.maxActiveListings}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Max Featured Listings</p>
                  <p className="text-sm font-medium text-gray-900">{activeSubscription.maxFeaturedListings}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Auto Approve</p>
                  <p className="text-sm font-medium text-gray-900">
                    {activeSubscription.isAutoApproveEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Account Status</p>
                {getStatusBadge(user.status)}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Active</p>
                <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Yes' : 'No'}
                </span>
              </div>
              {user.role?.slug === 'user' && (
                <>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">KYC Status</p>
                    {getKycBadge(user.kycStatus)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Auto Approve Listings</p>
                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                      user.isAutoApproveEnabled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isAutoApproveEnabled ? 'Enabled' : 'Disabled'}
                    </span>
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

    </div>
  )
}
