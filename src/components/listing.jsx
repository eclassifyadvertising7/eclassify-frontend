"use client"
import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getHomepageListings } from "@/app/services/api/publicListingsService"
import { getPostedByTypeBadge } from "@/lib/utils"
import { useAuth } from "@/app/context/AuthContext"
import Tooltip from "@/components/ui/tooltip"
import favoritesService from "@/app/services/api/favoritesService"
import { toast } from "sonner"

export default function CarListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [favorites, setFavorites] = useState(new Set())
  const [pagination, setPagination] = useState(null)
  const { isAuthenticated } = useAuth()

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
      
      // Handle different types of errors with user-friendly messages
      let errorMessage = "Unable to load listings at the moment."
      
      if (err.status === 0) {
        errorMessage = "Connection failed. Please check your internet connection and try again."
      } else if (err.status >= 500) {
        errorMessage = "Server is temporarily unavailable. Please try again in a few minutes."
      } else if (err.status === 404) {
        errorMessage = "Listings service not found. Please contact support if this persists."
      } else if (err.status >= 400 && err.status < 500) {
        errorMessage = err.message || "There was an issue with your request. Please try again."
      }
      
      setError(errorMessage)
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

  const toggleFavorite = async (e, listingId) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      toast.error('Please sign in to add favorites')
      return
    }
    
    try {
      // Check current favorite status from listing data or local state
      const isCurrentlyFavorited = listings.find(l => l.id === listingId)?.isFavorited || favorites.has(listingId)
      
      if (isCurrentlyFavorited) {
        // Remove from favorites
        await favoritesService.removeFromFavorites(listingId)
        
        // Update local state
        const newFavorites = new Set(favorites)
        newFavorites.delete(listingId)
        setFavorites(newFavorites)
        
        // Update listings data
        setListings(prevListings => 
          prevListings.map(listing => 
            listing.id === listingId 
              ? { 
                  ...listing, 
                  isFavorited: false,
                  favoriteCount: Math.max((listing.favoriteCount || 0) - 1, 0)
                }
              : listing
          )
        )
        
        toast.success('Removed from favorites')
      } else {
        // Add to favorites
        await favoritesService.addToFavorites(listingId)
        
        // Update local state
        const newFavorites = new Set(favorites)
        newFavorites.add(listingId)
        setFavorites(newFavorites)
        
        // Update listings data
        setListings(prevListings => 
          prevListings.map(listing => 
            listing.id === listingId 
              ? { 
                  ...listing, 
                  isFavorited: true,
                  favoriteCount: (listing.favoriteCount || 0) + 1
                }
              : listing
          )
        )
        
        toast.success('Added to favorites')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorite status')
    }
  }

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8 max-w-7xl mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Listings</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-32 md:h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-8 max-w-7xl mb-10">
        <div className="flex flex-col justify-center items-center h-64 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No listings available at this moment
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
            {error}
          </p>
          <button
            onClick={fetchListings}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
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
                  className={`absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 ${
                    !isAuthenticated ? 'cursor-not-allowed opacity-75' : 'hover:border-red-300'
                  }`}
                  disabled={!isAuthenticated}
                  title={!isAuthenticated ? "Please sign in to add favorites" : "Add to favorites"}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isAuthenticated && (listing.isFavorited || favorites.has(listing.id))
                        ? "fill-red-500 text-red-500" 
                        : isAuthenticated 
                          ? "text-gray-600 hover:text-red-500" 
                          : "text-gray-400"
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
