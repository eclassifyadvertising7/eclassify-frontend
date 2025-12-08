/**
 * View Tracking Utility
 * Manages listing view counts with localStorage throttling
 * Only increments view count if listing hasn't been viewed in the last hour
 */

const VIEW_STORAGE_KEY = 'listing_views'
const VIEW_COOLDOWN_MS = 60 * 60 * 1000 // 1 hour in milliseconds

/**
 * Get all stored listing views from localStorage
 * @returns {Object} Object with listingId as key and timestamp as value
 */
const getStoredViews = () => {
  if (typeof window === 'undefined') return {}
  
  try {
    const stored = localStorage.getItem(VIEW_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Error reading view tracking data:', error)
    return {}
  }
}

/**
 * Save listing views to localStorage
 * @param {Object} views - Object with listingId as key and timestamp as value
 */
const saveStoredViews = (views) => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(views))
  } catch (error) {
    console.error('Error saving view tracking data:', error)
  }
}

/**
 * Check if a listing can be viewed (hasn't been viewed in the last hour)
 * @param {number|string} listingId - The listing ID to check
 * @returns {boolean} True if view should be counted, false otherwise
 */
export const canIncrementView = (listingId) => {
  const views = getStoredViews()
  const lastViewed = views[listingId]
  
  if (!lastViewed) {
    return true // Never viewed before
  }
  
  const timeSinceLastView = Date.now() - lastViewed
  return timeSinceLastView >= VIEW_COOLDOWN_MS
}

/**
 * Record that a listing has been viewed
 * @param {number|string} listingId - The listing ID to record
 */
export const recordView = (listingId) => {
  const views = getStoredViews()
  views[listingId] = Date.now()
  saveStoredViews(views)
}

/**
 * Clean up old view records (older than 24 hours)
 * Call this periodically to prevent localStorage from growing too large
 */
export const cleanupOldViews = () => {
  const views = getStoredViews()
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
  
  const cleanedViews = Object.entries(views).reduce((acc, [id, timestamp]) => {
    if (timestamp > oneDayAgo) {
      acc[id] = timestamp
    }
    return acc
  }, {})
  
  saveStoredViews(cleanedViews)
}

/**
 * Get time remaining until next view can be counted
 * @param {number|string} listingId - The listing ID to check
 * @returns {number} Milliseconds until next view, or 0 if can view now
 */
export const getTimeUntilNextView = (listingId) => {
  const views = getStoredViews()
  const lastViewed = views[listingId]
  
  if (!lastViewed) {
    return 0
  }
  
  const timeSinceLastView = Date.now() - lastViewed
  const timeRemaining = VIEW_COOLDOWN_MS - timeSinceLastView
  
  return Math.max(0, timeRemaining)
}
