"use client"
import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getHomepageListings } from "@/app/services/api/publicListingsService"
import { getPostedByTypeBadge } from "@/lib/utils"

export default function CarListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [favorites, setFavorites] = useState(new Set())
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    fetchListings()
  }, [showAll])

  const fetchListings = async () => {
    setLoading(true)
    setError(null)
    try {
      const limit = showAll ? 100 : 8
      const result = await getHomepageListings(1, limit)
      
      if (result.success) {
        setListings(result.data || [])
        setPagination(result.pagination)
      } else {
        setError(result.message || "Failed to fetch listings")
      }
    } catch (err) {
      console.error("Error fetching listings:", err)
      setError("Unable to load listings. Please try again later.")
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

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now - date
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays < 1) return "Today"
    if (diffInDays < 30) return `${diffInDays}d ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`
    return `${Math.floor(diffInDays / 365)}y ago`
  }

  const getImageUrl = (listing) => {
    if (listing.media && listing.media.length > 0) {
      const primaryImage = listing.media.find(m => m.isPrimary) || listing.media[0]
      return primaryImage.thumbnailUrl || primaryImage.mediaUrl
    }
    return "./assets/img/car-1.png"
  }

  const getLocation = (listing) => {
    const parts = []
    if (listing.city?.name) parts.push(listing.city.name)
    if (listing.state?.name) parts.push(listing.state.name)
    return parts.join(", ") || "Location not specified"
  }

  const toggleFavorite = (e, listingId) => {
    e.preventDefault()
    e.stopPropagation()
    const newFavorites = new Set(favorites)
    if (newFavorites.has(listingId)) {
      newFavorites.delete(listingId)
    } else {
      newFavorites.add(listingId)
    }
    setFavorites(newFavorites)
  }

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8 max-w-7xl mb-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading listings...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-8 max-w-7xl mb-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-8 max-w-7xl mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Latest Listings</h2>
        {pagination && pagination.total > 8 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors duration-200"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No listings available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Link 
              href={`/product-details/${listing.slug}`}
              key={listing.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative h-32 md:h-48">
                <Image 
                  src={getImageUrl(listing)} 
                  alt={listing.title} 
                  fill
                  className="object-cover" 
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  unoptimized

                />
                {listing.isFeatured && (
                  <div className="absolute top-3 left-3 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </div>
                )}
                <button
                  onClick={(e) => toggleFavorite(e, listing.id)}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.has(listing.id) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
                    } transition-colors duration-200`}
                  />
                </button>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm md:text-xl font-bold text-gray-900">
                    {formatPrice(listing.price)}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {formatTimeAgo(listing.publishedAt || listing.published_at || listing.createdAt || listing.created_at)}
                  </span>
                </div>
                <h4 className="text-sm md:text-lg font-semibold text-gray-800 mb-1">
                  {listing.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">{getLocation(listing)}</p>
                {listing.postedByType && (
                  <span className={`inline-block text-xs px-2 py-1 rounded-full ${getPostedByTypeBadge(listing.postedByType).className}`}>
                    {getPostedByTypeBadge(listing.postedByType).icon} {getPostedByTypeBadge(listing.postedByType).label}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
