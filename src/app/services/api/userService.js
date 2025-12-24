import httpClient from '../httpClient';

export const userService = {
  getProfile: async () => {
    return httpClient.get('/profile/me');
  },

  updateProfile: async (formData) => {
    return httpClient.upload('/profile/me', formData);
  },

  deleteProfilePhoto: async () => {
    return httpClient.delete('/profile/me/photo');
  },

  getBusinessInfo: async () => {
    return httpClient.get('/profile/me/business');
  },

  updateBusinessInfo: async (businessData) => {
    return httpClient.put('/profile/me/business', businessData);
  },

  changePassword: async (passwordData) => {
    return httpClient.post('/profile/me/change-password', passwordData);
  },

  getUserListings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return httpClient.get(`/listings?${queryString}`);
  },

  deleteAccount: async () => {
    return httpClient.delete('/profile/me');
  },
};

export default userService;
