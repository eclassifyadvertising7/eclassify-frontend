"use client"
import { useState, useCallback } from "react"

export default function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    sortBy: "date_desc",
    
    // Price filters
    minPrice: "",
    maxPrice: "",
    
    // Location filters
    stateId: "",
    cityId: "",
    
    // General filters
    categoryId: "",
    isFeatured: false,
    postedBy: "", // owner, dealer
    
    // Car-specific filters
    brandId: "",
    modelId: "",
    variantId: "",
    fuelType: "",
    transmission: "",
    condition: "",
    minYear: "",
    maxYear: "",
    minKilometers: "",
    maxKilometers: "",
    
    // Property-specific filters
    propertyType: "",
    listingType: "", // rent, sale
    bedrooms: "",
    bathrooms: "",
    furnishing: "",
    minArea: "",
    maxArea: "",
    parking: "",
    
    ...initialFilters
  })

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1 // Reset page when other filters change
    }))
  }, [])

  const updateMultipleFilters = useCallback((updates) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
      page: updates.page || 1
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 20,
      search: "",
      sortBy: "date_desc",
      minPrice: "",
      maxPrice: "",
      stateId: "",
      cityId: "",
      categoryId: "",
      isFeatured: false,
      postedBy: "",
      brandId: "",
      modelId: "",
      variantId: "",
      fuelType: "",
      transmission: "",
      condition: "",
      minYear: "",
      maxYear: "",
      minKilometers: "",
      maxKilometers: "",
      propertyType: "",
      listingType: "",
      bedrooms: "",
      bathrooms: "",
      furnishing: "",
      minArea: "",
      maxArea: "",
      parking: "",
    })
  }, [])

  const removeFilter = useCallback((key) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'isFeatured' ? false : '',
      page: 1
    }))
  }, [])

  const getActiveFiltersCount = useCallback(() => {
    const excludeKeys = ['page', 'limit', 'sortBy']
    return Object.entries(filters).filter(([key, value]) => 
      !excludeKeys.includes(key) && value !== "" && value !== false && value !== null
    ).length
  }, [filters])

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== false) {
        params.append(key, value.toString())
      }
    })
    
    return params.toString()
  }, [filters])

  return {
    filters,
    updateFilter,
    updateMultipleFilters,
    clearFilters,
    removeFilter,
    getActiveFiltersCount,
    buildQueryParams
  }
}