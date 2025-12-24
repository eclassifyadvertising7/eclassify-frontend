const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const searchListings = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== false && value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    const response = await fetch(`${API_BASE_URL}/api/public/listings/search?${queryParams.toString()}`, {
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
    console.error('Search listings error:', error)
    return {
      success: false,
      message: error.message || 'Failed to search listings',
      data: [],
      pagination: null
    }
  }
}

export const logSearchActivity = async (searchData) => {
  try {
    const token = localStorage.getItem('authToken')
    
    const response = await fetch(`${API_BASE_URL}/api/end-user/searches/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(searchData)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Log search activity error:', error)
    return {
      success: false,
      message: error.message || 'Failed to log search activity'
    }
  }
}

export const getSearchHistory = async (page = 1, limit = 20) => {
  try {
    const token = localStorage.getItem('authToken')
    
    if (!token) {
      return {
        success: false,
        message: 'Authentication required',
        data: { searches: [], pagination: null }
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/end-user/searches/history?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Get search history error:', error)
    return {
      success: false,
      message: error.message || 'Failed to get search history',
      data: { searches: [], pagination: null }
    }
  }
}

export const getSearchRecommendations = async (limit = 5) => {
  try {
    const token = localStorage.getItem('authToken')
    
    const response = await fetch(`${API_BASE_URL}/api/end-user/searches/recommendations?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Get search recommendations error:', error)
    return {
      success: false,
      message: error.message || 'Failed to get search recommendations',
      data: { topCategories: [], recentQueries: [] }
    }
  }
}

export const getPopularSearches = async (limit = 10, categoryId = null) => {
  try {
    const queryParams = new URLSearchParams({ limit: limit.toString() })
    if (categoryId) {
      queryParams.append('categoryId', categoryId.toString())
    }

    const response = await fetch(`${API_BASE_URL}/api/public/searches/popular?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Get popular searches error:', error)
    return {
      success: false,
      message: error.message || 'Failed to get popular searches',
      data: { popularSearches: [] }
    }
  }
}
