import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  formatDistanceToNow as _formatDistanceToNow,
  formatMessageTime as _formatMessageTime,
  formatDateTime as _formatDateTime
} from "@/lib/dateTimeUtils";

/**
 * Utility function for merging Tailwind CSS classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * DateTime utilities are now in dateTimeUtils.js
 * Re-exported here for backward compatibility
 */
export const formatDistanceToNow = _formatDistanceToNow;
export const formatMessageTime = _formatMessageTime;
export const formatDateTime = _formatDateTime;

/**
 * Get badge configuration for postedByType
 * @param {string} postedByType - Type of poster ('owner', 'agent', 'dealer')
 * @returns {object} Badge configuration with label, color classes, and icon
 */
export function getPostedByTypeBadge(postedByType) {
  const badges = {
    owner: {
      label: 'Owner',
      className: 'bg-blue-100 text-blue-800',
      icon: '👤'
    },
    agent: {
      label: 'Agent',
      className: 'bg-green-100 text-green-800',
      icon: '🏢'
    },
    dealer: {
      label: 'Authorized Dealer',
      className: 'bg-purple-100 text-purple-800',
      icon: '🏪'
    }
  };
  
  return badges[postedByType] || badges.owner;
}
