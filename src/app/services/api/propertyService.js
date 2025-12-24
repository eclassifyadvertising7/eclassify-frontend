import httpClient from '../httpClient';

export const propertyService = {
  getProperties: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return httpClient.get(`/properties?${queryString}`);
  },

  getPropertyById: async (propertyId) => {
    return httpClient.get(`/properties/${propertyId}`);
  },

  createProperty: async (propertyData) => {
    return httpClient.post('/properties', propertyData);
  },

  updateProperty: async (propertyId, propertyData) => {
    return httpClient.put(`/properties/${propertyId}`, propertyData);
  },

  deleteProperty: async (propertyId) => {
    return httpClient.delete(`/properties/${propertyId}`);
  },

  uploadPropertyImages: async (propertyId, formData) => {
    return httpClient.upload(`/properties/${propertyId}/images`, formData);
  },

  searchProperties: async (searchQuery) => {
    return httpClient.get(`/properties/search?q=${encodeURIComponent(searchQuery)}`);
  },

  getFeaturedProperties: async () => {
    return httpClient.get('/properties/featured');
  },
};

export default propertyService;
