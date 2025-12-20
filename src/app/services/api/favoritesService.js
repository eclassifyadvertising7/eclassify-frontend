/**
 * Favorites Service
 * API service for managing user favorites functionality
 */

import httpClient from '../httpClient';

class FavoritesService {
  /**
   * Add listing to user's favorites
   * @param {number} listingId - ID of the listing to favorite
   * @returns {Promise} API response
   */
  async addToFavorites(listingId) {
    try {
      const response = await httpClient.post('/end-user/favorites', {
        listingId: parseInt(listingId)
      });
      return response;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  /**
   * Remove listing from user's favorites
   * @param {number} listingId - ID of the listing to unfavorite
   * @returns {Promise} API response
   */
  async removeFromFavorites(listingId) {
    try {
      const response = await httpClient.delete(`/end-user/favorites/${listingId}`);
      return response;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  /**
   * Get user's favorite listings with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 20, max: 50)
   * @param {number} params.categoryId - Filter by category
   * @param {number} params.priceMin - Minimum price filter
   * @param {number} params.priceMax - Maximum price filter
   * @param {string} params.sortBy - Sort field: created_at, price
   * @param {string} params.sortOrder - Sort order: ASC, DESC
   * @returns {Promise} API response with favorites list and pagination
   */
  async getUserFavorites(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Set defaults and add parameters
      const {
        page = 1,
        limit = 20,
        categoryId,
        priceMin,
        priceMax,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = params;

      queryParams.append('page', page.toString());
      queryParams.append('limit', Math.min(limit, 50).toString());
      queryParams.append('sortBy', sortBy);
      queryParams.append('sortOrder', sortOrder);

      if (categoryId) queryParams.append('categoryId', categoryId.toString());
      if (priceMin) queryParams.append('priceMin', priceMin.toString());
      if (priceMax) queryParams.append('priceMax', priceMax.toString());

      const response = await httpClient.get(`/end-user/favorites?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      throw error;
    }
  }

  /**
   * Check if a specific listing is favorited by user
   * @param {number} listingId - ID of the listing to check
   * @returns {Promise} API response with isFavorited boolean
   */
  async checkIsFavorited(listingId) {
    try {
      const response = await httpClient.get(`/end-user/favorites/check/${listingId}`);
      return response;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      throw error;
    }
  }

  /**
   * Get user's favorite statistics
   * @returns {Promise} API response with favorite stats and category breakdown
   */
  async getFavoriteStats() {
    try {
      const response = await httpClient.get('/end-user/favorites/stats');
      return response;
    } catch (error) {
      console.error('Error fetching favorite stats:', error);
      throw error;
    }
  }

  /**
   * Get most favorited listings (Admin/Staff only)
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of results (default: 10, max: 50)
   * @param {number} params.categoryId - Filter by category
   * @param {string} params.startDate - Start date (ISO format)
   * @param {string} params.endDate - End date (ISO format)
   * @returns {Promise} API response with most favorited listings
   */
  async getMostFavorited(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      const {
        limit = 10,
        categoryId,
        startDate,
        endDate
      } = params;

      queryParams.append('limit', Math.min(limit, 50).toString());
      if (categoryId) queryParams.append('categoryId', categoryId.toString());
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await httpClient.get(`/panel/favorites/analytics/most-favorited?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching most favorited listings:', error);
      throw error;
    }
  }

  /**
   * Get favorite analytics for admin dashboard
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date (ISO format)
   * @param {string} params.endDate - End date (ISO format)
   * @returns {Promise} API response with favorite analytics
   */
  async getFavoriteAnalytics(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      const { startDate, endDate } = params;
      
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await httpClient.get(`/panel/favorites/analytics/stats?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching favorite analytics:', error);
      throw error;
    }
  }

  /**
   * Get favorite count for a specific listing (for listing owners and admins)
   * This would typically be included in listing details API, but can be called separately
   * @param {number} listingId - ID of the listing
   * @returns {Promise} API response with favorite count
   */
  async getListingFavoriteCount(listingId) {
    try {
      // This endpoint might be part of listing details API
      // For now, we'll use the most favorited endpoint with specific listing filter
      const response = await httpClient.get(`/panel/favorites/analytics/most-favorited?limit=1&listingId=${listingId}`);
      return response;
    } catch (error) {
      console.error('Error fetching listing favorite count:', error);
      throw error;
    }
  }
}

const favoritesService = new FavoritesService();
export default favoritesService;