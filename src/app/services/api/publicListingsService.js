/**
 * Public Listings Service
 * Handles all public listing endpoints (no authentication required)
 */

import httpClient from "@/app/services/httpClient";

/**
 * Get homepage listings (newest first, no filters)
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 20, max: 100)
 * @returns {Promise<Object>} Listings data with pagination
 */
export const getHomepageListings = async (page = 1, limit = 20) => {
  try {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      limit: limit.toString() 
    });
    return await httpClient.get(`/public/listings/homepage?${params.toString()}`);
  } catch (error) {
    console.error("Error fetching homepage listings:", error);
    throw error;
  }
};

/**
 * Browse category listings with advanced filters
 * @param {string|number} categorySlugOrId - Category slug or ID
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Filtered listings with pagination
 */
export const browseCategoryListings = async (categorySlugOrId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add all non-empty filters to params
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    const endpoint = `/public/listings/category/${categorySlugOrId}${queryString ? `?${queryString}` : ''}`;
    
    return await httpClient.get(endpoint);
  } catch (error) {
    console.error("Error browsing category listings:", error);
    throw error;
  }
};

/**
 * Get featured listings
 * @param {number} limit - Number of items (default: 10)
 * @param {number} categoryId - Optional category filter
 * @returns {Promise<Object>} Featured listings
 */
export const getFeaturedListings = async (limit = 10, categoryId = null) => {
  try {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (categoryId) {
      params.append('categoryId', categoryId.toString());
    }
    
    return await httpClient.get(`/public/listings/featured?${params.toString()}`);
  } catch (error) {
    console.error("Error fetching featured listings:", error);
    throw error;
  }
};

/**
 * Get listing details by slug
 * @param {string} slug - Listing slug
 * @returns {Promise<Object>} Listing details
 */
export const getListingBySlug = async (slug) => {
  try {
    return await httpClient.get(`/public/listings/${slug}`);
  } catch (error) {
    console.error("Error fetching listing by slug:", error);
    throw error;
  }
};

/**
 * Increment view count for a listing
 * @param {number} id - Listing ID
 * @returns {Promise<Object>} Success response
 */
export const incrementListingView = async (id) => {
  try {
    return await httpClient.post(`/public/listings/view/${id}`, {});
  } catch (error) {
    console.error("Error incrementing view count:", error);
    throw error;
  }
};

// Export all functions as default object
export default {
  getHomepageListings,
  browseCategoryListings,
  getFeaturedListings,
  getListingBySlug,
  incrementListingView,
};
