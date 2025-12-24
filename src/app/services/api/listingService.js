import httpClient from '../httpClient';

export const listingService = {
  createListing: async (listingData) => {
    return httpClient.post('/end-user/listings', listingData);
  },

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

  getMyListingById: async (listingId) => {
    return httpClient.get(`/end-user/listings/${listingId}`);
  },

  updateListing: async (listingId, listingData) => {
    return httpClient.put(`/end-user/listings/${listingId}`, listingData);
  },

  submitForApproval: async (listingId) => {
    return httpClient.post(`/end-user/listings/submit/${listingId}`, {
      status: 'pending'
    });
  },

  markAsSold: async (listingId) => {
    return httpClient.patch(`/end-user/listings/sold/${listingId}`, {
      status: 'sold'
    });
  },

  uploadMedia: async (listingId, formData) => {
    return httpClient.upload(`/end-user/listings/media/${listingId}`, formData);
  },

  deleteMedia: async (listingId, mediaId) => {
    return httpClient.delete(`/end-user/listings/delete-media/${listingId}/media/${mediaId}`);
  },

  deleteListing: async (listingId) => {
    return httpClient.delete(`/end-user/listings/${listingId}`);
  },

  getMyStats: async () => {
    return httpClient.get('/end-user/listings/stats');
  },
};

export default listingService;
