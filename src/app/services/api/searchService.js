import httpClient from '../httpClient'

export const searchListings = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== false && value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    const result = await httpClient.get(`/public/listings/search?${queryParams.toString()}`)
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
    const result = await httpClient.post('/end-user/searches/log', searchData)
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
    const result = await httpClient.get(`/end-user/searches/history?page=${page}&limit=${limit}`)
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
    const result = await httpClient.get(`/end-user/searches/recommendations?limit=${limit}`)
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

    const result = await httpClient.get(`/public/searches/popular?${queryParams.toString()}`)
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
