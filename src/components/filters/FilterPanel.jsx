"use client"
import { useState, useEffect } from "react"
import { ChevronDown, X } from "lucide-react"
import CategoryFilter from "./CategoryFilter"
import CarFilters from "./CarFilters"
import PropertyFilters from "./PropertyFilters"
import PriceFilter from "./PriceFilter"
import LocationFilter from "./LocationFilter"
import SortFilter from "./SortFilter"

export default function FilterPanel({ 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  onClearFilters, 
  isOpen, 
  onClose,
  categorySlug 
}) {
  const [activeCategory, setActiveCategory] = useState(null)

  useEffect(() => {
    // Set active category based on slug
    if (categorySlug === 'cars') {
      setActiveCategory('cars')
    } else if (categorySlug === 'properties') {
      setActiveCategory('properties')
    } else {
      setActiveCategory(null)
    }
  }, [categorySlug])

  const handleCategoryChange = (categoryId, categorySlug) => {
    setActiveCategory(categorySlug)
    onFilterChange('categoryId', categoryId)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:relative lg:bg-transparent lg:z-auto">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl lg:relative lg:max-w-none lg:shadow-none lg:bg-gray-50 lg:rounded-lg lg:border lg:border-gray-200">
        <div className="flex flex-col h-full lg:h-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:border-none">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Category Filter - Only show if not on category page */}
            {!categorySlug && (
              <CategoryFilter
                selectedCategory={filters.categoryId}
                onCategoryChange={handleCategoryChange}
              />
            )}

            {/* Sort Filter */}
            <SortFilter
              sortBy={filters.sortBy}
              onSortChange={(value) => onFilterChange('sortBy', value)}
            />

            {/* Price Filter */}
            <PriceFilter
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onPriceChange={(min, max) => {
                onFilterChange('minPrice', min)
                onFilterChange('maxPrice', max)
              }}
            />

            {/* Location Filter */}
            <LocationFilter
              stateId={filters.stateId}
              cityId={filters.cityId}
              onLocationChange={(stateId, cityId) => {
                onFilterChange('stateId', stateId)
                onFilterChange('cityId', cityId)
              }}
            />

            {/* Category-specific Filters */}
            {activeCategory === 'cars' && (
              <CarFilters
                filters={filters}
                onFilterChange={onFilterChange}
              />
            )}

            {activeCategory === 'properties' && (
              <PropertyFilters
                filters={filters}
                onFilterChange={onFilterChange}
              />
            )}

            {/* Posted By Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posted By
              </label>
              <select
                value={filters.postedBy || ''}
                onChange={(e) => onFilterChange('postedBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">All</option>
                <option value="owner">Owner</option>
                <option value="dealer">Dealer</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            <button
              onClick={onApplyFilters}
              className="w-full px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
            <button
              onClick={onClearFilters}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}