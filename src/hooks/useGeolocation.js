import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for handling browser geolocation
 * @param {Object} options - Geolocation options
 * @returns {Object} - Location data, loading state, error, and request function
 */
export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'granted', 'denied', 'prompt'

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000, // 5 minutes
    ...options
  };

  // Check if geolocation is supported
  const isSupported = 'geolocation' in navigator;

  // Check permission status
  const checkPermissionStatus = useCallback(async () => {
    if (!isSupported) return;
    
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(permission.state);
        
        // Listen for permission changes
        permission.onchange = () => {
          setPermissionStatus(permission.state);
        };
      }
    } catch (err) {
      console.warn('Could not check geolocation permission:', err);
    }
  }, [isSupported]);

  // Request location
  const requestLocation = useCallback(() => {
    if (!isSupported) {
      setError(new Error('Geolocation is not supported by this browser'));
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp
        });
        setLoading(false);
      },
      (err) => {
        let errorMessage = 'Failed to get location';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            setPermissionStatus('denied');
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred';
            break;
        }
        
        setError(new Error(errorMessage));
        setLoading(false);
      },
      defaultOptions
    );
  }, [isSupported, defaultOptions]);

  // Watch position (for continuous tracking)
  const watchPosition = useCallback(() => {
    if (!isSupported) {
      setError(new Error('Geolocation is not supported by this browser'));
      return null;
    }

    setLoading(true);
    setError(null);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp
        });
        setLoading(false);
      },
      (err) => {
        let errorMessage = 'Failed to watch location';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            setPermissionStatus('denied');
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred';
            break;
        }
        
        setError(new Error(errorMessage));
        setLoading(false);
      },
      defaultOptions
    );

    return watchId;
  }, [isSupported, defaultOptions]);

  // Clear watch
  const clearWatch = useCallback((watchId) => {
    if (watchId && isSupported) {
      navigator.geolocation.clearWatch(watchId);
    }
  }, [isSupported]);

  // Check permission on mount
  useEffect(() => {
    checkPermissionStatus();
  }, [checkPermissionStatus]);

  return {
    location,
    loading,
    error,
    permissionStatus,
    isSupported,
    requestLocation,
    watchPosition,
    clearWatch,
    checkPermissionStatus
  };
};