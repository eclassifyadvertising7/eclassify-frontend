/**
 * Chat Header Component
 * Top section of chat window with listing info and actions
 */

import { Flag, Phone, MoreVertical, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ChatHeader({ 
  room, 
  otherUser, 
  onReport, 
  onRequestContact, 
  onBlock, 
  onDelete, 
  onSafetyTips,
  onClose 
}) {
  const coverImage = room?.listing?.media?.[0]?.mediaUrl || room?.listing?.media?.[0]?.thumbnailUrl;

  return (
    <div className="border-b bg-white p-4">
      <div className="flex items-center justify-between">
        {/* Left: Listing & User Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={coverImage || '/assets/img/placeholder.jpg'}
            alt={room?.listing?.title}
            className="w-12 h-12 object-cover rounded"
          />
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-sm truncate">{room?.listing?.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Avatar className="w-5 h-5">
                <AvatarImage src={otherUser?.profile?.profilePhoto} />
                <AvatarFallback>{otherUser?.fullName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{otherUser?.fullName}</span>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Report */}
          <button
            onClick={onReport}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Report"
          >
            <Flag className="w-5 h-5 text-gray-600" />
          </button>

          {/* Request Contact */}
          <button
            onClick={onRequestContact}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Request Contact"
          >
            <Phone className="w-5 h-5 text-gray-600" />
          </button>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onBlock}>
                Block User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                Delete Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSafetyTips}>
                Safety Tips
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
