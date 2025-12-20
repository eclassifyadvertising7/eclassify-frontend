"use client"
import { useState, useEffect } from "react"

export default function QuickFilters({ onQuickFilter, categorySlug }) {
  const [quickFilters, setQuickFilters] = useState([])

  useEffect(() => {
    // Set quick filters based on category
    if (categorySlug === 'cars') {
      setQuickFilters([
        { label: "Under ₹5 Lakh", filters: { maxPrice: 500000 } },
        { label: "₹5-10 Lakh", filters: { minPrice: 500000, maxPrice: 1000000 } },
        { label: "Petrol Cars", filters: { fuelType: "petrol" } },
        { label: "Automatic", filters: { transmission: "automatic" } },
        { label: "After 2020", filters: { minYear: 2020 } },
        { label: "Featured", filters: { isFeatured: true } },
      ])
    } else if (categorySlug === 'properties') {
      setQuickFilters([
        { label: "For Rent", filters: { listingType: "rent" } },
        { label: "For Sale", filters: { listingType: "sale" } },
        { label: "1 BHK", filters: { propertyType: "1BHK" } },
        { label: "2 BHK", filters: { propertyType: "2BHK" } },
        { label: "Furnished", filters: { furnishing: "fully-furnished" } },
        { label: "Featured", filters: { isFeatured: true } },
      ])
    } else {
      setQuickFilters([
        { label: "Under ₹1 Lakh", filters: { maxPrice: 100000 } },
        { label: "₹1-5 Lakh", filters: { minPrice: 100000, maxPrice: 500000 } },
        { label: "₹5-10 Lakh", filters: { minPrice: 500000, maxPrice: 1000000 } },
        { label: "Above ₹10 Lakh", filters: { minPrice: 1000000 } },
        { label: "Featured", filters: { isFeatured: true } },
        { label: "Owner", filters: { postedBy: "owner" } },
      ])
    }
  }, [categorySlug])

  if (quickFilters.length === 0) {
    return null
  }

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h4>
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter, index) => (
          <button
            key={index}
            onClick={() => onQuickFilter(filter.filters)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-cyan-500 transition-colors"
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}