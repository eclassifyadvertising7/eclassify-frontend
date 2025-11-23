/**
 * Upload Service
 * Handles file and image uploads
 */

import httpClient from '../httpClient';

export const uploadService = {
  // Upload single image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return httpClient.upload('/uploadImg', formData);
  },

  // Upload multiple images
  uploadMultipleImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return httpClient.upload('/uploadImg', formData);
  },

  // Delete image
  deleteImage: async (imageUrl) => {
    return httpClient.post('/images/delete', { imageUrl });
  },
};

export default uploadService;
