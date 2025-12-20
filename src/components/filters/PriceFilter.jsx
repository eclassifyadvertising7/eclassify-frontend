"use client"
import { useState } from "react"

export default function PriceFilter({ minPrice, maxPrice, onPriceChange }) {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice || '')
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice || '')

  const handleMinPriceChange = (value) => {
    setLocalMinPrice(value)
    onPriceChange(value, localMaxPrice)
  }

  const handleMaxPriceChange = (value) => {
    setLocalMaxPrice(value)
    onPriceChange(localMinPrice, value)
  }

  const priceRanges = [
    { label: "Under ₹1 Lakh", min: 0, max: 100000 },
    { label: "₹1-5 Lakh", min: 100000, max: 500000 },
    { label: "₹5-10 Lakh", min: 500000, max: 1000000 },
    { label: "₹10-20 Lakh", min: 1000000, max: 2000000 },
    { label: "₹20-50 Lakh", min: 2000000, max: 5000000 },
    { label: "Above ₹50 Lakh", min: 5000000, max: null },
  ]

  const handleQuickSelect = (min, max) => {
    setLocalMinPrice(min || '')
    setLocalMaxPrice(max || '')
    onPriceChange(min || '', max || '')
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Price Range
      </label>
      
      {/* Quick Select Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {priceRanges.map((range, index) => (
          <button
            key={index}
            onClick={() => handleQuickSelect(range.min, range.max)}
            className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Custom Range Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Min Price</label>
          <input
            type="number"
            placeholder="Min"
            value={localMinPrice}
            onChange={(e) => handleMinPriceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Max Price</label>
          <input
            type="number"
            placeholder="Max"
            value={localMaxPrice}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
          />
        </div>
      </div>
    </div>
  )
}