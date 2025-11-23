/**
 * Package Service
 * Handles pricing packages and subscriptions
 */

import httpClient from '../httpClient';

export const packageService = {
  // Get all available packages
  getPackages: async () => {
    return httpClient.get('/packages');
  },

  // Get package by ID
  getPackageById: async (packageId) => {
    return httpClient.get(`/packages/${packageId}`);
  },

  // Purchase package
  purchasePackage: async (packageId, paymentData) => {
    return httpClient.post(`/packages/${packageId}/purchase`, paymentData);
  },

  // Get user's active packages
  getUserPackages: async (userId) => {
    return httpClient.get(`/users/${userId}/packages`);
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    return httpClient.post(`/subscriptions/${subscriptionId}/cancel`);
  },
};

export default packageService;
