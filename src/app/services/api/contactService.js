/**
 * Contact Service
 * Handles contact form and messaging
 */

import httpClient from '../httpClient';

export const contactService = {
  // Send contact form
  sendContactForm: async (contactData) => {
    return httpClient.post('/contact', contactData);
  },

  // Contact seller about listing
  contactSeller: async (listingId, messageData) => {
    return httpClient.post(`/listings/${listingId}/contact`, messageData);
  },

  // Get user messages
  getMessages: async (userId) => {
    return httpClient.get(`/users/${userId}/messages`);
  },

  // Mark message as read
  markAsRead: async (messageId) => {
    return httpClient.patch(`/messages/${messageId}/read`);
  },
};

export default contactService;
