/**
 * Car Service
 * Handles car listing operations
 */

import httpClient from '../httpClient';

export const carService = {
  // Get all cars with filters
  getCars: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return httpClient.get(`/cars?${queryString}`);
  },

  // Get single car by ID
  getCarById: async (carId) => {
    return httpClient.get(`/cars/${carId}`);
  },

  // Create new car listing
  createCar: async (carData) => {
    return httpClient.post('/cars', carData);
  },

  // Update car listing
  updateCar: async (carId, carData) => {
    return httpClient.put(`/cars/${carId}`, carData);
  },

  // Delete car listing
  deleteCar: async (carId) => {
    return httpClient.delete(`/cars/${carId}`);
  },

  // Upload car images
  uploadCarImages: async (carId, formData) => {
    return httpClient.upload(`/cars/${carId}/images`, formData);
  },

  // Search cars
  searchCars: async (searchQuery) => {
    return httpClient.get(`/cars/search?q=${encodeURIComponent(searchQuery)}`);
  },

  // Get featured cars
  getFeaturedCars: async () => {
    return httpClient.get('/cars/featured');
  },
};

export default carService;
