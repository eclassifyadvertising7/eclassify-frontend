"use client";

import { useState, useEffect } from 'react';
import { MapPin, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';

/**
 * Modal component for requesting location permission
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to close the modal
 * @param {function} onLocationReceived - Callback when location is received
 * @param {string} title - Modal title
 * @param {string} description - Modal description
 */
export default function LocationPermissionModal({
  isOpen,
  onClose,
  onLocationReceived,
  title = "Enable Location Access",
  description = "We need your location to provide better recommendations and show nearby listings."
}) {
  const [step, setStep] = useState('request'); // 'request', 'loading', 'success', 'error'
  const { 
    location, 
    loading, 
    error, 
    permissionStatus, 
    isSupported, 
    requestLocation 
  } = useGeolocation();

  const handleRequestLocation = () => {
    setStep('loading');
    requestLocation();
  };

  // Handle location received
  useEffect(() => {
    if (location && step === 'loading') {
      setStep('success');
      onLocationReceived?.(location);
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        setStep('request');
      }, 2000);
    }
  }, [location, step, onLocationReceived, onClose]);

  // Handle error
  useEffect(() => {
    if (error && step === 'loading') {
      setStep('error');
    }
  }, [error, step]);

  const handleRetry = () => {
    setStep('request');
  };

  const handleSkip = () => {
    onClose();
    setStep('request');
  };

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 rounded-full transition-all text-white z-10 hover:scale-110"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
        title="Close (ESC)"
      >
        <X className="w-6 h-6" />
      </button>

      <div 
        className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-2xl"
        style={{ animation: 'zoomIn 0.2s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Request Step */}
        {step === 'request' && (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            
            <p className="text-gray-600 mb-6">
              {description}
            </p>

            {!isSupported && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-700">
                    Location services are not supported by your browser.
                  </p>
                </div>
              </div>
            )}

            {permissionStatus === 'denied' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  <p className="text-sm text-yellow-700">
                    Location access was previously denied. Please enable it in your browser settings.
                  </p>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Skip for now
              </button>
              <button
                onClick={handleRequestLocation}
                disabled={!isSupported}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Enable Location
              </button>
            </div>
          </div>
        )}

        {/* Loading Step */}
        {step === 'loading' && (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Getting your location...
            </h3>
            
            <p className="text-gray-600">
              Please allow location access when prompted by your browser.
            </p>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Location Enabled!
            </h3>
            
            <p className="text-gray-600">
              We can now show you personalized content based on your location.
            </p>
          </div>
        )}

        {/* Error Step */}
        {step === 'error' && (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Location Access Failed
            </h3>
            
            <p className="text-gray-600 mb-6">
              {error?.message || 'Unable to get your location. Please try again or check your browser settings.'}
            </p>

            <div className="flex space-x-3">
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Skip for now
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes zoomIn {
            from { 
              opacity: 0;
              transform: scale(0.95);
            }
            to { 
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
}