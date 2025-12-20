"use client";

import { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown, Navigation, Search } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLocation } from '@/app/context/LocationContext';
import { getCities, getPopularCities, searchCitiesByLocation } from '@/app/services/api/locationService';

/**
 * Location selector dropdown component
 * Shows current location, popular cities, and all cities
 */
export default function LocationSelector({ 
  onLocationSelect, 
  className = "",
  placeholder = "Select Location"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [popularCities, setPopularCities] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const dropdownRef = useRef(null);
  
  const { 
    location, 
    loading: geoLoading, 
    permissionStatus, 
    requestLocation 
  } = useGeolocation();

  const { selectedLocation, updateLocation, getLocationDisplayName } = useLocation();

  // Load popular cities on component mount
  useEffect(() => {
    loadPopularCities();
  }, []);

  // Load cities based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      searchCities(searchTerm);
    } else {
      setFilteredCities([]);
    }
  }, [searchTerm]);

  const loadPopularCities = async () => {
    setLoadingPopular(true);
    try {
      const result = await getPopularCities(8);
      if (result.success) {
        const formattedCities = result.data.map(city => ({
          id: city.id,
          name: city.name,
          state: city.stateName,
          district: city.district,
          pincode: city.pincode,
          latitude: city.latitude,
          longitude: city.longitude,
          type: 'popular'
        }));
        setPopularCities(formattedCities);
      }
    } catch (error) {
      console.error('Error loading popular cities:', error);
    } finally {
      setLoadingPopular(false);
    }
  };

  const searchCities = async (searchTerm) => {
    setLoadingCities(true);
    try {
      const result = await getCities(searchTerm, 50);
      if (result.success) {
        const formattedCities = result.data.map(city => ({
          id: city.id,
          name: city.name,
          state: city.stateName,
          district: city.district,
          pincode: city.pincode,
          latitude: city.latitude,
          longitude: city.longitude,
          type: 'search'
        }));
        setFilteredCities(formattedCities);
      }
    } catch (error) {
      console.error('Error searching cities:', error);
      setFilteredCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle location selection
  const handleLocationSelect = (locationData) => {
    updateLocation(locationData);
    setIsOpen(false);
    setSearchTerm('');
    onLocationSelect?.(locationData);
  };

  // Handle current location request
  const handleCurrentLocation = async () => {
    if (location) {
      try {
        // Try to find nearby cities based on current location
        const nearbyResult = await searchCitiesByLocation(location.latitude, location.longitude, 25);
        
        let locationData;
        if (nearbyResult.success && nearbyResult.data.length > 0) {
          // Use the closest city
          const closestCity = nearbyResult.data[0];
          locationData = {
            id: closestCity.id,
            type: 'current',
            name: closestCity.name,
            state: closestCity.stateName,
            district: closestCity.district,
            coordinates: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          };
        } else {
          // Fallback to just coordinates
          locationData = {
            type: 'current',
            name: 'Current Location',
            coordinates: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          };
        }
        
        handleLocationSelect(locationData);
      } catch (error) {
        console.error('Error getting nearby cities:', error);
        // Fallback to basic current location
        const currentLocationData = {
          type: 'current',
          name: 'Current Location',
          coordinates: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        };
        handleLocationSelect(currentLocationData);
      }
    } else {
      requestLocation();
    }
  };

  // Get display text for selected location
  const getDisplayText = () => {
    return selectedLocation ? getLocationDisplayName() : placeholder;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Location Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[180px] justify-between"
      >
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
          <span className="truncate">
            {getDisplayText()}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50 mt-1 max-h-96 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {/* Current Location Option */}
            {(location || permissionStatus !== 'denied') && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                  Current Location
                </div>
                <button
                  onClick={handleCurrentLocation}
                  disabled={geoLoading}
                  className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Navigation className={`h-4 w-4 mr-3 ${geoLoading ? 'animate-spin' : 'text-blue-600'}`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {geoLoading ? 'Getting location...' : 'Use Current Location'}
                    </div>
                    {location && (
                      <div className="text-xs text-gray-500">
                        Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
                      </div>
                    )}
                  </div>
                </button>
              </>
            )}

            {/* Popular Cities */}
            {!searchTerm && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                  Popular Cities
                </div>
                {loadingPopular ? (
                  <div className="px-4 py-6 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <div className="text-sm text-gray-500 mt-2">Loading cities...</div>
                  </div>
                ) : popularCities.length > 0 ? (
                  popularCities.map((city) => (
                    <button
                      key={`popular-${city.id}`}
                      onClick={() => handleLocationSelect(city)}
                      className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50"
                    >
                      <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{city.name}</div>
                        <div className="text-xs text-gray-500">{city.state}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-gray-500 text-sm">
                    No popular cities available
                  </div>
                )}
              </>
            )}

            {/* Search Results */}
            {searchTerm && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                  Search Results
                </div>
                {loadingCities ? (
                  <div className="px-4 py-6 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <div className="text-sm text-gray-500 mt-2">Searching cities...</div>
                  </div>
                ) : filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={`search-${city.id}`}
                      onClick={() => handleLocationSelect(city)}
                      className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50"
                    >
                      <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{city.name}</div>
                        <div className="text-xs text-gray-500">
                          {city.district && city.district !== city.name ? `${city.district}, ` : ''}
                          {city.state}
                          {city.pincode && ` - ${city.pincode}`}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <div className="text-sm">No cities found</div>
                    <div className="text-xs">Try a different search term</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}