"use client"
import { X } from "lucide-react"

export default function ActiveFilters({ filters, onRemoveFilter, onClearAll }) {
  const getFilterDisplayName = (key, value) => {
    const filterNames = {
      search: `Search: "${value}"`,
      categoryId: `Category: ${value}`,
      minPrice: `Min Price: ₹${parseInt(value).toLocaleString()}`,
      maxPrice: `Max Price: ₹${parseInt(value).toLocaleString()}`,
      brandId: `Brand: ${value}`,
      modelId: `Model: ${value}`,
      variantId: `Variant: ${value}`,
      fuelType: `Fuel: ${value.charAt(0).toUpperCase() + value.slice(1)}`,
      transmission: `Transmission: ${value.charAt(0).toUpperCase() + value.slice(1)}`,
      minYear: `After ${value}`,
      maxYear: `Before ${value}`,
      minKilometers: `Min KM: ${parseInt(value).toLocaleString()}`,
      maxKilometers: `Max KM: ${parseInt(value).toLocaleString()}`,
      propertyType: `Type: ${value}`,
      listingType: `For ${value.charAt(0).toUpperCase() + value.slice(1)}`,
      bedrooms: `${value} Bedroom${value !== '1' ? 's' : ''}`,
      bathrooms: `${value} Bathroom${value !== '1' ? 's' : ''}`,
      furnishing: `${value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
      minArea: `Min Area: ${parseInt(value).toLocaleString()} sq ft`,
      maxArea: `Max Area: ${parseInt(value).toLocaleString()} sq ft`,
      parking: `${value} Car Parking`,
      postedBy: `Posted by ${value.charAt(0).toUpperCase() + value.slice(1)}`,
      stateId: `State: ${value}`,
      cityId: `City: ${value}`,
      isFeatured: 'Featured Only'
    }
    
    return filterNames[key] || `${key}: ${value}`
  }

  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    const excludeKeys = ['page', 'limit', 'sortBy']
    return !excludeKeys.includes(key) && value !== "" && value !== false && value !== null && value !== undefined
  })

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Active Filters:</span>
        {activeFilters.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center gap-1 bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm"
          >
            <span>{getFilterDisplayName(key, value)}</span>
            <button
              onClick={() => onRemoveFilter(key)}
              className="hover:bg-cyan-200 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {activeFilters.length > 1 && (
          <button
            onClick={onClearAll}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}