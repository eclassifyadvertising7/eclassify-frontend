"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAuth } from "@/app/context/AuthContext"
import { listingService } from "@/app/services"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, 
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail
} from "lucide-react"
import { toast } from "sonner"
import { Splide, SplideSlide } from "@splidejs/react-splide"
import "@splidejs/react-splide/css"
import ConfirmModal from "@/components/ui/confirm-modal"

export default function MyListingDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, loading: authLoading } = useAuth()
  
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    listingId: null,
    listingTitle: ""
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please login to view your listings")
      router.push("/sign-in")
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchListingDetails()
    }
  }, [isAuthenticated, params.id])

  const fetchListingDetails = async () => {
    try {
      setLoading(true)
      const response = await listingService.getMyListingById(params.id)
      setListing(response.data)
    } catch (error) {
      console.error("Error fetching listing:", error)
      toast.error("Failed to load listing details")
      router.push("/my-listings")
    } finally {
      setLoading(false)
    }
  }

  const openDeleteModal = () => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      listingId: listing.id,
      listingTitle: listing.title
    })
  }

  const openSoldModal = () => {
    setConfirmModal({
      isOpen: true,
      type: 'sold',
      listingId: listing.id,
      listingTitle: listing.title
    })
  }

  const openSubmitModal = () => {
    setConfirmModal({
      isOpen: true,
      type: 'submit',
      listingId: listing.id,
      listingTitle: listing.title
    })
  }

  const closeModal = () => {
    setConfirmModal({
      isOpen: false,
      type: null,
      listingId: null,
      listingTitle: ""
    })
  }

  const handleConfirmAction = async () => {
    const { type, listingId } = confirmModal
    
    try {
      if (type === 'delete') {
        await listingService.deleteListing(listingId)
        toast.success("Listing deleted successfully")
        router.push("/my-listings")
      } else if (type === 'sold') {
        await listingService.markAsSold(listingId)
        toast.success("Listing marked as sold")
        fetchListingDetails()
      } else if (type === 'submit') {
        await listingService.submitForApproval(listingId)
        toast.success("Listing submitted for approval")
        fetchListingDetails()
      }
      closeModal()
    } catch (error) {
      console.error(`Error ${type === 'delete' ? 'deleting' : type === 'sold' ? 'marking as sold' : 'submitting'} listing:`, error)
      toast.error(`Failed to ${type === 'delete' ? 'delete' : type === 'sold' ? 'mark as sold' : 'submit'} listing`)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { label: "Draft", className: "bg-gray-100 text-gray-800" },
      pending: { label: "Pending Approval", className: "bg-yellow-100 text-yellow-800" },
      active: { label: "Active", className: "bg-green-100 text-green-800" },
      expired: { label: "Expired", className: "bg-orange-100 text-orange-800" },
      sold: { label: "Sold", className: "bg-blue-100 text-blue-800" },
      rejected: { label: "Rejected", className: "bg-red-100 text-red-800" }
    }

    const config = statusConfig[status] || statusConfig.draft
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Loading listing details...</p>
          </div>
        </div>
      </>
    )
  }

  if (!listing) {
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Back Button */}
          <Link href="/my-listings">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Listings
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Images */}
              <Card>
                <CardContent className="p-0">
                  {listing.media && listing.media.length > 0 ? (
                    <Splide
                      options={{
                        type: "loop",
                        perPage: 1,
                        perMove: 1,
                        gap: "1rem",
                        pagination: true,
                        arrows: listing.media.length > 1,
                      }}
                    >
                      {listing.media.map((media, index) => (
                        <SplideSlide key={index}>
                          <div className="relative h-96">
                            <img
                              src={media.mediaUrl}
                              alt={`${listing.title} - ${index + 1}`}
                              className="w-full h-full object-contain bg-gray-100"
                            />
                          </div>
                        </SplideSlide>
                      ))}
                    </Splide>
                  ) : (
                    <div className="h-96 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No images available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Details */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(listing.status)}
                        {listing.isFeatured && (
                          <Badge className="bg-yellow-500 text-white">Featured</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-4xl font-bold text-primary mb-6">
                    {formatPrice(listing.price)}
                    {listing.priceNegotiable && (
                      <span className="text-sm font-normal text-gray-600 ml-2">(Negotiable)</span>
                    )}
                  </div>

                  {listing.description && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
                    </div>
                  )}

                  {/* Location */}
                  <div className="flex items-start gap-2 text-gray-700 mb-4">
                    <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        {listing.locality}
                        {listing.city?.name && `, ${listing.city.name}`}
                        {listing.state?.name && `, ${listing.state.name}`}
                      </p>
                      {listing.address && (
                        <p className="text-sm text-gray-600">{listing.address}</p>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Eye className="h-5 w-5" />
                      <span>{listing.viewCount || 0} views</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-5 w-5" />
                      <span>Posted {formatDate(listing.publishedAt || listing.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Car/Property Specific Details */}
              {(listing.categoryType === 'car' || listing.categoryType === 'property') && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {listing.categoryType === 'car' && (
                        <>
                          {listing.brand?.name && (
                            <div>
                              <p className="text-sm text-gray-600">Brand</p>
                              <p className="font-medium">{listing.brand.name}</p>
                            </div>
                          )}
                          {listing.model?.name && (
                            <div>
                              <p className="text-sm text-gray-600">Model</p>
                              <p className="font-medium">{listing.model.name}</p>
                            </div>
                          )}
                          {listing.year && (
                            <div>
                              <p className="text-sm text-gray-600">Year</p>
                              <p className="font-medium">{listing.year}</p>
                            </div>
                          )}
                          {listing.fuelType && (
                            <div>
                              <p className="text-sm text-gray-600">Fuel Type</p>
                              <p className="font-medium capitalize">{listing.fuelType}</p>
                            </div>
                          )}
                          {listing.transmission && (
                            <div>
                              <p className="text-sm text-gray-600">Transmission</p>
                              <p className="font-medium capitalize">{listing.transmission}</p>
                            </div>
                          )}
                          {listing.mileageKm && (
                            <div>
                              <p className="text-sm text-gray-600">Mileage</p>
                              <p className="font-medium">{listing.mileageKm.toLocaleString()} km</p>
                            </div>
                          )}
                        </>
                      )}
                      {listing.categoryType === 'property' && (
                        <>
                          {listing.propertyType && (
                            <div>
                              <p className="text-sm text-gray-600">Property Type</p>
                              <p className="font-medium capitalize">{listing.propertyType}</p>
                            </div>
                          )}
                          {listing.listingType && (
                            <div>
                              <p className="text-sm text-gray-600">Listing Type</p>
                              <p className="font-medium capitalize">{listing.listingType}</p>
                            </div>
                          )}
                          {listing.areaSqft && (
                            <div>
                              <p className="text-sm text-gray-600">Area</p>
                              <p className="font-medium">{listing.areaSqft} sq ft</p>
                            </div>
                          )}
                          {listing.bedrooms && (
                            <div>
                              <p className="text-sm text-gray-600">Bedrooms</p>
                              <p className="font-medium">{listing.bedrooms}</p>
                            </div>
                          )}
                          {listing.bathrooms && (
                            <div>
                              <p className="text-sm text-gray-600">Bathrooms</p>
                              <p className="font-medium">{listing.bathrooms}</p>
                            </div>
                          )}
                          {listing.furnished && (
                            <div>
                              <p className="text-sm text-gray-600">Furnishing</p>
                              <p className="font-medium capitalize">{listing.furnished.replace('-', ' ')}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Rejection Reason */}
              {listing.status === 'rejected' && listing.rejectionReason && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Rejection Reason</h3>
                    <p className="text-red-700">{listing.rejectionReason}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-semibold mb-4">Actions</h3>
                  
                  {(listing.status === "draft" || listing.status === "rejected") && (
                    <Link href={`/edit-listing/${listing.id}`} className="block">
                      <Button className="w-full" variant="default">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Listing
                      </Button>
                    </Link>
                  )}

                  {listing.status === "draft" && listing.media && listing.media.length > 0 && (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      variant="default"
                      onClick={openSubmitModal}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit for Approval
                    </Button>
                  )}

                  {listing.status === "active" && (
                    <Button 
                      className="w-full" 
                      variant="default"
                      onClick={openSoldModal}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Sold
                    </Button>
                  )}

                  <Button 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" 
                    variant="outline"
                    onClick={openDeleteModal}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Listing
                  </Button>
                </CardContent>
              </Card>

              {/* Status Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Listing Information</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600">Status</p>
                      <div className="mt-1">{getStatusBadge(listing.status)}</div>
                    </div>
                    <div>
                      <p className="text-gray-600">Created</p>
                      <p className="font-medium">{formatDate(listing.createdAt)}</p>
                    </div>
                    {listing.publishedAt && (
                      <div>
                        <p className="text-gray-600">Published</p>
                        <p className="font-medium">{formatDate(listing.publishedAt)}</p>
                      </div>
                    )}
                    {listing.expiresAt && (
                      <div>
                        <p className="text-gray-600">Expires</p>
                        <p className="font-medium">{formatDate(listing.expiresAt)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.type === 'delete' 
            ? 'Delete Listing' 
            : confirmModal.type === 'sold'
            ? 'Mark as Sold'
            : 'Submit for Approval'
        }
        message={
          confirmModal.type === 'delete'
            ? `Are you sure you want to delete "${confirmModal.listingTitle}"? This action cannot be undone.`
            : confirmModal.type === 'sold'
            ? `Mark "${confirmModal.listingTitle}" as sold? This will change the listing status.`
            : `Submit "${confirmModal.listingTitle}" for admin approval? Once approved, it will be visible to all users.`
        }
        confirmText={
          confirmModal.type === 'delete' 
            ? 'Delete' 
            : confirmModal.type === 'sold'
            ? 'Mark as Sold'
            : 'Submit'
        }
        cancelText="Cancel"
        variant={confirmModal.type === 'delete' ? 'danger' : 'primary'}
      />
    </>
  )
}
