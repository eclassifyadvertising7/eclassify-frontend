"use client"

import { useState } from "react"
import { Heart, Eye, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { getPostedByTypeBadge } from "@/lib/utils"
import { useAuth } from "@/app/context/AuthContext"
import favoritesService from "@/app/services/api/favoritesService"
import { toast } from "sonner"

export default function ListingCard({ listing, onFavoriteRemove, showFavoriteButton = true }) {
  const [isFavorited, setIsFavorited] = useState(listing?.isFavorited || false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const { isAuthenticated } = useAuth()

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
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
    return "/assets/img/car-1.png"
  }

  const getLocation = (listing) => {
    const parts = []
    if (listing.city?.name) parts.push(listing.city.name)
    if (listing.state?.name) parts.push(listing.state.name)
    return parts.join(", ") || "Location not specified"
  }

  const toggleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      toast.error("Please sign in to add favorites")
      return
    }
    
    if (isTogglingFavorite) return
    
    try {
      setIsTogglingFavorite(true)
      
      if (isFavorited) {
        await favoritesService.removeFromFavorites(listing.id)
        setIsFavorited(false)
        toast.success("Removed from favorites")
        
        // Call the callback if provided (for favorites page to refresh)
        if (onFavoriteRemove) {
          onFavoriteRemove()
        }
      } else {
        await favoritesService.addToFavorites(listing.id)
        setIsFavorited(true)
        toast.success("Added to favorites")
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast.error("Failed to update favorite status")
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  if (!listing) {
    return null
  }

  return (
    <Link 
      href={`/product-details/${listing.slug}`}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden block"
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
        {showFavoriteButton && (
          <button
            onClick={toggleFavorite}
            disabled={isTogglingFavorite}
            className={`absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 ${
              !isAuthenticated ? "cursor-not-allowed opacity-75" : "hover:border-red-300"
            }`}
            title={!isAuthenticated ? "Please sign in to add favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-5 h-5 ${
                isAuthenticated && isFavorited
                  ? "fill-red-500 text-red-500" 
                  : isAuthenticated 
                    ? "text-gray-600 hover:text-red-500" 
                    : "text-gray-400"
              } transition-colors duration-200`}
            />
          </button>
        )}
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
        <h4 className="text-sm md:text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
          {listing.title}
        </h4>
        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {getLocation(listing)}
        </p>
        <div className="flex items-center justify-between">
          {listing.postedByType && (
            <span className={`inline-block text-xs px-2 py-1 rounded-full ${getPostedByTypeBadge(listing.postedByType).className}`}>
              {getPostedByTypeBadge(listing.postedByType).icon} {getPostedByTypeBadge(listing.postedByType).label}
            </span>
          )}
          {listing.viewCount !== undefined && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Eye className="h-3 w-3" />
              {listing.viewCount}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
