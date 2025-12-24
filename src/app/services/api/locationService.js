import httpClient from '../httpClient'

export const getCities = async (searchTerm = '', limit = 100) => {
  try {
    const queryParams = new URLSearchParams()
    
    if (searchTerm) {
      queryParams.append('search', searchTerm)
    }
    if (limit) {
      queryParams.append('limit', limit.toString())
    }

    const result = await httpClient.get(`/common/all-cities?${queryParams.toString()}`)
    return result
  } catch (error) {
    console.error('Get cities error:', error)
    return {
      success: false,
      message: error.message || 'Failed to fetch cities',
      data: []
    }
  }
}

export const getPopularCities = async (limit = 10) => {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('popular', 'true')
    queryParams.append('limit', limit.toString())

    const result = await httpClient.get(`/common/all-cities?${queryParams.toString()}`)
    return result
  } catch (error) {
    console.error('Get popular cities error:', error)
    return {
      success: false,
      message: error.message || 'Failed to fetch popular cities',
      data: []
    }
  }
}

export const getCityById = async (cityId) => {
  try {
    const result = await httpClient.get(`/common/all-cities/${cityId}`)
    return result
  } catch (error) {
    console.error('Get city by ID error:', error)
    return {
      success: false,
      message: error.message || 'Failed to fetch city',
      data: null
    }
  }
}

export const searchCitiesByLocation = async (latitude, longitude, radius = 50) => {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('lat', latitude.toString())
    queryParams.append('lng', longitude.toString())
    queryParams.append('radius', radius.toString())

    const result = await httpClient.get(`/common/all-cities/nearby?${queryParams.toString()}`)
    return result
  } catch (error) {
    console.error('Search cities by location error:', error)
    return {
      success: false,
      message: error.message || 'Failed to search nearby cities',
      data: []
    }
  }
}
