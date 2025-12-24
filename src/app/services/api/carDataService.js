import httpClient from '../httpClient';

export const carDataService = {
  getBrands: async () => {
    return httpClient.get('/public/car-brands');
  },

  getModelsByBrand: async (brandId) => {
    return httpClient.get(`/public/car-models?brandId=${brandId}`);
  },

  getVariantsByModel: async (modelId) => {
    return httpClient.get(`/public/car-variants?modelId=${modelId}`);
  },
};

export const getCarBrands = carDataService.getBrands;
export const getCarModels = carDataService.getModelsByBrand;
export const getCarVariants = carDataService.getVariantsByModel;

export default carDataService;
