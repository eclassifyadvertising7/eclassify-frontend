"use client";

import { useState } from 'react';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import LocationButton from './LocationButton';

/**
 * Demo component showing different ways to use location functionality
 */
export default function LocationDemo() {
  const [userLocation, setUserLocation] = useState(null);
  const { 
    location, 
    loading, 
    error, 
    permissionStatus, 
    isSupported, 
    requestLocation,
    watchPosition,
    clearWatch
  } = useGeolocation();

  const [watchId, setWatchId] = useState(null);

  const handleLocationReceived = (locationData) => {
    setUserLocation(locationData);
    console.log('Location received:', locationData);
    
    // Here you could:
    // 1. Store in localStorage
    localStorage.setItem('userLocation', JSON.stringify(locationData));
    
    // 2. Send to your API
    // await fetch('/api/user/location', {
    //   method: 'POST',
    //   body: JSON.stringify(locationData)
    // });
    
    // 3. Update user context
    // updateUserLocation(locationData);
  };

  const startWatching = () => {
    const id = watchPosition();
    setWatchId(id);
  };

  const stopWatching = () => {
    if (watchId) {
      clearWatch(watchId);
      setWatchId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location Demo</h2>
        <p className="text-gray-600">
          Test the location functionality with different approaches
        </p>
      </div>

      {/* Browser Support Check */}
      <div className={`p-4 rounded-lg border ${isSupported ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center">
          {isSupported ? (
            <>
              <Navigation className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800">Geolocation is supported</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">Geolocation is not supported</span>
            </>
          )}
        </div>
      </div>

      {/* Permission Status */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Permission Status</h3>
        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
          permissionStatus === 'granted' ? 'bg-green-100 text-green-800' :
          permissionStatus === 'denied' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {permissionStatus}
        </span>
      </div>

      {/* Location Button (Modal Approach) */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Modal Approach</h3>
        <p className="text-gray-600 mb-4">
          Use the LocationButton component with a modal for better UX
        </p>
        <LocationButton 
          onLocationReceived={handleLocationReceived}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        />
      </div>

      {/* Direct Hook Usage */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Direct Hook Usage</h3>
        <p className="text-gray-600 mb-4">
          Use the useGeolocation hook directly for more control
        </p>
        
        <div className="flex space-x-3 mb-4">
          <button
            onClick={requestLocation}
            disabled={loading || !isSupported}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
          >
            {loading ? 'Getting Location...' : 'Get Location Once'}
          </button>
          
          <button
            onClick={watchId ? stopWatching : startWatching}
            disabled={loading || !isSupported}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
          >
            {watchId ? 'Stop Watching' : 'Watch Position'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error.message}</span>
            </div>
          </div>
        )}
      </div>

      {/* Current Location Display */}
      {(location || userLocation) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Current Location</h3>
          
          {location && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">From Hook:</h4>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                <div>Latitude: {location.latitude}</div>
                <div>Longitude: {location.longitude}</div>
                <div>Accuracy: {location.accuracy}m</div>
                <div>Timestamp: {new Date(location.timestamp).toLocaleString()}</div>
              </div>
            </div>
          )}

          {userLocation && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">From Modal:</h4>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                <div>Latitude: {userLocation.latitude}</div>
                <div>Longitude: {userLocation.longitude}</div>
                <div>Accuracy: {userLocation.accuracy}m</div>
                <div>Timestamp: {new Date(userLocation.timestamp).toLocaleString()}</div>
              </div>
            </div>
          )}

          {/* Google Maps Link */}
          {(location || userLocation) && (
            <div className="mt-4">
              <a
                href={`https://www.google.com/maps?q=${(location || userLocation).latitude},${(location || userLocation).longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <MapPin className="h-4 w-4 mr-1" />
                View on Google Maps
              </a>
            </div>
          )}
        </div>
      )}

      {/* Usage Examples */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Integration Examples</h3>
        <div className="space-y-3 text-sm">
          <div>
            <strong>1. Store in localStorage:</strong>
            <code className="block bg-white p-2 rounded mt-1 text-xs">
              localStorage.setItem('userLocation', JSON.stringify(location))
            </code>
          </div>
          
          <div>
            <strong>2. Send to API:</strong>
            <code className="block bg-white p-2 rounded mt-1 text-xs">
              fetch('/api/user/location', {`{`} method: 'POST', body: JSON.stringify(location) {`}`})
            </code>
          </div>
          
          <div>
            <strong>3. Filter nearby listings:</strong>
            <code className="block bg-white p-2 rounded mt-1 text-xs">
              const nearbyListings = listings.filter(listing =&gt; calculateDistance(location, listing.location) &lt; 10)
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}