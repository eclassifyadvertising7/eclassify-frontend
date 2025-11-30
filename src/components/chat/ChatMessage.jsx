/**
 * Chat Message Component
 * Displays individual message in chat window
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateTime } from "@/lib/dateTimeUtils";

export default function ChatMessage({ message, isOwn, sender }) {
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
        return (
          <div className="max-w-sm">
            <img
              src={message.mediaUrl}
              alt="Shared image"
              className="rounded-lg w-full h-auto cursor-pointer hover:opacity-90"
              onClick={() => window.open(message.mediaUrl, '_blank')}
            />
            {message.messageText && (
              <p className={`mt-2 text-sm px-2 ${isOwn ? 'text-white' : 'text-gray-700'}`}>
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
