"use client"
import { useState, useEffect } from "react"

export default function CarFilters({ filters, onFilterChange }) {
  const [brands, setBrands] = useState([])
  const [models, setModels] = useState([])
  const [variants, setVariants] = useState([])
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)
  const [loadingVariants, setLoadingVariants] = useState(false)

  useEffect(() => {
    fetchBrands()
  }, [])

  useEffect(() => {
    if (filters.brandId) {
      fetchModels(filters.brandId)
    } else {
      setModels([])
      setVariants([])
      onFilterChange('modelId', '')
      onFilterChange('variantId', '')
    }
  }, [filters.brandId])

  useEffect(() => {
    if (filters.modelId) {
      fetchVariants(filters.modelId)
    } else {
      setVariants([])
      onFilterChange('variantId', '')
    }
  }, [filters.modelId])

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/public/car-brands')
      const result = await response.json()
      
      if (result.success) {
        setBrands(result.data?.all || [])
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      setLoadingBrands(false)
    }
  }

  const fetchModels = async (brandId) => {
    setLoadingModels(true)
    try {
      const response = await fetch(`/api/public/car-models?brandId=${brandId}`)
      const result = await response.json()
      
      if (result.success) {
        setModels(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching models:', error)
    } finally {
      setLoadingModels(false)
    }
  }

  const fetchVariants = async (modelId) => {
    setLoadingVariants(true)
    try {
      const response = await fetch(`/api/public/car-variants?modelId=${modelId}`)
      const result = await response.json()
      
      if (result.success) {
        setVariants(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching variants:', error)
    } finally {
      setLoadingVariants(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
        Car Specifications
      </h4>

      {/* Brand */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brand
        </label>
        {loadingBrands ? (
          <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
        ) : (
          <select
            value={filters.brandId || ''}
            onChange={(e) => onFilterChange('brandId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Model */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model
        </label>
        {loadingModels ? (
          <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
        ) : (
          <select
            value={filters.modelId || ''}
            onChange={(e) => onFilterChange('modelId', e.target.value)}
            disabled={!filters.brandId}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Variant */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Variant
        </label>
        {loadingVariants ? (
          <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
        ) : (
          <select
            value={filters.variantId || ''}
            onChange={(e) => onFilterChange('variantId', e.target.value)}
            disabled={!filters.modelId}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Variant</option>
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.variantName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Kilometer Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min KM
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.minKilometers || ''}
            onChange={(e) => onFilterChange('minKilometers', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max KM
          </label>
          <input
            type="number"
            placeholder="200000"
            value={filters.maxKilometers || ''}
            onChange={(e) => onFilterChange('maxKilometers', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Year Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            After Year
          </label>
          <select
            value={filters.minYear || ''}
            onChange={(e) => onFilterChange('minYear', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Any Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Before Year
          </label>
          <select
            value={filters.maxYear || ''}
            onChange={(e) => onFilterChange('maxYear', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Any Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fuel Type
        </label>
        <select
          value={filters.fuelType || ''}
          onChange={(e) => onFilterChange('fuelType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">All Fuel Types</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="electric">Electric</option>
          <option value="hybrid">Hybrid</option>
          <option value="cng">CNG</option>
        </select>
      </div>

      {/* Transmission Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transmission
        </label>
        <select
          value={filters.transmission || ''}
          onChange={(e) => onFilterChange('transmission', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">All Transmissions</option>
          <option value="manual">Manual</option>
          <option value="automatic">Automatic</option>
        </select>
      </div>
    </div>
  )
}