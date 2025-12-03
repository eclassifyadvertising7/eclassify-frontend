/**
 * Image Modal Component
 * Modern lightbox for viewing and downloading chat images
 */

import { X, Download } from "lucide-react";
import { useEffect } from "react";

export default function ImageModal({ imageUrl, onClose }) {
  console.log('ImageModal rendered with URL:', imageUrl);
  
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleDownload = async (e) => {
    e.stopPropagation();
    console.log('Download clicked for:', imageUrl);
    
    try {
      // Simple download approach - works better with CORS
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `chat-image-${Date.now()}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Download initiated');
    } catch (error) {
      console.error('Download failed:', error);
      
      // Fallback: open in new tab
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
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

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="absolute top-4 right-20 p-3 rounded-full transition-all text-white z-10 hover:scale-110"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
        title="Download"
      >
        <Download className="w-6 h-6" />
      </button>

      {/* Image Container */}
      <div 
        className="relative p-4"
        style={{ 
          maxWidth: '90vw',
          maxHeight: '90vh',
          animation: 'zoomIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Full size"
          className="rounded-lg shadow-2xl"
          style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Hint Text */}
      <div 
        className="absolute bottom-4 text-white text-sm"
        style={{ 
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.7
        }}
      >
        Click outside or press ESC to close
      </div>

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
  );
}
