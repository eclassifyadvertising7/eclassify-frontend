import httpClient from '../httpClient';

/**
 * Reports Service
 * Handles all report-related API calls for listings and users
 */

// ============================================
// END-USER REPORT ENDPOINTS
// ============================================

/**
 * Report a listing
 * @param {number} listingId - ID of the listing to report
 * @param {Object} data - Report data
 * @param {string} data.reportType - Type of report (spam, fraud, offensive, etc.)
 * @param {string} data.reason - Detailed reason for the report
 * @returns {Promise<Object>} Report creation response
 */
export const reportListing = async (listingId, data) => {
  const response = await httpClient.post(
    `/end-user/reports/listing/${listingId}`,
    data
  );
  return response.data;
};

/**
 * Report a user
 * @param {number} userId - ID of the user to report
 * @param {Object} data - Report data
 * @param {string} data.reportType - Type of report (scammer, fake_profile, harassment, etc.)
 * @param {string} data.reason - Detailed reason for the report
 * @param {string} [data.context] - Additional context
 * @param {number} [data.relatedListingId] - Related listing ID if applicable
 * @param {number} [data.relatedChatRoomId] - Related chat room ID if applicable
 * @returns {Promise<Object>} Report creation response
 */
export const reportUser = async (userId, data) => {
  const response = await httpClient.post(
    `/end-user/reports/user/${userId}`,
    data
  );
  return response.data;
};

// ============================================
// ADMIN PANEL ENDPOINTS - LISTING REPORTS
// ============================================

/**
 * Get all listing reports with filters
 * @param {Object} params - Query parameters
 * @param {string} [params.status] - Filter by status (pending, under_review, resolved, dismissed)
 * @param {string} [params.reportType] - Filter by report type
 * @param {number} [params.listingId] - Filter by listing ID
 * @param {number} [params.reportedBy] - Filter by reporter user ID
 * @param {string} [params.startDate] - Filter by start date
 * @param {string} [params.endDate] - Filter by end date
 * @param {number} [params.page] - Page number (default: 1)
 * @param {number} [params.limit] - Items per page (default: 20)
 * @returns {Promise<Object>} Paginated listing reports
 */
export const getListingReports = async (params = {}) => {
  const response = await httpClient.get('/panel/reports/listings', { params });
  return response.data;
};

/**
 * Get a specific listing report by ID
 * @param {number} reportId - Report ID
 * @returns {Promise<Object>} Report details
 */
export const getListingReportById = async (reportId) => {
  const response = await httpClient.get(`/panel/reports/listings/${reportId}`);
  return response.data;
};

/**
 * Get all reports for a specific listing
 * @param {number} listingId - Listing ID
 * @param {Object} params - Query parameters
 * @param {number} [params.page] - Page number
 * @param {number} [params.limit] - Items per page
 * @returns {Promise<Object>} Paginated reports for the listing
 */
export const getReportsByListing = async (listingId, params = {}) => {
  const response = await httpClient.get(
    `/panel/reports/listings/by-listing/${listingId}`,
    { params }
  );
  return response.data;
};

/**
 * Update listing report status
 * @param {number} reportId - Report ID
 * @param {Object} data - Update data
 * @param {string} data.status - New status (pending, under_review, resolved, dismissed)
 * @param {string} [data.adminNotes] - Admin notes
 * @param {string} [data.actionTaken] - Action taken (none, listing_removed, listing_edited, user_warned, user_suspended, false_report)
 * @returns {Promise<Object>} Updated report
 */
export const updateListingReportStatus = async (reportId, data) => {
  const response = await httpClient.patch(
    `/panel/reports/listings/status/${reportId}`,
    data
  );
  return response.data;
};

/**
 * Get listing report statistics
 * @returns {Promise<Object>} Statistics about listing reports
 */
export const getListingReportStats = async () => {
  const response = await httpClient.get('/panel/reports/listings/stats');
  return response.data;
};

