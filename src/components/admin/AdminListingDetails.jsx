"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Eye, Settings, Fuel, Users, Palette, Check, X, Star, Trash2 } from "lucide-react"
import { listingAdminService } from "@/app/services/api/listingAdminService"
import { toast } from "sonner"
import Tooltip from "@/components/ui/tooltip"
import ConfirmModal from "@/components/ui/confirm-modal"
import { getPostedByTypeBadge } from "@/lib/utils"

export default function AdminListingDetails() {
  const params = useParams()
  const router = useRouter()
  const listingId = params.id

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showFeaturedModal, setShowFeaturedModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [featuredDays, setFeaturedDays] = useState(7)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false })

  useEffect(() => {
    if (listingId) {
      fetchListingDetails()
    }
  }, [listingId])

  const fetchListingDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await listingAdminService.getListingById(listingId)
      if (response.success) {
        setListing(response.data)
      } else {
        setError(response.message || "Listing not found")
      }
    } catch (err) {
      console.error("Error fetching listing:", err)
      setError("Unable to load listing details. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    try {
      await listingAdminService.approveListing(listingId)
      toast.success('Listing approved successfully')
      fetchListingDetails()
    } catch (error) {
      toast.error(error.message || 'Failed to approve listing')
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    try {
      await listingAdminService.rejectListing(listingId, rejectionReason)
      toast.success('Listing rejected successfully')
      setShowRejectModal(false)
      setRejectionReason('')
      fetchListingDetails()
    } catch (error) {
      toast.error(error.message || 'Failed to reject listing')
    }
  }

  const handleFeatured = async () => {
    try {
      const isFeatured = !listing.isFeatured
      await listingAdminService.updateFeaturedStatus(
        listingId, 
        isFeatured, 
        isFeatured ? featuredDays : null
      )
      toast.success(isFeatured ? 'Listing featured successfully' : 'Featured status removed')
      setShowFeaturedModal(false)
      fetchListingDetails()
    } catch (error) {
      toast.error(error.message || 'Failed to update featured status')
    }
  }

  const handleDelete = async () => {
    try {
      await listingAdminService.deleteListing(listingId)
      toast.success('Listing deleted successfully')
      router.push('/admin/ads')
    } catch (error) {
      toast.error(error.message || 'Failed to delete listing')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      expired: 'bg-orange-100 text-orange-800',
      sold: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return statusConfig[status] || 'bg-gray-100 text-gray-800'
  }

  const capitalizeStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-red-500">{error || "Listing not found"}</div>
      </div>
    )
  }

  const images = listing.media?.length > 0 
    ? listing.media.map(m => m.mediaUrl) 
    : ["/assets/img/car-1.png"]

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/admin/ads')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Listings</span>
        </button>

        <div className="flex items-center gap-3">
          {listing.status === 'pending' && (
            <>
              <Tooltip content="Approve Listing" position="bottom">
                <button 
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
              </Tooltip>
              <Tooltip content="Reject Listing" position="bottom">
                <button 
                  onClick={() => setShowRejectModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </Tooltip>
            </>
          )}
          {(listing.status === 'active' || listing.status === 'expired') && (
            <Tooltip content={listing.isFeatured ? "Remove Featured" : "Make Featured"} position="bottom">
              <button 
                onClick={() => setShowFeaturedModal(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  listing.isFeatured 
                    ? "bg-yellow-600 text-white hover:bg-yellow-700" 
                    : "bg-gray-600 text-white hover:bg-gray-700"
                }`}
              >
                <Star className={`w-4 h-4 ${listing.isFeatured ? 'fill-white' : ''}`} />
                {listing.isFeatured ? 'Remove Featured' : 'Make Featured'}
              </button>
            </Tooltip>
          )}
          <Tooltip content="Delete Listing" position="bottom">
            <button 
              onClick={() => setDeleteModal({ isOpen: true })}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Listing Status and Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(listing.status)}`}>
                {capitalizeStatus(listing.status)}
              </span>
              {listing.isFeatured && (
                <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  Featured
                </span>
              )}
              {listing.postedByType && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPostedByTypeBadge(listing.postedByType).className}`}>
                  {getPostedByTypeBadge(listing.postedByType).icon} {getPostedByTypeBadge(listing.postedByType).label}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-cyan-600">{formatPrice(listing.price)}</p>
            {listing.priceNegotiable && (
              <p className="text-sm text-gray-500">Price negotiable</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-gray-600">Category</p>
            <p className="font-medium">{listing.category?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Posted By</p>
            <p className="font-medium">{listing.user?.fullName || 'N/A'}</p>
            <p className="text-xs text-gray-500">{listing.user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-medium">{listing.city?.name}, {listing.state?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Created</p>
            <p className="font-medium">{formatDate(listing.created_at || listing.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Published</p>
            <p className="font-medium">{formatDate(listing.published_at || listing.publishedAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Views</p>
            <p className="font-medium flex items-center gap-1">
              <Eye className="w-4 h-4 text-gray-500" />
              {listing.viewCount || 0}
            </p>
          </div>
        </div>

        {listing.rejectionReason && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
            <p className="text-sm text-red-700">{listing.rejectionReason}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Images</h3>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden h-96 mb-4">
              <img
                src={images[selectedImage]}
                alt={listing.title}
                className="w-full h-full object-scale-down"
              />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-cyan-500" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car Specifications */}
          {listing.carListing && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Car Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Brand</p>
                    <p className="font-medium">{listing.carListing.brand?.name || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Model</p>
                    <p className="font-medium">{listing.carListing.model?.name || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Variant</p>
                    <p className="font-medium">{listing.carListing.variant?.variantName || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-medium">{listing.carListing.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Mileage</p>
                    <p className="font-medium">{listing.carListing.mileageKm?.toLocaleString()} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Fuel className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Fuel Type</p>
                    <p className="font-medium capitalize">{listing.carListing.fuelType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Transmission</p>
                    <p className="font-medium capitalize">{listing.carListing.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Seating</p>
                    <p className="font-medium">{listing.carListing.seats} Seater</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Palette className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Color</p>
                    <p className="font-medium">{listing.carListing.color || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Condition</p>
                    <p className="font-medium capitalize">{listing.carListing.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Owners</p>
                    <p className="font-medium">{listing.carListing.ownersCount}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Car Features */}
          {listing.carListing?.features && listing.carListing.features.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {listing.carListing.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Seller Information */}
          {listing.user && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{listing.user.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{listing.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{listing.user.phoneNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-medium text-xs">{listing.user.id}</p>
                </div>
              </div>
            </div>
          )}

          {/* Listing Metadata */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Metadata</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Listing ID</p>
                <p className="font-medium text-xs">{listing.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Slug</p>
                <p className="font-medium text-xs">{listing.slug}</p>
              </div>
              {listing.expiresAt && (
                <div>
                  <p className="text-sm text-gray-600">Expires At</p>
                  <p className="font-medium">{formatDate(listing.expiresAt)}</p>
                </div>
              )}
              {listing.featuredUntil && (
                <div>
                  <p className="text-sm text-gray-600">Featured Until</p>
                  <p className="font-medium">{formatDate(listing.featuredUntil)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Listing</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this listing. The user will be notified.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Reject Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Modal */}
      {showFeaturedModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {listing.isFeatured ? 'Remove Featured Status' : 'Make Listing Featured'}
            </h3>
            {!listing.isFeatured && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Duration (days)
                </label>
                <input
                  type="number"
                  value={featuredDays}
                  onChange={(e) => setFeaturedDays(parseInt(e.target.value))}
                  min="1"
                  max="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowFeaturedModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleFeatured}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {listing.isFeatured ? 'Remove Featured' : 'Make Featured'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={handleDelete}
        title="Delete Listing"
        message={`Are you sure you want to delete "${listing.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}
