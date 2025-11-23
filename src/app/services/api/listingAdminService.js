/**
 * Listing Admin Service - Phase 2: Admin Panel Operations
 * Handles listing management for admin users (approve, reject, featured, manage all)
 */

import httpClient from '../httpClient';

export const listingAdminService = {
  // ============ ADMIN - Listing Management ============
  
  /**
   * Get all listings with filters (admin view)
   * @param {Object} filters - Filter options
   * @param {string} filters.status - Filter by status
   * @param {number} filters.categoryId - Filter by category
   * @param {number} filters.stateId - Filter by state
   * @param {number} filters.cityId - Filter by city
   * @param {number} filters.userId - Filter by user
   * @param {boolean} filters.isFeatured - Filter featured listings
   * @param {number} filters.minPrice - Minimum price
   * @param {number} filters.maxPrice - Maximum price
   * @param {string} filters.search - Search query
   * @param {string} filters.sortBy - Sort order (price_asc, price_desc)
   * @param {number} filters.page - Page number (default: 1)
   * @param {number} filters.limit - Items per page (default: 20)
   * @returns {Promise} All listings with pagination
   */
  getAllListings: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.stateId) params.append('stateId', filters.stateId);
    if (filters.cityId) params.append('cityId', filters.cityId);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const query = params.toString();
    return httpClient.get(`/panel/listings${query ? `?${query}` : ''}`);
  },

  /**
   * Get listing statistics (admin view)
   * @returns {Promise} Statistics (total, draft, pending, active, expired, sold, rejected)
   */
  getStats: async () => {
    return httpClient.get('/panel/listings/stats');
  },

  /**
   * Get detailed listing information (admin view)
   * @param {number} listingId - Listing ID
   * @returns {Promise} Listing details with user info
   */
  getListingById: async (listingId) => {
    return httpClient.get(`/panel/listings/${listingId}`);
  },

  /**
   * Approve a pending listing
   * @param {number} listingId - Listing ID
   * @returns {Promise} Updated listing with active status
   */
  approveListing: async (listingId) => {
    return httpClient.patch(`/panel/listings/approve/${listingId}`);
  },

  /**
   * Reject a pending listing with reason
   * @param {number} listingId - Listing ID
   * @param {string} reason - Rejection reason
   * @returns {Promise} Updated listing with rejected status
   */
  rejectListing: async (listingId, reason) => {
    return httpClient.patch(`/panel/listings/reject/${listingId}`, { reason });
  },

  /**
   * Update featured status for a listing
   * @param {number} listingId - Listing ID
   * @param {boolean} isFeatured - Featured status
   * @param {number} days - Number of days to feature (optional)
   * @returns {Promise} Updated listing with featured status
   */
  updateFeaturedStatus: async (listingId, isFeatured, days = null) => {
    const data = { isFeatured };
    if (days) data.days = days;
    return httpClient.patch(`/panel/listings/featured/${listingId}`, data);
  },

  /**
   * Delete listing (admin soft delete)
   * @param {number} listingId - Listing ID
   * @returns {Promise} Success response
   */
  deleteListing: async (listingId) => {
    return httpClient.delete(`/panel/listings/${listingId}`);
  },
};

export default listingAdminService;
