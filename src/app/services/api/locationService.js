const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const getCities = async (searchTerm = '', limit = 100) => {
  try {
    const queryParams = new URLSearchParams()
    
    if (searchTerm) {
      queryParams.append('search', searchTerm)
    }
    if (limit) {
      queryParams.append('limit', limit.toString())
    }

    const response = await fetch(`${API_BASE_URL}/api/common/all-cities?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
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

    const response = await fetch(`${API_BASE_URL}/api/common/all-cities?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
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
    const response = await fetch(`${API_BASE_URL}/api/common/all-cities/${cityId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
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

    const response = await fetch(`${API_BASE_URL}/api/common/all-cities/nearby?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
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