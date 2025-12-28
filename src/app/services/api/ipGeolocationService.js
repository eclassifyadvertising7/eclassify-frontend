/**
 * IP Geolocation Service
 * Detects user's location based on IP address without requiring browser permissions
 */

/**
 * Get user's approximate location from IP address
 * Uses free IP geolocation API
 * @returns {Promise<Object>} Location data including country, state, city
 */
export const getLocationFromIP = async () => {
  try {
    // Using ipapi.co - free tier allows 1000 requests/day
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch IP location');
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data: {
        country: data.country_name,
        countryCode: data.country_code,
        state: data.region,
        stateCode: data.region_code,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        ip: data.ip
      }
    };
  } catch (error) {
    console.error('IP Geolocation error:', error);
    
    // Fallback: Try alternative free service
    try {
      const response = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=free');
      const data = await response.json();
      
      return {
        success: true,
        data: {
          country: data.country_name,
          countryCode: data.country_code2,
          state: data.state_prov,
          city: data.city,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          timezone: data.time_zone?.name,
          ip: data.ip
        }
      };
    } catch (fallbackError) {
      console.error('Fallback IP Geolocation error:', fallbackError);
      
      return {
        success: false,
        message: 'Unable to detect location from IP',
        data: null
      };
    }
  }
};

/**
 * Get user's timezone-based location hint
 * This is a privacy-friendly fallback that doesn't require any API calls
 * @returns {Object} Timezone information
 */
export const getTimezoneLocation = () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Map common Indian timezones to states (example)
    const timezoneToRegion = {
      'Asia/Kolkata': 'India',
      'Asia/Calcutta': 'India',
      'Asia/Mumbai': 'Maharashtra',
      'Asia/Delhi': 'Delhi',
      'Asia/Bangalore': 'Karnataka',
      'Asia/Chennai': 'Tamil Nadu',
      'Asia/Hyderabad': 'Telangana',
      'Asia/Pune': 'Maharashtra'
    };
    
    return {
      success: true,
      data: {
        timezone,
        region: timezoneToRegion[timezone] || 'India'
      }
    };
  } catch (error) {
    console.error('Timezone detection error:', error);
    return {
      success: false,
      data: null
    };
  }
};
