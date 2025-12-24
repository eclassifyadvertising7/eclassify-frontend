import httpClient from '../httpClient';

export const listingAdminService = {
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

  getStats: async () => {
    return httpClient.get('/panel/listings/stats');
  },

  getListingById: async (listingId) => {
    return httpClient.get(`/panel/listings/${listingId}`);
  },

  approveListing: async (listingId) => {
    return httpClient.patch(`/panel/listings/approve/${listingId}`);
  },

  rejectListing: async (listingId, reason) => {
    return httpClient.patch(`/panel/listings/reject/${listingId}`, { reason });
  },

  updateFeaturedStatus: async (listingId, isFeatured, days = null) => {
    const data = { isFeatured };
    if (days) data.days = days;
    return httpClient.patch(`/panel/listings/featured/${listingId}`, data);
  },

  deleteListing: async (listingId) => {
    return httpClient.delete(`/panel/listings/${listingId}`);
  },
};

export default listingAdminService;
