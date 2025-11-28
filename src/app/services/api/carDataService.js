/**
 * Car Data Service
 * Handles car brands, models, and variants data
 */

import httpClient from '../httpClient';

export const carDataService = {
  // Get all car brands
  getBrands: async () => {
    return httpClient.get('/public/car-brands');
  },

  // Get models by brand ID
  getModelsByBrand: async (brandId) => {
    return httpClient.get(`/public/car-models?brandId=${brandId}`);
  },

  // Get variants by model ID
  getVariantsByModel: async (modelId) => {
    return httpClient.get(`/public/car-variants?modelId=${modelId}`);
  },
};

// Named exports for convenience
export const getCarBrands = carDataService.getBrands;
export const getCarModels = carDataService.getModelsByBrand;
export const getCarVariants = carDataService.getVariantsByModel;

export default carDataService;
