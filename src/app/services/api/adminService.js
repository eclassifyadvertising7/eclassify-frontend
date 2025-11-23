/**
 * Admin Service
 * Handles admin dashboard and management operations
 */

import httpClient from '../httpClient';

export const adminService = {
  // Dashboard stats
  getDashboardStats: async () => {
    return httpClient.get('/admin/dashboard/stats');
  },

  // User management
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return httpClient.get(`/admin/users?${queryString}`);
  },

  updateUserStatus: async (userId, status) => {
    return httpClient.patch(`/admin/users/${userId}/status`, { status });
  },

  deleteUser: async (userId) => {
    return httpClient.delete(`/admin/users/${userId}`);
  },

  // Listing management
  getAllListings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return httpClient.get(`/admin/listings?${queryString}`);
  },

  approveAd: async (adId) => {
    return httpClient.patch(`/admin/listings/${adId}/approve`);
  },

  rejectAd: async (adId, reason) => {
    return httpClient.patch(`/admin/listings/${adId}/reject`, { reason });
  },

  deleteAd: async (adId) => {
    return httpClient.delete(`/admin/listings/${adId}`);
  },

  // Package management
  getPackages: async () => {
    return httpClient.get('/admin/packages');
  },

  createPackage: async (packageData) => {
    return httpClient.post('/admin/packages', packageData);
  },

  updatePackage: async (packageId, packageData) => {
    return httpClient.put(`/admin/packages/${packageId}`, packageData);
  },

  deletePackage: async (packageId) => {
    return httpClient.delete(`/admin/packages/${packageId}`);
  },

  // Reports and analytics
  getReports: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return httpClient.get(`/admin/reports?${queryString}`);
  },
};

export default adminService;
