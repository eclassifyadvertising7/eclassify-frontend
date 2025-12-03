"use client"

import * as React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import { Loader2, Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import commonService from "@/app/services/api/commonService"

/**
 * CitySelect Component
 * Reusable city selector with search functionality and caching
 * Fetches cities when stateId changes and filters locally
 * 
 * @param {string|number} stateId - Selected state ID (required)
 * @param {string} value - Selected city ID
 * @param {function} onChange - Callback when city changes (cityId, cityName)
 * @param {string} placeholder - Placeholder text
 * @param {boolean} disabled - Disable the select
 * @param {string} error - Error message to display
 * @param {boolean} required - Mark as required field
 * @param {boolean} showLabel - Show label above select
 * @param {string} label - Custom label text
 * @param {string} className - Additional CSS classes
 */
export function CitySelect({
  stateId,
  value,
  onChange,
  placeholder = "Select city",
  disabled = false,
  error = "",
  required = false,
  showLabel = true,
  label = "City",
  className = "",
}) {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  
  // Cache cities by state ID to avoid re-fetching
  const citiesCache = useRef({})

  useEffect(() => {
    if (stateId) {
      fetchCities(stateId)
    } else {
      setCities([])
      setSearchTerm("")
    }
  }, [stateId])

  const fetchCities = async (stateIdToFetch) => {
    // Check cache first
    if (citiesCache.current[stateIdToFetch]) {
      setCities(citiesCache.current[stateIdToFetch])
      setSearchTerm("")
      return
    }

    try {
      setLoading(true)
      setFetchError("")
      setSearchTerm("")
      const response = await commonService.getCitiesByState(stateIdToFetch)
      // API returns { success, data } format
      const cityList = response?.data || response || []
      const cities = Array.isArray(cityList) ? cityList : []
      
      // Cache the result
      citiesCache.current[stateIdToFetch] = cities
      setCities(cities)
    } catch (err) {
      console.error("Error fetching cities:", err)
      setFetchError("Failed to load cities")
      setCities([])
    } finally {
      setLoading(false)
    }
  }

  // Filter cities based on search term (client-side)
  // Search works on both city name and pincode
  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) return cities
    
    const term = searchTerm.toLowerCase()
    return cities.filter(city => 
      city.name.toLowerCase().includes(term) ||
      city.pincode?.includes(term)
    )
  }, [cities, searchTerm])

  // Memoize city items to prevent re-renders
  const cityItems = useMemo(() => {
    return filteredCities.map((city) => (
      <SelectItem key={city.id} value={city.id.toString()}>
        {city.name}{city.pincode ? ` [${city.pincode}]` : ""}
      </SelectItem>
    ))
  }, [filteredCities])

  const handleValueChange = (cityId) => {
    const selectedCity = cities.find(c => c.id.toString() === cityId)
    onChange(cityId, selectedCity?.name || "")
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleOpenChange = (open) => {
    setIsOpen(open)
    if (!open) {
      // Clear search when dropdown closes
      setSearchTerm("")
    }
  }

  const displayError = error || fetchError
  const isDisabled = disabled || loading || !stateId

  return (
    <div className={className}>
      {showLabel && (
        <Label className="mb-2">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <Select
        value={value?.toString()}
        onValueChange={handleValueChange}
        disabled={isDisabled}
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger className="w-full" aria-invalid={!!displayError}>
          <SelectValue 
            placeholder={
              !stateId 
                ? "Select state first" 
                : loading 
                ? "Loading cities..." 
                : placeholder
            } 
          />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={5}>
          {!stateId ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              Please select a state first
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <>
              {/* Search Input */}
              {cities.length > 0 && (
                <div className="sticky top-0 bg-popover p-2 border-b z-10">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Search by city or pincode..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-8 h-8"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}

              {/* Cities List */}
              <div className="max-h-[300px] overflow-y-auto">
                {filteredCities.length === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    {searchTerm ? "No cities found" : "No cities available"}
                  </div>
                ) : (
                  cityItems
                )}
              </div>
            </>
          )}
        </SelectContent>
      </Select>

      {displayError && (
        <p className="text-destructive text-sm mt-1">{displayError}</p>
      )}
    </div>
  )
}
