"use client"
import { useState, useEffect } from "react"
import { getCities } from "@/app/services/api/locationService"

export default function LocationFilter({ stateId, cityId, onLocationChange }) {
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [loadingStates, setLoadingStates] = useState(true)
  const [loadingCities, setLoadingCities] = useState(false)

  useEffect(() => {
    fetchStates()
  }, [])

  useEffect(() => {
    if (stateId) {
      fetchCitiesByState(stateId)
    } else {
      setCities([])
      onLocationChange('', '')
    }
  }, [stateId])

  const fetchStates = async () => {
    try {
      // Get all cities and extract unique states
      const result = await getCities('', 1000) // Get a large number to get all states
      if (result.success) {
        const uniqueStates = result.data.reduce((acc, city) => {
          if (!acc.find(state => state.name === city.stateName)) {
            acc.push({
              id: city.stateName, // Using state name as ID for simplicity
              name: city.stateName
            })
          }
          return acc
        }, [])
        
        // Sort states alphabetically
        uniqueStates.sort((a, b) => a.name.localeCompare(b.name))
        setStates(uniqueStates)
      }
    } catch (error) {
      console.error('Error fetching states:', error)
    } finally {
      setLoadingStates(false)
    }
  }

  const fetchCitiesByState = async (selectedStateName) => {
    setLoadingCities(true)
    try {
      // Get all cities and filter by state
      const result = await getCities('', 1000)
      if (result.success) {
        const stateCities = result.data
          .filter(city => city.stateName === selectedStateName)
          .map(city => ({
            id: city.id,
            name: city.name,
            district: city.district,
            pincode: city.pincode
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
        
        setCities(stateCities)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    } finally {
      setLoadingCities(false)
    }
  }

  const handleStateChange = (selectedStateName) => {
    onLocationChange(selectedStateName, '')
  }

  const handleCityChange = (selectedCityId) => {
    onLocationChange(stateId, selectedCityId)
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
        Location
      </h4>

      {/* State */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State
        </label>
        {loadingStates ? (
          <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
        ) : (
          <select
            value={stateId || ''}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">All States</option>
            {states.map((state) => (
              <option key={state.id} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          City
        </label>
        {loadingCities ? (
          <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
        ) : (
          <select
            value={cityId || ''}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={!stateId}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}