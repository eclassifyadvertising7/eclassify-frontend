import httpClient from '../httpClient';

// States Management
export const getStates = async (page = 1, limit = 50, search = '') => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);

    const result = await httpClient.get(`/panel/locations/states/view?${params.toString()}`);
    return result;
  } catch (error) {
    console.error('Get states error:', error);
    throw error;
  }
};

export const createState = async (stateData) => {
  try {
    const result = await httpClient.post('/panel/locations/states/create', stateData);
    return result;
  } catch (error) {
    console.error('Create state error:', error);
    throw error;
  }
};

export const updateState = async (stateId, stateData) => {
  try {
    const result = await httpClient.put(`/panel/locations/states/edit/${stateId}`, stateData);
    return result;
  } catch (error) {
    console.error('Update state error:', error);
    throw error;
  }
};

export const deleteState = async (stateId) => {
  try {
    const result = await httpClient.delete(`/panel/locations/states/delete/${stateId}`);
    return result;
  } catch (error) {
    console.error('Delete state error:', error);
    throw error;
  }
};

// Cities Management
export const getCitiesByState = async (stateId, page = 1, limit = 50, search = '') => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);

    const result = await httpClient.get(`/panel/locations/cities/view-by-state/${stateId}?${params.toString()}`);
    return result;
  } catch (error) {
    console.error('Get cities by state error:', error);
    throw error;
  }
};

export const createCity = async (cityData) => {
  try {
    const result = await httpClient.post('/panel/locations/cities/create', cityData);
    return result;
  } catch (error) {
    console.error('Create city error:', error);
    throw error;
  }
};

export const updateCity = async (cityId, cityData) => {
  try {
    const result = await httpClient.put(`/panel/locations/cities/edit/${cityId}`, cityData);
    return result;
  } catch (error) {
    console.error('Update city error:', error);
    throw error;
  }
};

export const deleteCity = async (cityId) => {
  try {
    const result = await httpClient.delete(`/panel/locations/cities/delete/${cityId}`);
    return result;
  } catch (error) {
    console.error('Delete city error:', error);
    throw error;
  }
};

export const toggleCityPopularity = async (cityId, isPopular) => {
  try {
    const result = await httpClient.patch(`/panel/locations/cities/popularity/${cityId}`, { isPopular });
    return result;
  } catch (error) {
    console.error('Toggle city popularity error:', error);
    throw error;
  }
};
