"use client"
import { createContext, useContext, useState, useEffect } from 'react'

const LocationContext = createContext()

export function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation')
    if (savedLocation) {
      try {
        setSelectedLocation(JSON.parse(savedLocation))
      } catch (error) {
        console.error('Error parsing saved location:', error)
        localStorage.removeItem('selectedLocation')
      }
    }
  }, [])

  // Save location to localStorage whenever it changes
  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation))
    } else {
      localStorage.removeItem('selectedLocation')
    }
  }, [selectedLocation])

  const updateLocation = (location) => {
    setSelectedLocation(location)
  }

  const clearLocation = () => {
    setSelectedLocation(null)
  }

  const getLocationDisplayName = () => {
    if (!selectedLocation) return 'Select Location'
    
    if (selectedLocation.type === 'current') {
      return selectedLocation.name || 'Current Location'
    }
    
    return `${selectedLocation.name}, ${selectedLocation.state}`
  }

  const getLocationForFilters = () => {
    if (!selectedLocation) return { stateId: '', cityId: '' }
    
    if (selectedLocation.type === 'current') {
      // For current location, we might not have state/city IDs
      return { 
        stateId: selectedLocation.state || '', 
        cityId: selectedLocation.id || '',
        coordinates: selectedLocation.coordinates
      }
    }
    
    return {
      stateId: selectedLocation.state || '',
      cityId: selectedLocation.id || ''
    }
  }

  const value = {
    selectedLocation,
    isLoading,
    setIsLoading,
    updateLocation,
    clearLocation,
    getLocationDisplayName,
    getLocationForFilters
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}