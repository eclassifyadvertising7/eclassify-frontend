"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, MapPin } from "lucide-react"
import publicListingsService from "@/app/services/api/publicListingsService"
import activityService from "@/app/services/api/activityService"
import { favoritesService } from "@/app/services"
import { useAuth } from "@/app/context/AuthContext"
import { toast } from "sonner"

export default function RelatedListings({ listingId, limit = 6 }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [relatedListings, setRelatedListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (listingId) {
      fetchRelatedListings()
    }
  }, [listingId])

  const fetchRelatedListings = async () => {
    setLoading(true)
    try {
      const result = await publicListingsService.getRelatedListings(listingId, limit)
      
      if (result.success && result.data.listings) {
        // Check favorite status for authenticated users
        if (isAuthenticated && result.data.listings.length > 0) {
          const listingsWithFavorites = await Promise.all(
            result.data.listings.map(async (listing) => {
              try {
                const favoriteResponse = await favoritesService.checkIsFavorited(listing.id)
                return {
                  ...listing,
                  isFavorited: favoriteResponse.data.isFavorited
                }
              } catch (error) {
                return listing
              }
            })
          )
          setRelatedListings(listingsWithFavorites)
        } else {
          setRelatedListings(result.data.listings)
        }
      }
    } catch (error) {
      console.error("Error fetching related listings:", error)
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

  const handleFavoriteToggle = async (e, listing) => {
    e.stopPropagation()
    
    if (!isAuthenticated) {
      toast.error('Please sign in to add favorites')
      return
    }

    try {
      if (listing.isFavorited) {
        await favoritesService.removeFromFavorites(listing.id)
        setRelatedListings(prev => 
          prev.map(item => 
            item.id === listing.id 
              ? { ...item, isFavorited: false }
              : item
          )
        )
        toast.success('Removed from favorites')
      } else {
        await favoritesService.addToFavorites(listing.id)
        setRelatedListings(prev => 
          prev.map(item => 
            item.id === listing.id 
              ? { ...item, isFavorited: true }
              : item
          )
        )
        toast.success('Added to favorites!')
      }
    } catch (error) {
      console.error('Favorite toggle error:', error)
      toast.error('Failed to update favorite status')
    }
  }

  const handleListingClick = async (slug, listingId) => {
    // Log listing view activity when related listing is clicked
    await activityService.logListingView(listingId, {
      referrer_source: 'recommendation',
      page_url: window.location.href
    })
    router.push(`/product-details/${slug}`)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Related Ads</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!relatedListings || relatedListings.length === 0) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Related Ads</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedListings.map((listing) => (
          <div
            key={listing.id}
            onClick={() => handleListingClick(listing.slug, listing.id)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={listing.thumbnailUrl || "/assets/img/car-1.png"}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={(e) => handleFavoriteToggle(e, listing)}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow z-10"
              >
                <Heart
                  className={`w-4 h-4 ${
                    listing.isFavorited
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  }`}
                />
              </button>
              {listing.isFeatured && (
                <span className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Featured
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
                {listing.title}
              </h3>
              <p className="text-2xl font-bold text-cyan-600 mb-2">
                {formatPrice(listing.price)}
              </p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="line-clamp-1">{listing.location}</span>
              </div>
              {listing.categoryName && (
                <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  {listing.categoryName}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
