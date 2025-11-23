/**
 * Listing Service - Phase 1: End-User Operations
 * Handles listing management for end users (create, update, view, delete, submit, media)
 */

import httpClient from '../httpClient';

export const listingService = {
  // ============ END USER - Listing Management ============
  
  /**
   * Create a new listing in draft status
   * @param {Object} listingData - Listing data (car or property)
   * @returns {Promise} Created listing
   */
  createListing: async (listingData) => {
    return httpClient.post('/end-user/listings', listingData);
  },

  /**
   * Get all listings for authenticated user
   * @param {Object} filters - Filter options
   * @param {string} filters.status - Filter by status (draft, pending, active, expired, sold, rejected)
   * @param {number} filters.categoryId - Filter by category ID
   * @param {string} filters.search - Search in title and description
   * @param {number} filters.page - Page number (default: 1)
   * @param {number} filters.limit - Items per page (default: 20)
   * @returns {Promise} User's listings with pagination
   */
  getMyListings: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const query = params.toString();
    return httpClient.get(`/end-user/listings${query ? `?${query}` : ''}`);
  },

  /**
   * Get detailed information about a specific listing
   * @param {number} listingId - Listing ID
   * @returns {Promise} Listing details
   */
  getMyListingById: async (listingId) => {
    return httpClient.get(`/end-user/listings/${listingId}`);
  },

  /**
   * Update listing details (only for draft or rejected listings)
   * @param {number} listingId - Listing ID
   * @param {Object} listingData - Updated listing data
   * @returns {Promise} Updated listing
   */
  updateListing: async (listingId, listingData) => {
    return httpClient.put(`/end-user/listings/${listingId}`, listingData);
  },

  /**
   * Submit listing for admin approval
   * @param {number} listingId - Listing ID
   * @returns {Promise} Updated listing with pending status
   */
  submitForApproval: async (listingId) => {
    return httpClient.post(`/end-user/listings/submit/${listingId}`, {
      status: 'pending'
    });
  },

  /**
   * Mark listing as sold
   * @param {number} listingId - Listing ID
   * @returns {Promise} Updated listing with sold status
   */
  markAsSold: async (listingId) => {
    return httpClient.patch(`/end-user/listings/sold/${listingId}`, {
      status: 'sold'
    });
  },

  /**
   * Upload media (images/videos) for a listing
   * @param {number} listingId - Listing ID
   * @param {FormData} formData - FormData with media files
   * @returns {Promise} Uploaded media details
   */
  uploadMedia: async (listingId, formData) => {
    return httpClient.upload(`/end-user/listings/media/${listingId}`, formData);
  },

  /**
   * Delete specific media from listing
   * @param {number} listingId - Listing ID
   * @param {number} mediaId - Media ID to delete
   * @returns {Promise} Success response
   */
  deleteMedia: async (listingId, mediaId) => {
    return httpClient.delete(`/end-user/listings/delete-media/${listingId}/media/${mediaId}`);
  },

  /**
   * Delete listing (soft delete)
   * @param {number} listingId - Listing ID
   * @returns {Promise} Success response
   */
  deleteListing: async (listingId) => {
    return httpClient.delete(`/end-user/listings/${listingId}`);
  },

  /**
   * Get listing statistics for authenticated user
   * @returns {Promise} Statistics (total, draft, pending, active, expired, sold, rejected)
   */
  getMyStats: async () => {
    return httpClient.get('/end-user/listings/stats');
  },
};

export default listingService;
