/**
 * Common Service
 * Handles common/public data like states, cities, etc.
 */

import httpClient from '../httpClient';

export const commonService = {
  // Get all states
  getStates: async () => {
    return httpClient.get('/common/states');
  },

  // Get cities by state ID
  getCitiesByState: async (stateId) => {
    return httpClient.get(`/common/cities/${stateId}`);
  },
};

export default commonService;