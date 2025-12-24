import httpClient from '../httpClient';

export const commonService = {
  getStates: async () => {
    return httpClient.get('/common/states');
  },

  getCitiesByState: async (stateId) => {
    return httpClient.get(`/common/cities/${stateId}`);
  },
};

export default commonService;
