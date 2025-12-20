"use client"
import { useState, useEffect } from "react"
import { Heart, Search, SlidersHorizontal, Filter } from "lucide-react"
import Link from "next/link"
import { browseCategoryListings } from "@/app/services/api/publicListingsService"
import FilterPanel from "./filters/FilterPanel"
import MobileFilterButton from "./filters/MobileFilterButton"
import ActiveFilters from "./filters/ActiveFilters"
import QuickFilters from "./filters/QuickFilters"
import useFilters from "@/hooks/useFilters"
import { useLocation } from "@/app/context/LocationContext"

export default function CategoryListings({ categorySlug }) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState(new Set())
  const [pagination, setPagination] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const { getLocationForFilters } = useLocation()
  
  const { 
    filters, 
    updateFilter, 
    updateMultipleFilters,
    clearFilters,
    removeFilter,
    getActiveFiltersCount 
  } = useFilters({
    ...getLocationForFilters() // Initialize with location from context
  })

  useEffect(() => {
    fetchListings()
  }, [categorySlug, filters.page, filters.sortBy])

  const fetchListings = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await browseCategoryListings(categorySlug, filters)
      
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

  const handleApplyFilters = () => {
    fetchListings()
    setShowFilters(false)
  }

  const handleClearFilters = () => {
    clearFilters()
    fetchListings()
  }

  const toggleFavorite = (e, listingId) => {
    e.preventDefault()
    const newFavorites = new Set(favorites)
    if (newFavorites.has(listingId)) {
      newFavorites.delete(listingId)
    } else {
      newFavorites.add(listingId)
    }
    setFavorites(newFavorites)
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
    if (diffInDays < 30) return `${diffInDays}d`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo`
    return `${Math.floor(diffInDays / 365)}y`
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
    if (listing.locality) parts.push(listing.locality)
    if (listing.city?.name) parts.push(listing.city.name)
    if (listing.state?.name) parts.push(listing.state.name)
    return parts.join(", ") || "Location not specified"
  }

  if (loading && listings.length === 0) {
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
      {/* Header with Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search listings..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && fetchListings()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter("sortBy", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="date_desc">Newly Posted First</option>
            <option value="date_asc">Oldest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="views_desc">Most Viewed</option>
            <option value="favorites_desc">Most Favorited</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors relative"
          >
            <Filter className="w-5 h-5" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFilterChange={updateFilter}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        categorySlug={categorySlug}
      />

      {/* Quick Filters */}
      <QuickFilters
        onQuickFilter={(quickFilters) => updateMultipleFilters(quickFilters)}
        categorySlug={categorySlug}
      />

      {/* Active Filters */}
      <ActiveFilters
        filters={filters}
        onRemoveFilter={removeFilter}
        onClearAll={handleClearFilters}
      />

      {/* Results Count */}
      {pagination && (
        <div className="mb-4 text-gray-600">
          Showing {listings.length} of {pagination.total} listings
        </div>
      )}

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No listings found. Try adjusting your filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Link 
                href={`/product-details/${listing.slug}`}
                key={listing.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img 
                    src={getImageUrl(listing)} 
                    alt={listing.title} 
                    className="w-full h-32 md:h-48 object-cover" 
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
                      {formatTimeAgo(listing.createdAt)}
                    </span>
                  </div>
                  <h4 className="text-sm md:text-lg font-semibold text-gray-800 mb-1">
                    {listing.title}
                  </h4>
                  <p className="text-sm text-gray-600">{getLocation(listing)}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                disabled={pagination.page === 1}
                onClick={() => updateFilter("page", pagination.page - 1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => updateFilter("page", pagination.page + 1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Mobile Filter Button */}
      <MobileFilterButton
        onClick={() => setShowFilters(true)}
        activeFiltersCount={getActiveFiltersCount()}
      />
    </section>
  )
}
