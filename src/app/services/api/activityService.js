import httpClient from '../httpClient'

/**
 * Activity Logging Service
 * Handles user activity tracking for analytics and recommendations
 */
const activityService = {
  /**
   * Log when a user views a listing detail page
   * @param {number} listingId - The ID of the listing being viewed
   * @param {Object} metadata - Additional tracking data
   * @returns {Promise<Object>} Response with activity log ID
   */
  logListingView: async (listingId, metadata = {}) => {
    try {
      const response = await httpClient.post('/end-user/activity/log-view', {
        listingId,
        metadata: {
          referrer_source: metadata.referrer_source || 'direct_link',
          page_url: metadata.page_url || window.location.href,
          view_duration: metadata.view_duration || null,
          scroll_depth: metadata.scroll_depth || 0,
          ...metadata
        }
      })
      return response
    } catch (error) {
      console.error('Error logging listing view:', error)
      // Don't throw error - activity logging should be non-blocking
      return { success: false, error }
    }
  },

  /**
   * Log when a user initiates chat with a seller
   * @param {number} listingId - The ID of the listing
   * @param {Object} metadata - Chat initiation data
   * @returns {Promise<Object>} Response with activity log ID
   */
  logChatInitiation: async (listingId, metadata = {}) => {
    try {
      const response = await httpClient.post('/end-user/activity/log-chat', {
        listingId,
        metadata: {
          seller_id: metadata.seller_id,
          chat_room_id: metadata.chat_room_id || null,
          button_location: metadata.button_location || 'listing_header',
          ...metadata
        }
      })
      return response
    } catch (error) {
      console.error('Error logging chat initiation:', error)
      // Don't throw error - activity logging should be non-blocking
      return { success: false, error }
    }
  },

  /**
   * Get authenticated user's activity summary
   * @param {string} startDate - Start date (ISO format)
   * @param {string} endDate - End date (ISO format)
   * @returns {Promise<Object>} Activity summary
   */
  getActivitySummary: async (startDate = null, endDate = null) => {
    try {
      const params = {}
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      
      const response = await httpClient.get('/end-user/activity/summary', { params })
      return response
    } catch (error) {
      console.error('Error fetching activity summary:', error)
      throw error
    }
  }
}

export default activityService
