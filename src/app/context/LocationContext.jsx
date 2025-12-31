"use client"
import { createContext, useContext, useState, useEffect } from 'react'
import { getPreferredLocation, updatePreferredLocation } from '@/app/services/api/profileService'
import { useAuth } from './AuthContext'

const LocationContext = createContext()

export function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const { isAuthenticated, user } = useAuth()

  // Initialize location ONCE on app load
  // For authenticated users: Load from localStorage first (instant), then sync with API once
  // For guest users: Only use localStorage
  useEffect(() => {
    const initializeLocation = async () => {
      if (isInitialized) return // Prevent multiple API calls
      
      setIsLoading(true)
      
      try {
        // Step 1: Load from localStorage immediately (fast, works offline)
        const savedLocation = localStorage.getItem('selectedLocation')
        if (savedLocation) {
          try {
            const parsedLocation = JSON.parse(savedLocation)
            setSelectedLocation(parsedLocation)
          } catch (error) {
            console.error('Error parsing saved location:', error)
            localStorage.removeItem('selectedLocation')
          }
        }

        // Step 2: If authenticated, fetch from API ONCE to sync (in case user changed location on another device)
        if (isAuthenticated) {
          const result = await getPreferredLocation()
          if (result.success && result.data && result.data.preferredCityId) {
            const apiLocation = {
              id: result.data.preferredCityId,
              name: result.data.preferredCityName,
              type: 'preferred',
              coordinates: {
                latitude: result.data.preferredLatitude ? parseFloat(result.data.preferredLatitude) : null,
                longitude: result.data.preferredLongitude ? parseFloat(result.data.preferredLongitude) : null
              }
            }
            
            // Update state and localStorage with API data (keeps devices in sync)
            setSelectedLocation(apiLocation)
            localStorage.setItem('selectedLocation', JSON.stringify(apiLocation))
          }
        }
      } catch (error) {
        console.error('Error initializing location:', error)
      } finally {
        setIsLoading(false)
        setIsInitialized(true) // Mark as initialized to prevent future API calls
      }
    }

    initializeLocation()
  }, [isAuthenticated, isInitialized])

  // Save location to localStorage whenever it changes
  useEffect(() => {
    if (selectedLocation && isInitialized) {
      localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation))
    } else if (!selectedLocation && isInitialized) {
      localStorage.removeItem('selectedLocation')
    }
  }, [selectedLocation, isInitialized])

  const updateLocation = async (location) => {
    // Update local state and localStorage immediately
    setSelectedLocation(location)
    localStorage.setItem('selectedLocation', JSON.stringify(location))
    
    // If user is authenticated, sync with backend
    if (isAuthenticated && location) {
      try {
        const payload = {
          preferredCityId: location.id || null,
          preferredCityName: location.name || null,
          preferredLatitude: location.coordinates?.latitude || null,
          preferredLongitude: location.coordinates?.longitude || null
        }
        
        await updatePreferredLocation(payload)
      } catch (error) {
        console.error('Failed to sync location with backend:', error)
        // Don't show error to user - localStorage update already succeeded
      }
    }
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
        stateId: selectedLocation.stateId || '', 
        cityId: selectedLocation.id || '',
        coordinates: selectedLocation.coordinates
      }
    }
    
    return {
      stateId: selectedLocation.stateId || '',
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