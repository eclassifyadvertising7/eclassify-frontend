"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Heart, Phone, MessageCircle, Star, Eye, Fuel, Users, Palette, Settings, Zap, ArrowLeft } from "lucide-react"
import Header from "@/components/Header"
import FooterSection from "@/components/Footer"
import Tooltip from "@/components/ui/tooltip"
import { getListingBySlug, incrementListingView } from "@/app/services/api/publicListingsService"
import { createOrGetChatRoom } from "@/app/services/api/chatService"
import { toast } from "sonner"
import { getPostedByTypeBadge } from "@/lib/utils"
import { canIncrementView, recordView, cleanupOldViews } from "@/lib/viewTracking"

export default function ProductDetails() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [message, setMessage] = useState("")
  const [creatingChat, setCreatingChat] = useState(false)

  useEffect(() => {
    if (slug) {
      fetchListingDetails()
      // Clean up old view records on page load
      cleanupOldViews()
    }
  }, [slug])

  const fetchListingDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getListingBySlug(slug)
      
      if (result.success) {
        setListing(result.data)
        
        // Increment view count only if not viewed in last hour
        if (canIncrementView(result.data.id)) {
          await incrementListingView(result.data.id)
          recordView(result.data.id)
        }
        
        // Set default message
        setMessage(`Hi, I am interested in [${result.data.title}]. Please let me know if it's still available. Thanks.`)
      } else {
        setError(result.message || "Listing not found")
      }
    } catch (err) {
      console.error("Error fetching listing:", err)
      setError("Unable to load listing details. Please try again later.")
    } finally {
      setLoading(false)
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
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleChatClick = async () => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) {
      toast.error('Please login to chat with seller')
      router.push('/sign-in')
      return
    }

    // Check if user is trying to chat with their own listing
    if (listing.userId === user.id) {
      toast.error('You cannot chat on your own listing')
      return
    }

    try {
      setCreatingChat(true)
      const response = await createOrGetChatRoom(listing.id)
      
      if (response.success) {
        // Navigate to chats page with the room ID
        router.push(`/chats?room=${response.data.roomId}`)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to start chat')
    } finally {
      setCreatingChat(false)
    }
  }

  const handleCallClick = async () => {
    // Increment view count when user clicks call button
    if (listing && canIncrementView(listing.id)) {
      await incrementListingView(listing.id)
      recordView(listing.id)
    }
    
    // TODO: Implement actual call functionality
    toast.info('Call functionality coming soon')
  }

  // Check if current user owns this listing
  const getCurrentUser = () => {
    if (typeof window === 'undefined') return null
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return null
    }
  }
  
  const currentUser = getCurrentUser()
  const isOwnListing = currentUser?.id && listing?.userId === currentUser.id

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-gray-500">Loading listing details...</div>
          </div>
        </div>
        <FooterSection />
      </>
    )
  }

  if (error || !listing) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-red-500">{error || "Listing not found"}</div>
          </div>
        </div>
        <FooterSection />
      </>
    )
  }

  const images = listing.media?.length > 0 
    ? listing.media.map(m => m.mediaUrl) 
    : ["/assets/img/car-1.png"]

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Specs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden h-96">
              <img
                src={images[selectedImage]}
                alt={listing.title}
                className="w-full h-full object-scale-down rounded-lg shadow-lg"
              />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
              </button>
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

            {/* Car Specifications */}
            {listing.carListing && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  Overview
                </h3>
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
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  Features
                </h3>
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

            {/* Location */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Location</h3>
              <p className="text-gray-700">
                {listing.locality && `${listing.locality}, `}
                {listing.city?.name}, {listing.state?.name}
              </p>
            </div>
          </div>

          {/* Right Column - Listing Info and Contact */}
          <div className="space-y-6">
            {/* Listing Title and Price */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
                <Heart
                  className={`w-6 h-6 cursor-pointer ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                  onClick={() => setIsFavorite(!isFavorite)}
                />
              </div>
              <p className="text-3xl font-bold text-cyan-600 mb-2">{formatPrice(listing.price)}</p>
              {listing.priceNegotiable && (
                <p className="text-sm text-gray-500 mb-2">Price negotiable</p>
              )}
              <p className="text-sm text-gray-500 mb-4">📅 Posted on: {formatDate(listing.publishedAt || listing.published_at || listing.createdAt || listing.created_at)}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {listing.isFeatured && (
                  <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
                {listing.postedByType && (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPostedByTypeBadge(listing.postedByType).className}`}>
                    {getPostedByTypeBadge(listing.postedByType).icon} {getPostedByTypeBadge(listing.postedByType).label}
                  </span>
                )}
              </div>

              {/* Seller Info */}
              {listing.user && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xl font-semibold text-gray-600">
                        {listing.user.fullName?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{listing.user.fullName}</h4>
                      <p className="text-sm text-gray-500">Seller</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Tooltip content={isOwnListing ? 'Cannot chat on your own listing' : 'Chat with seller'}>
                      <button 
                        onClick={handleChatClick}
                        disabled={isOwnListing || creatingChat}
                        className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed w-full"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {creatingChat ? 'Loading...' : 'Chat'}
                      </button>
                    </Tooltip>
                    <Tooltip content={isOwnListing ? 'Cannot call yourself' : 'Call seller'}>
                      <button 
                        onClick={handleCallClick}
                        disabled={isOwnListing}
                        className="flex items-center justify-center gap-2 bg-cyan-600 text-white px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed w-full"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </button>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-3">Statistics</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium">{listing.viewCount || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{listing.category?.name}</span>
                </div>
                {listing.postedByType && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Posted By</span>
                    <span className="font-medium capitalize">{listing.postedByType}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-4">Send Message</h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                disabled={isOwnListing}
                className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Tooltip content={isOwnListing ? 'Cannot send message to your own listing' : 'Send message to seller'}>
                <div className="w-full mt-3">
                  <button 
                    disabled={isOwnListing}
                    className="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Send Message
                  </button>
                </div>
              </Tooltip>
            </div>

            {/* Safety Tips */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-800">Safety tips for deal</p>
                  <p className="text-xs text-orange-600 mt-1">Use safe locations to meet seller</p>
                </div>
              </div>
            </div>

            {/* Ad ID */}
            <div className="text-center">
              <p className="text-sm text-gray-500">AD# {listing.id}</p>
              <button className="text-cyan-600 text-sm hover:underline">Report this ad</button>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  )
}
