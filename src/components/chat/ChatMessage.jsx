/**
 * Chat Message Component
 * Displays individual message in chat window
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateTime } from "@/lib/dateTimeUtils";
import { Download } from "lucide-react";

export default function ChatMessage({ message, isOwn, sender, onImageClick }) {
  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'text':
        return (
          <div className={`px-4 py-2 rounded-lg max-w-md ${
            isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
          }`}>
            <p className="text-sm whitespace-pre-wrap break-words">{message.messageText}</p>
          </div>
        );

      case 'image':
        const imageUrl = message.mediaUrl || message.previewUrl;
        console.log('Image message:', { messageType: message.messageType, mediaUrl: message.mediaUrl, previewUrl: message.previewUrl, uploading: message.uploading });
        
        if (!imageUrl) {
          return (
            <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 text-sm">
              Image not available
            </div>
          );
        }
        
        return (
          <div className="relative group">
            <div className="relative">
              <img
                src={imageUrl}
                alt="Shared image"
                className="rounded-lg w-32 h-40 object-cover cursor-pointer hover:brightness-90 transition-all"
                onClick={() => {
                  console.log('Image clicked:', imageUrl);
                  if (message.mediaUrl && onImageClick) {
                    onImageClick(message.mediaUrl);
                  }
                }}
                onError={(e) => {
                  console.error('Image load error:', imageUrl);
                  e.target.src = '/assets/img/placeholder.jpg';
                }}
              />
              {/* Hover Overlay */}
              {message.mediaUrl && !message.uploading && (
                <div 
                  className="absolute inset-0 rounded-lg transition-all flex items-center justify-center pointer-events-none group-hover:opacity-100 opacity-0"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                >
                  <Download className="w-6 h-6 text-white" />
                </div>
              )}
              {/* Upload Spinner */}
              {message.uploading && (
                <div 
                  className="absolute inset-0 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            {message.messageText && (
              <p className={`mt-2 text-sm ${isOwn ? 'text-gray-700' : 'text-gray-700'}`}>
                {message.messageText}
              </p>
            )}
          </div>
        );

      case 'location':
        return (
          <div className={`px-4 py-3 rounded-lg max-w-md ${
            isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
          }`}>
            <div className="flex items-start gap-2">
              <span className="text-lg">📍</span>
              <div>
                {message.messageText && (
                  <p className="text-sm font-medium mb-1">{message.messageText}</p>
                )}
                {message.messageMetadata?.address && (
                  <p className="text-xs opacity-90">{message.messageMetadata.address}</p>
                )}
                {message.messageMetadata?.lat && message.messageMetadata?.lng && (
                  <a
                    href={`https://www.google.com/maps?q=${message.messageMetadata.lat},${message.messageMetadata.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline mt-1 inline-block"
                  >
                    View on map
                  </a>
                )}
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="bg-gray-100 text-gray-600 text-xs px-3 py-2 rounded-full text-center max-w-md mx-auto">
            {message.messageText}
          </div>
        );

      default:
        return null;
    }
  };

  // System messages are centered
  if (message.messageType === 'system') {
    return (
      <div className="flex justify-center my-4">
        {renderMessageContent()}
      </div>
    );
  }

  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={sender?.profile?.profilePhoto} />
          <AvatarFallback>{sender?.fullName?.[0] || 'U'}</AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {renderMessageContent()}
        
        {/* Timestamp */}
        <span className="text-xs text-gray-500 mt-1 px-1">
          {formatDateTime(message.created_at || message.createdAt, 'chat')}
          {(message.edited_at || message.editedAt) && ' (edited)'}
          {isOwn && message.isRead && ' ✓✓'}
        </span>
      </div>
    </div>
  );
}
