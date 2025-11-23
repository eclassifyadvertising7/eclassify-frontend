/**
 * Category Service
 * Handles category management operations
 */

import httpClient from '../httpClient';

export const categoryService = {
  // Public endpoints
  getActiveCategories: async (featured = null) => {
    const params = featured !== null ? `?featured=${featured}` : '';
    return httpClient.get(`/public/categories${params}`);
  },

  getCategoryBySlug: async (slug) => {
    return httpClient.get(`/public/categories/${slug}`);
  },

  // Admin panel endpoints
  getAllCategories: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return httpClient.get(`/panel/categories${queryString ? `?${queryString}` : ''}`);
  },

  getCategoryById: async (id) => {
    return httpClient.get(`/panel/categories/${id}`);
  },

  createCategory: async (formData) => {
    return httpClient.upload('/panel/categories', formData);
  },

  updateCategory: async (id, formData) => {
    return httpClient.request(`/panel/categories/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {},
    });
  },

  updateCategoryStatus: async (id, isActive) => {
    return httpClient.patch(`/panel/categories/status/${id}`, { isActive });
  },

  updateCategoryFeatured: async (id, isFeatured) => {
    return httpClient.patch(`/panel/categories/featured/${id}`, { isFeatured });
  },

  deleteCategory: async (id) => {
    return httpClient.delete(`/panel/categories/${id}`);
  },
};

export default categoryService;
