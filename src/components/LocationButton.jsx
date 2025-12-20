"use client";

import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import LocationPermissionModal from './LocationPermissionModal';

/**
 * Button component for requesting location with modal
 * @param {string} className - Additional CSS classes
 * @param {function} onLocationReceived - Callback when location is received
 * @param {boolean} showText - Whether to show text alongside icon
 * @param {string} text - Button text
 */
export default function LocationButton({ 
  className = "", 
  onLocationReceived,
  showText = true,
  text = "Add Location"
}) {
  const [showModal, setShowModal] = useState(false);
  const { location, loading, permissionStatus } = useGeolocation();

  const handleLocationReceived = (locationData) => {
    onLocationReceived?.(locationData);
    setShowModal(false);
  };

  const getButtonContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {showText && <span className="ml-1">Getting location...</span>}
        </>
      );
    }

    if (location) {
      return (
        <>
          <MapPin className="h-4 w-4 text-green-600" />
          {showText && <span className="ml-1 text-green-600">Location enabled</span>}
        </>
      );
    }

    return (
      <>
        <MapPin className="h-4 w-4" />
        {showText && <span className="ml-1">{text}</span>}
      </>
    );
  };

  const getButtonStyle = () => {
    if (location) {
      return "text-green-600 hover:text-green-700";
    }
    if (permissionStatus === 'denied') {
      return "text-red-600 hover:text-red-700";
    }
    return "text-gray-600 hover:text-gray-900";
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center font-bold ${getButtonStyle()} ${className}`}
        disabled={loading}
      >
        {getButtonContent()}
      </button>

      <LocationPermissionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLocationReceived={handleLocationReceived}
      />
    </>
  );
}