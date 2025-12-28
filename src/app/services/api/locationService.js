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

export const getPopularCities = async () => {
  try {
    const result = await httpClient.get('/common/popular-cities')
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

export const searchCities = async (query, stateId = null, limit = 10) => {
  try {
    if (!query || query.length < 2) {
      return {
        success: false,
        message: 'Search query must be at least 2 characters',
        data: []
      }
    }

    const queryParams = new URLSearchParams()
    queryParams.append('query', query)
    
    if (stateId) {
      queryParams.append('stateId', stateId.toString())
    }
    if (limit) {
      queryParams.append('limit', limit.toString())
    }

    const result = await httpClient.get(`/common/search-cities?${queryParams.toString()}`)
    return result
  } catch (error) {
    console.error('Search cities error:', error)
    return {
      success: false,
      message: error.message || 'Failed to search cities',
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

export const getStates = async () => {
  try {
    const result = await httpClient.get('/common/all-states')
    return result
  } catch (error) {
    console.error('Get states error:', error)
    return {
      success: false,
      message: error.message || 'Failed to fetch states',
      data: []
    }
  }
}

export const findStateByName = async (stateName) => {
  try {
    const result = await getStates()
    if (result.success && result.data) {
      // Try exact match first
      let state = result.data.find(s => 
        s.name.toLowerCase() === stateName.toLowerCase()
      )
      
      // Try partial match if exact match fails
      if (!state) {
        state = result.data.find(s => 
          s.name.toLowerCase().includes(stateName.toLowerCase()) ||
          stateName.toLowerCase().includes(s.name.toLowerCase())
        )
      }
      
      return {
        success: !!state,
        data: state || null
      }
    }
    return {
      success: false,
      data: null
    }
  } catch (error) {
    console.error('Find state by name error:', error)
    return {
      success: false,
      data: null
    }
  }
}
