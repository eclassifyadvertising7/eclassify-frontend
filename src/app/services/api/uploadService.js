import httpClient from '../httpClient';

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return httpClient.upload('/uploadImg', formData);
  },

  uploadMultipleImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return httpClient.upload('/uploadImg', formData);
  },

  deleteImage: async (imageUrl) => {
    return httpClient.post('/images/delete', { imageUrl });
  },
};

export default uploadService;
