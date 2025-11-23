/**
 * User Service
 * Handles user profile and account management
 */

import httpClient from '../httpClient';

export const userService = {
  // Get current user's profile
  getProfile: async () => {
    return httpClient.get('/profile/me');
  },

  // Update current user's profile (with optional photo upload)
  updateProfile: async (formData) => {
    return httpClient.upload('/profile/me', formData);
  },

  // Delete current user's profile photo
  deleteProfilePhoto: async () => {
    return httpClient.delete('/profile/me/photo');
  },

  // Get current user's business/KYC info
  getBusinessInfo: async () => {
    return httpClient.get('/profile/me/business');
  },

  // Update current user's business/KYC info
  updateBusinessInfo: async (businessData) => {
    return httpClient.put('/profile/me/business', businessData);
  },

  // Change password
  changePassword: async (passwordData) => {
    return httpClient.post('/profile/me/change-password', passwordData);
  },

  // Get user listings
  getUserListings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return httpClient.get(`/listings?${queryString}`);
  },

  // Delete account
  deleteAccount: async () => {
    return httpClient.delete('/profile/me');
  },
};

export default userService;
