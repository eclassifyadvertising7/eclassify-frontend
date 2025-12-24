import httpClient from '../httpClient';

export const contactService = {
  sendContactForm: async (contactData) => {
    return httpClient.post('/contact', contactData);
  },

  contactSeller: async (listingId, messageData) => {
    return httpClient.post(`/listings/${listingId}/contact`, messageData);
  },

  getMessages: async (userId) => {
    return httpClient.get(`/users/${userId}/messages`);
  },

  markAsRead: async (messageId) => {
    return httpClient.patch(`/messages/${messageId}/read`);
  },
};

export default contactService;
