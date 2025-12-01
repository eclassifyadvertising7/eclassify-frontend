/**
 * DateTime Utility Functions
 * All datetime formatting functions following Indian format standards
 */

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatDistanceToNow(date) {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return past.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

/**
 * Format message timestamp
 */
export function formatMessageTime(date) {
  const messageDate = new Date(date);
  const now = new Date();
  const diffInDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    // Today - show time only
    return messageDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    // Yesterday
    return 'Yesterday';
  } else if (diffInDays < 7) {
    // This week - show day name
    return messageDate.toLocaleDateString('en-IN', { weekday: 'short' });
  } else {
    // Older - show date
    return messageDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  }
}

/**
 * Comprehensive DateTime Formatter for Indian Format
 * Returns different formats based on the requested type
 * 
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type
 * @returns {string} Formatted date string
 * 
 * Available formats:
 * - 'full': "01 Jan 2025, 10:15 AM"
 * - 'date': "01 Jan 2025"
 * - 'dateShort': "01/01/2025" (DD/MM/YYYY)
 * - 'time': "10:15 AM"
 * - 'smart': "Today 10:15 AM" / "Yesterday 3:45 PM" / "15 Jan 9:00 AM"
 * - 'relative': "Just now" / "2 hours ago" / "3 days ago"
 * - 'chat': Smart format for chat messages
 * - 'listing': Smart format for listings
 */
export function formatDateTime(date, format = 'full') {
  if (!date) return '';
  
  const d = new Date(date);
  const now = new Date();
  
  // Check if date is valid
  if (isNaN(d.getTime())) return '';

  switch (format) {
    case 'full':
      // "01 Jan 2025, 10:15 AM"
      return d.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }) + ', ' + d.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });

    case 'date':
      // "01 Jan 2025"
      return d.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });

    case 'dateShort':
      // "01/01/2025" (DD/MM/YYYY)
      return d.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });

    case 'time':
      // "10:15 AM"
      return d.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });

    case 'smart': {
      // "Today 10:15 AM", "Yesterday 3:45 PM", "Mon 9:00 AM", "15 Jan 9:00 AM"
      const diffInDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      const time = d.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
      
      if (diffInDays === 0) return `Today ${time}`;
      if (diffInDays === 1) return `Yesterday ${time}`;
      if (diffInDays < 7) {
        const day = d.toLocaleDateString('en-IN', { weekday: 'short' });
        return `${day} ${time}`;
      }
      const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      return `${dateStr} ${time}`;
    }

    case 'relative': {
      // "Just now", "2 minutes ago", "5 hours ago", "3 days ago", "15 Jan 2025"
      const diffInSeconds = Math.floor((now - d) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) {
        const mins = Math.floor(diffInSeconds / 60);
        return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
      }
      if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      }
      if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
      }
      
      return d.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    }

    case 'chat': {
      // Optimized for chat: "10:15 AM", "Yesterday", "Mon", "15 Jan"
      const diffInDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) {
        return d.toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true
        });
      }
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) {
        return d.toLocaleDateString('en-IN', { weekday: 'short' });
      }
      return d.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short' 
      });
    }

    case 'listing': {
      // Optimized for listings: "30 minutes ago", "5 hours ago", "3 days ago", "15 Jan 2025"
      const diffInSeconds = Math.floor((now - d) / 1000);
      
      if (diffInSeconds < 3600) {
        const mins = Math.floor(diffInSeconds / 60);
        return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
      }
      if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      }
      if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
      }
      
      return d.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    }

    default:
      return formatDateTime(date, 'full');
  }
}
