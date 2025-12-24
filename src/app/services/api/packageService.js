import httpClient from '../httpClient';

export const packageService = {
  getPackages: async () => {
    return httpClient.get('/packages');
  },

  getPackageById: async (packageId) => {
    return httpClient.get(`/packages/${packageId}`);
  },

  purchasePackage: async (packageId, paymentData) => {
    return httpClient.post(`/packages/${packageId}/purchase`, paymentData);
  },

  getUserPackages: async (userId) => {
    return httpClient.get(`/users/${userId}/packages`);
  },

  cancelSubscription: async (subscriptionId) => {
    return httpClient.post(`/subscriptions/${subscriptionId}/cancel`);
  },
};

export default packageService;
