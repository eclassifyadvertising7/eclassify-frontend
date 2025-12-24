import httpClient from '../httpClient';

export const carService = {
  getCars: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return httpClient.get(`/cars?${queryString}`);
  },

  getCarById: async (carId) => {
    return httpClient.get(`/cars/${carId}`);
  },

  createCar: async (carData) => {
    return httpClient.post('/cars', carData);
  },

  updateCar: async (carId, carData) => {
    return httpClient.put(`/cars/${carId}`, carData);
  },

  deleteCar: async (carId) => {
    return httpClient.delete(`/cars/${carId}`);
  },

  uploadCarImages: async (carId, formData) => {
    return httpClient.upload(`/cars/${carId}/images`, formData);
  },

  searchCars: async (searchQuery) => {
    return httpClient.get(`/cars/search?q=${encodeURIComponent(searchQuery)}`);
  },

  getFeaturedCars: async () => {
    return httpClient.get('/cars/featured');
  },
};

export default carService;
