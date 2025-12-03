"use client"

import { useState } from "react"
import { StateSelect } from "@/components/ui/state-select"
import { CitySelect } from "@/components/ui/city-select"

/**
 * Example Usage of StateSelect and CitySelect Components
 * 
 * This demonstrates how to use the location selectors in your forms.
 * Copy this pattern into your car-form, property-form, or profile forms.
 */
export function LocationSelectExample() {
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [stateError, setStateError] = useState("")
  const [cityError, setCityError] = useState("")

  const handleStateChange = (stateId, stateName) => {
    console.log("State changed:", { stateId, stateName })
    setSelectedState(stateId)
    
    // IMPORTANT: Clear city when state changes
    setSelectedCity("")
    
    // Clear errors
    setStateError("")
    setCityError("")
  }

  const handleCityChange = (cityId, cityName) => {
    console.log("City changed:", { cityId, cityName })
    setSelectedCity(cityId)
    setCityError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    let hasError = false
    
    if (!selectedState) {
      setStateError("Please select a state")
      hasError = true
    }
    
    if (!selectedCity) {
      setCityError("Please select a city")
      hasError = true
    }
    
    if (hasError) return
    
    // Submit form
    console.log("Form submitted:", {
      state: selectedState,
      city: selectedCity,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-semibold">Location Selection Example</h2>
      
      {/* State Select */}
      <StateSelect
        value={selectedState}
        onChange={handleStateChange}
        error={stateError}
        required
        showLabel
      />

      {/* City Select */}
      <CitySelect
        stateId={selectedState}
        value={selectedCity}
        onChange={handleCityChange}
        error={cityError}
        required
        showLabel
      />

      <button
        type="submit"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Submit
      </button>

      {/* Display Selected Values */}
      {(selectedState || selectedCity) && (
        <div className="p-4 bg-muted rounded-md">
          <p className="text-sm font-medium">Selected:</p>
          <p className="text-sm">State ID: {selectedState || "None"}</p>
          <p className="text-sm">City ID: {selectedCity || "None"}</p>
        </div>
      )}
    </form>
  )
}
