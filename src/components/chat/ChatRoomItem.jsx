/**
 * Chat Room Item Component
 * Displays individual chat room in the sidebar
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateTime } from "@/lib/dateTimeUtils";

export default function ChatRoomItem({ room, isActive, onClick, currentUserId }) {
  // Determine if current user is buyer or seller
  const isBuyer = currentUserId === room.buyerId;
  const otherUser = isBuyer ? room.seller : room.buyer;
  const unreadCount = isBuyer ? room.unreadCountBuyer : room.unreadCountSeller;
  const isImportant = isBuyer ? room.isImportantBuyer : room.isImportantSeller;

  // Get listing cover image
  const coverImage = room.listing?.media?.[0]?.thumbnailUrl || room.listing?.media?.[0]?.mediaUrl;

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 p-4 cursor-pointer border-b hover:bg-gray-50 transition-colors ${
        isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
    >
      {/* Listing Image */}
      <div className="flex-shrink-0">
        <img
          src={coverImage || '/assets/img/placeholder.jpg'}
          alt={room.listing?.title}
          className="w-16 h-16 object-cover rounded"
        />
      </div>

      {/* Room Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="w-6 h-6">
              <AvatarImage src={otherUser?.profile?.profilePhoto} />
              <AvatarFallback>{otherUser?.fullName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-sm truncate">{otherUser?.fullName}</h3>
          </div>
          {room.lastMessageAt && (
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatDateTime(room.lastMessageAt, 'relative')}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 truncate mt-1">{room.listing?.title}</p>
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-semibold text-gray-900">
            ₹{room.listing?.price?.toLocaleString('en-IN')}
          </span>
          
          <div className="flex items-center gap-2">
            {isImportant && (
              <span className="text-yellow-500 text-xs">⭐</span>
            )}
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
