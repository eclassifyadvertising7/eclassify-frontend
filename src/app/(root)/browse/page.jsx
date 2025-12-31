"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Heart, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"
import FooterSection from "@/components/Footer"
import publicListingsService from "@/app/services/api/publicListingsService"
import { searchListings, logSearchActivity } from "@/app/services/api/searchService"
import activityService from "@/app/services/api/activityService"
import { getPostedByTypeBadge } from "@/lib/utils"
import { useAuth } from "@/app/context/AuthContext"
import favoritesService from "@/app/services/api/favoritesService"
import { toast } from "sonner"
import FilterPanel from "@/components/filters/FilterPanel"
import ActiveFilters from "@/components/filters/ActiveFilters"
import MobileFilterButton from "@/components/filters/MobileFilterButton"

function BrowseContent() {
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get("category")
  const featured = searchParams.get("featured")
  const propertyType = searchParams.get("propertyType")
  const listingType = searchParams.get("listingType")
  const searchQuery = searchParams.get("search")
  
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState(new Set())
  const [pagination, setPagination] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    sortBy: 'date_desc',
    categoryId: null,
    minPrice: '',
    maxPrice: '',
    postedBy: ''
  })
  const { isAuthenticated } = useAuth()

  // Only show filters for category pages (not featured or search)
  const showFilters = categorySlug && !featured && !searchQuery

  useEffect(() => {
    fetchListings()
  }, [categorySlug, featured, propertyType, listingType, searchQuery, filters.sortBy, filters.categoryId, filters.minPrice, filters.maxPrice, filters.postedBy])

  const fetchListings = async () => {
    setLoading(true)
    setError(null)
    try {
      let result
      
      if (searchQuery) {
        // Fetch search results
        const params = {
          search: searchQuery,
          page: 1,
          limit: 100,
          sortBy: filters.sortBy,
          ...(filters.categoryId && { categoryId: filters.categoryId }),
          ...(filters.minPrice && { minPrice: filters.minPrice }),
          ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
          ...(filters.postedBy && { postedBy: filters.postedBy })
        }
        result = await searchListings(params)
      } else if (featured === 'true') {
        // Fetch featured listings
        result = await publicListingsService.getFeaturedListings(100)
      } else if (categorySlug) {
        // Fetch category-specific listings
        const params = {
          page: 1,
          limit: 100,
          sortBy: filters.sortBy,
          ...(filters.minPrice && { minPrice: filters.minPrice }),
          ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
          ...(filters.postedBy && { postedBy: filters.postedBy }),
          ...(propertyType && { propertyType }),
          ...(listingType && { listingType })
        }
        result = await publicListingsService.browseCategoryListings(categorySlug, params)
      } else {
        // Fetch all listings
        const params = {
          page: 1,
          limit: 100,
          sortBy: filters.sortBy,
          ...(filters.categoryId && { categoryId: filters.categoryId }),
          ...(filters.minPrice && { minPrice: filters.minPrice }),
          ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
          ...(filters.postedBy && { postedBy: filters.postedBy })
        }
        result = await publicListingsService.getHomepageListings(params.page, params.limit, params)
      }
      
      if (result.success) {
        // Handle different response structures
        let listingsData = []
        if (searchQuery && result.data?.listings) {
          // Search results have listings nested in data.listings
          listingsData = result.data.listings
        } else if (Array.isArray(result.data)) {
          // Other endpoints return data as array directly
          listingsData = result.data
        }
        setListings(listingsData)
        setPagination(result.pagination || result.data?.pagination)
        
        // Log search with actual results count only for authenticated users
        if (searchQuery && isAuthenticated && listingsData.length > 0) {
          try {
            await logSearchActivity({
              searchQuery: searchQuery,
              resultsCount: listingsData.length
            })
          } catch (error) {
            console.error("Failed to update search log:", error)
          }
        }
      } else {
        setError(result.message || "Failed to fetch listings")
        setListings([])
      }
    } catch (err) {
      console.error("Error fetching listings:", err)
      setError("Unable to load listings at the moment.")
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleApplyFilters = () => {
    setIsFilterOpen(false)
    fetchListings()
  }

  const handleClearFilters = () => {
    setFilters({
      sortBy: 'date_desc',
      categoryId: null,
      minPrice: '',
      maxPrice: '',
      postedBy: ''
    })
    setIsFilterOpen(false)
  }

  const handleRemoveFilter = (key) => {
    if (key === 'price') {
      setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }))
    } else {
      setFilters(prev => ({ ...prev, [key]: key === 'categoryId' ? null : '' }))
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
      const isCurrentlyFavorited = listings.find(l => l.id === listingId)?.isFavorited || favorites.has(listingId)
      
      if (isCurrentlyFavorited) {
        await favoritesService.removeFromFavorites(listingId)
        const newFavorites = new Set(favorites)
        newFavorites.delete(listingId)
        setFavorites(newFavorites)
        setListings(prevListings => 
          prevListings.map(listing => 
            listing.id === listingId 
              ? { ...listing, isFavorited: false, favoriteCount: Math.max((listing.favoriteCount || 0) - 1, 0) }
              : listing
          )
        )
        toast.success('Removed from favorites')
      } else {
        await favoritesService.addToFavorites(listingId)
        const newFavorites = new Set(favorites)
        newFavorites.add(listingId)
        setFavorites(newFavorites)
        setListings(prevListings => 
          prevListings.map(listing => 
            listing.id === listingId 
              ? { ...listing, isFavorited: true, favoriteCount: (listing.favoriteCount || 0) + 1 }
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

  const getPageTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`
    if (featured === 'true') return 'Featured Listings'
    if (categorySlug) {
      return categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
    }
    return 'All Listings'
  }

  return (
    <div>
      <Header />
      
      <section className="container mx-auto px-4 py-8 max-w-7xl mb-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
          {showFilters && (
            <div className="flex items-center gap-4">
              <MobileFilterButton onClick={() => setIsFilterOpen(true)} />
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="hidden lg:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          )}
        </div>

        {showFilters && (
          <>
            <ActiveFilters
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearFilters}
            />

            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              categorySlug={categorySlug}
              hideCategoryFilter={true}
            />
          </>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
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
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-64 text-center">
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchListings}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No listings available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => {
              const handleCardClick = async () => {
                // Log listing view activity when card is clicked
                const referrerSource = featured === 'true' ? 'featured' : categorySlug ? 'category_page' : 'search_results'
                await activityService.logListingView(listing.id, {
                  referrer_source: referrerSource,
                  page_url: window.location.href
                })
              }

              return (
                <Link 
                  href={`/product-details/${listing.slug}`}
                  key={listing.id}
                  onClick={handleCardClick}
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
            )})}
          </div>
        )}
      </section>

      <FooterSection />
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  )
}
