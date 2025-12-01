"use client"
import { useState, useEffect } from "react"
import { Filter, Download, Eye, Check, X, Star, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { listingAdminService } from "@/app/services/api/listingAdminService"
import { toast } from "sonner"
import Tooltip from "@/components/ui/tooltip"
import ConfirmModal from "@/components/ui/confirm-modal"

export default function AdsManagement() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 20
  })
  const [pagination, setPagination] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showFeaturedModal, setShowFeaturedModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [featuredDays, setFeaturedDays] = useState(7)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, listingId: null, listingTitle: '' })

  useEffect(() => {
    fetchListings()
    fetchStats()
  }, [filters])

  const fetchListings = async () => {
    try {
      setLoading(true)
      const response = await listingAdminService.getAllListings(filters)
      setListings(response.data)
      setPagination(response.pagination)
    } catch (error) {
      toast.error(error.message || 'Failed to fetch listings')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await listingAdminService.getStats()
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleApprove = async (listingId) => {
    try {
      await listingAdminService.approveListing(listingId)
      toast.success('Listing approved successfully')
      fetchListings()
      fetchStats()
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
      await listingAdminService.rejectListing(selectedListing.id, rejectionReason)
      toast.success('Listing rejected successfully')
      setShowRejectModal(false)
      setRejectionReason('')
      setSelectedListing(null)
      fetchListings()
      fetchStats()
    } catch (error) {
      toast.error(error.message || 'Failed to reject listing')
    }
  }

  const handleFeatured = async () => {
    try {
      const isFeatured = !selectedListing.isFeatured
      await listingAdminService.updateFeaturedStatus(
        selectedListing.id, 
        isFeatured, 
        isFeatured ? featuredDays : null
      )
      toast.success(isFeatured ? 'Listing featured successfully' : 'Featured status removed')
      setShowFeaturedModal(false)
      setSelectedListing(null)
      fetchListings()
    } catch (error) {
      toast.error(error.message || 'Failed to update featured status')
    }
  }

  const handleDelete = async () => {
    try {
      await listingAdminService.deleteListing(deleteModal.listingId)
      toast.success('Listing deleted successfully')
      fetchListings()
      fetchStats()
    } catch (error) {
      toast.error(error.message || 'Failed to delete listing')
    }
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Listings Management</h2>
          {stats && (
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <span>Total: {stats.total}</span>
              <span className="text-yellow-600">Pending: {stats.pending}</span>
              <span className="text-green-600">Active: {stats.active}</span>
              <span className="text-red-600">Rejected: {stats.rejected}</span>
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="sold">Sold</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  placeholder="Search by title, description..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No listings found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listing Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seller
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          {listing.media?.[0] && (
                            <img 
                              src={listing.media[0].thumbnailUrl || listing.media[0].mediaUrl} 
                              alt={listing.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                              {listing.title}
                              {listing.isFeatured && (
                                <Tooltip content="Featured Listing" position="right">
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 cursor-pointer" />
                                </Tooltip>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {listing.city?.name}, {listing.state?.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDate(listing.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{listing.user?.fullName || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{listing.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {listing.category?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(listing.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {listing.viewCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(listing.status)}`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {listing.status === 'pending' && (
                            <>
                              <Tooltip content="Approve Listing" position="top">
                                <button 
                                  onClick={() => handleApprove(listing.id)}
                                  className="text-green-600 hover:text-green-900 cursor-pointer transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              </Tooltip>
                              <Tooltip content="Reject Listing" position="top">
                                <button 
                                  onClick={() => {
                                    setSelectedListing(listing)
                                    setShowRejectModal(true)
                                  }}
                                  className="text-red-600 hover:text-red-900 cursor-pointer transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </Tooltip>
                            </>
                          )}
                          {(listing.status === 'active' || listing.status === 'expired') && (
                            <Tooltip content={listing.isFeatured ? "Remove Featured" : "Make Featured"} position="top">
                              <button 
                                onClick={() => {
                                  setSelectedListing(listing)
                                  setShowFeaturedModal(true)
                                }}
                                className={`${listing.isFeatured ? "text-yellow-600 hover:text-yellow-900" : "text-gray-600 hover:text-gray-900"} cursor-pointer transition-colors`}
                              >
                                <Star className={`w-4 h-4 ${listing.isFeatured ? 'fill-yellow-500' : ''}`} />
                              </button>
                            </Tooltip>
                          )}
                          <Tooltip content="Delete Listing" position="top">
                            <button 
                              onClick={() => setDeleteModal({ isOpen: true, listingId: listing.id, listingTitle: listing.title })}
                              className="text-red-600 hover:text-red-900 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
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
                  setSelectedListing(null)
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
              {selectedListing.isFeatured ? 'Remove Featured Status' : 'Make Listing Featured'}
            </h3>
            {!selectedListing.isFeatured && (
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
                onClick={() => {
                  setShowFeaturedModal(false)
                  setSelectedListing(null)
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleFeatured}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {selectedListing.isFeatured ? 'Remove Featured' : 'Make Featured'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, listingId: null, listingTitle: '' })}
        onConfirm={handleDelete}
        title="Delete Listing"
        message={`Are you sure you want to delete "${deleteModal.listingTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}
