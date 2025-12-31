import httpClient from '../httpClient'

/**
 * Get user's preferred location
 * @returns {Promise} API response with preferred location data
 */
export const getPreferredLocation = async () => {
  try {
    const result = await httpClient.get('/profile/me/preferred-location')
    return result
  } catch (error) {
    console.error('Get preferred location error:', error)
    return {
      success: false,
      message: error.message || 'Failed to get preferred location',
      data: null
    }
  }
}

/**
 * Update user's preferred location
 * @param {Object} locationData - Location data to update
 * @param {number} locationData.preferredCityId - City ID
 * @param {string} locationData.preferredCityName - City name
 * @param {number} locationData.preferredLatitude - Latitude
 * @param {number} locationData.preferredLongitude - Longitude
 * @returns {Promise} API response
 */
export const updatePreferredLocation = async (locationData) => {
  try {
    const result = await httpClient.put('/profile/me/preferred-location', locationData)
    return result
  } catch (error) {
    console.error('Update preferred location error:', error)
    return {
      success: false,
      message: error.message || 'Failed to update preferred location'
    }
  }
}

export default {
  getPreferredLocation,
  updatePreferredLocation
}
