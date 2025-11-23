/**
 * Property Service
 * Handles property listing operations
 */

import httpClient from '../httpClient';

export const propertyService = {
  // Get all properties with filters
  getProperties: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return httpClient.get(`/properties?${queryString}`);
  },

  // Get single property by ID
  getPropertyById: async (propertyId) => {
    return httpClient.get(`/properties/${propertyId}`);
  },

  // Create new property listing
  createProperty: async (propertyData) => {
    return httpClient.post('/properties', propertyData);
  },

  // Update property listing
  updateProperty: async (propertyId, propertyData) => {
    return httpClient.put(`/properties/${propertyId}`, propertyData);
  },

  // Delete property listing
  deleteProperty: async (propertyId) => {
    return httpClient.delete(`/properties/${propertyId}`);
  },

  // Upload property images
  uploadPropertyImages: async (propertyId, formData) => {
    return httpClient.upload(`/properties/${propertyId}/images`, formData);
  },

  // Search properties
  searchProperties: async (searchQuery) => {
    return httpClient.get(`/properties/search?q=${encodeURIComponent(searchQuery)}`);
  },

  // Get featured properties
  getFeaturedProperties: async () => {
    return httpClient.get('/properties/featured');
  },
};

export default propertyService;
