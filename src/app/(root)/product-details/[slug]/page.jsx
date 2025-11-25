"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Heart, Phone, MessageCircle, Star, Eye, Fuel, Users, Palette, Settings, Zap } from "lucide-react"
import Header from "@/components/Header"
import FooterSection from "@/components/Footer"
import { getListingBySlug, incrementListingView } from "@/app/services/api/publicListingsService"

export default function ProductDetails() {
  const params = useParams()
  const slug = params.slug

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (slug) {
      fetchListingDetails()
    }
  }, [slug])

  const fetchListingDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getListingBySlug(slug)
      
      if (result.success) {
        setListing(result.data)
        // Increment view count
        await incrementListingView(result.data.id)
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Specs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative">
              <img
                src={images[selectedImage]}
                alt={listing.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
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
                      <p className="font-medium">{listing.carListing.color}</p>
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
              <p className="text-sm text-gray-500 mb-4">📅 Posted on: {formatDate(listing.publishedAt || listing.createdAt)}</p>

              {listing.isFeatured && (
                <div className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  Featured
                </div>
              )}

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
                    <button className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-cyan-600 text-white px-4 py-3 rounded-lg hover:bg-cyan-700 transition-colors">
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
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
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-4">Send Message</h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <button className="w-full mt-3 bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition-colors">
                Send Message
              </button>
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