// ============================================
// ADMIN PANEL ENDPOINTS - USER REPORTS
// ============================================

/**
 * Get all user reports with filters
 * @param {Object} params - Query parameters
 * @param {string} [params.status] - Filter by status
 * @param {string} [params.reportType] - Filter by report type
 * @param {number} [params.reportedUserId] - Filter by reported user ID
 * @param {number} [params.reportedBy] - Filter by reporter user ID
 * @param {string} [params.startDate] - Filter by start date
 * @param {string} [params.endDate] - Filter by end date
 * @param {number} [params.page] - Page number
 * @param {number} [params.limit] - Items per page
 * @returns {Promise<Object>} Paginated user reports
 */
export const getUserReports = async (params = {}) => {
  const response = await httpClient.get('/panel/reports/users', { params });
  return response.data;
};

/**
 * Get a specific user report by ID
 * @param {number} reportId - Report ID
 * @returns {Promise<Object>} Report details
 */
export const getUserReportById = async (reportId) => {
  const response = await httpClient.get(`/panel/reports/users/${reportId}`);
  return response.data;
};

/**
 * Get all reports for a specific user
 * @param {number} userId - User ID
 * @param {Object} params - Query parameters
 * @param {number} [params.page] - Page number
 * @param {number} [params.limit] - Items per page
 * @returns {Promise<Object>} Paginated reports for the user
 */
export const getReportsByUser = async (userId, params = {}) => {
  const response = await httpClient.get(
    `/panel/reports/users/by-user/${userId}`,
    { params }
  );
  return response.data;
};

/**
 * Update user report status
 * @param {number} reportId - Report ID
 * @param {Object} data - Update data
 * @param {string} data.status - New status (pending, under_review, resolved, dismissed)
 * @param {string} [data.adminNotes] - Admin notes
 * @param {string} [data.actionTaken] - Action taken (none, warning_sent, user_suspended, user_banned, listings_removed, false_report)
 * @returns {Promise<Object>} Updated report
 */
export const updateUserReportStatus = async (reportId, data) => {
  const response = await httpClient.patch(
    `/panel/reports/users/status/${reportId}`,
    data
  );
  return response.data;
};

/**
 * Get user report statistics
 * @returns {Promise<Object>} Statistics about user reports
 */
export const getUserReportStats = async () => {
  const response = await httpClient.get('/panel/reports/users/stats');
  return response.data;
};

// ============================================
// CONSTANTS
// ============================================

export const LISTING_REPORT_TYPES = {
  SPAM: 'spam',
  FRAUD: 'fraud',
  OFFENSIVE: 'offensive',
  DUPLICATE: 'duplicate',
  WRONG_CATEGORY: 'wrong_category',
  MISLEADING: 'misleading',
  SOLD: 'sold',
  OTHER: 'other'
};

export const USER_REPORT_TYPES = {
  SCAMMER: 'scammer',
  FAKE_PROFILE: 'fake_profile',
  HARASSMENT: 'harassment',
  SPAM: 'spam',
  INAPPROPRIATE_BEHAVIOR: 'inappropriate_behavior',
  FAKE_LISTINGS: 'fake_listings',
  NON_RESPONSIVE: 'non_responsive',
  OTHER: 'other'
};

export const REPORT_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed'
};

export const LISTING_REPORT_ACTIONS = {
  NONE: 'none',
  LISTING_REMOVED: 'listing_removed',
  LISTING_EDITED: 'listing_edited',
  USER_WARNED: 'user_warned',
  USER_SUSPENDED: 'user_suspended',
  FALSE_REPORT: 'false_report'
};

export const USER_REPORT_ACTIONS = {
  NONE: 'none',
  WARNING_SENT: 'warning_sent',
  USER_SUSPENDED: 'user_suspended',
  USER_BANNED: 'user_banned',
  LISTINGS_REMOVED: 'listings_removed',
  FALSE_REPORT: 'false_report'
};
