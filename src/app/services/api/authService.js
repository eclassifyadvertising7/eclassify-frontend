import httpClient, { API_BASE_URL } from '../httpClient';

const isValidToken = (token) => {
  return token && typeof token === 'string' && token.split('.').length === 3;
};

const secureStorage = {
  setItem: (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Silent error handling
    }
  },
  getItem: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  removeItem: (key) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // Silent error handling
    }
  },
};

export const authService = {
  signup: async (userData) => {
    const response = await httpClient.post('/auth/signup', userData);
    
    if (response.success && response.data?.tokens) {
      const { access_token, refresh_token } = response.data.tokens;
      
      if (isValidToken(access_token) && isValidToken(refresh_token)) {
        secureStorage.setItem('access_token', access_token);
        secureStorage.setItem('refresh_token', refresh_token);
        secureStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response;
  },

  login: async (credentials) => {
    const response = await httpClient.post('/auth/login', credentials);
    
    if (response.success && response.data?.tokens) {
      const { access_token, refresh_token } = response.data.tokens;
      
      if (isValidToken(access_token) && isValidToken(refresh_token)) {
        secureStorage.setItem('access_token', access_token);
        secureStorage.setItem('refresh_token', refresh_token);
        secureStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response;
  },

  getProfile: async () => {
    return httpClient.get('/profile/me');
  },

  refreshToken: async () => {
    const refresh_token = secureStorage.getItem('refresh_token');
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }

    const response = await httpClient.post('/auth/refresh-token', { refresh_token });
    
    if (response.success && response.data?.tokens) {
      const { access_token, refresh_token: new_refresh_token } = response.data.tokens;
      
      if (isValidToken(access_token) && isValidToken(new_refresh_token)) {
        secureStorage.setItem('access_token', access_token);
        secureStorage.setItem('refresh_token', new_refresh_token);
      }
    }
    
    return response;
  },

  logout: async () => {
    const refresh_token = secureStorage.getItem('refresh_token');
    
    try {
      if (refresh_token) {
        await httpClient.post('/auth/logout', { refresh_token });
      }
    } catch (error) {
      // Silent error handling
    } finally {
      secureStorage.removeItem('access_token');
      secureStorage.removeItem('refresh_token');
      secureStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const userStr = secureStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  isAuthenticated: () => {
    const token = secureStorage.getItem('access_token');
    return !!token && isValidToken(token);
  },

  sendOTP: async (mobile, type = 'login', countryCode = '+91', fullName = null, email = null) => {
    const payload = { 
      mobile, 
      countryCode,
      type
    };
    
    if (email) {
      payload.email = email;
    }
    if (type === 'signup' && fullName) {
      payload.fullName = fullName;
    }
    
    const response = await httpClient.post('/auth/otp/send', payload);
    return response;
  },

  verifyOTPSignup: async (mobile, otp, fullName, countryCode = '+91', device_name = null, email = null) => {
    const payload = { 
      mobile, 
      otp, 
      type: 'signup',
      fullName,
      countryCode,
      device_name: device_name || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device')
    };
    
    if (email) {
      payload.email = email;
    }
    
    const response = await httpClient.post('/auth/otp/verify', payload);
    
    if (response.success && response.data?.tokens) {
      const { access_token, refresh_token } = response.data.tokens;
      
      if (isValidToken(access_token) && isValidToken(refresh_token)) {
        secureStorage.setItem('access_token', access_token);
        secureStorage.setItem('refresh_token', refresh_token);
        secureStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response;
  },

  verifyOTPLogin: async (mobile, otp, countryCode = '+91', device_name = null) => {
    const payload = { 
      mobile, 
      otp, 
      type: 'login',
      countryCode,
      device_name: device_name || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device')
    };
    
    const response = await httpClient.post('/auth/otp/verify', payload);
    
    if (response.success && response.data?.tokens) {
      const { access_token, refresh_token } = response.data.tokens;
      
      if (isValidToken(access_token) && isValidToken(refresh_token)) {
        secureStorage.setItem('access_token', access_token);
        secureStorage.setItem('refresh_token', refresh_token);
        secureStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response;
  },

  verifyOTP: async (mobile, otp, type, countryCode = '+91', email = null) => {
    const payload = { 
      mobile, 
      otp,
      type,
      countryCode
    };
    
    if (email) {
      payload.email = email;
    }
    
    const response = await httpClient.post('/auth/otp/verify', payload);
    return response;
  },

  otpSignup: async (mobile, email, fullName, countryCode = '+91', device_name = null, password = null) => {
    const payload = {
      mobile,
      email,
      fullName,
      countryCode,
      device_name: device_name || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device')
    };
    
    if (password) {
      payload.password = password;
    }
    
    const response = await httpClient.post('/auth/otp/signup', payload);
    
    if (response.success && response.data?.tokens) {
      // Handle both old and new token field names
      const { access_token, refresh_token, accessToken, refreshToken } = response.data.tokens;
      const finalAccessToken = accessToken || access_token;
      const finalRefreshToken = refreshToken || refresh_token;
      
      if (isValidToken(finalAccessToken) && isValidToken(finalRefreshToken)) {
        secureStorage.setItem('access_token', finalAccessToken);
        secureStorage.setItem('refresh_token', finalRefreshToken);
        secureStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response;
  },

  otpLogin: async (mobile, email, countryCode = '+91', device_name = null) => {
    const payload = {
      mobile,
      email,
      countryCode,
      device_name: device_name || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device')
    };
    
    const response = await httpClient.post('/auth/otp/login', payload);
    
    if (response.success && response.data?.tokens) {
      // Handle both old and new token field names
      const { access_token, refresh_token, accessToken, refreshToken } = response.data.tokens;
      const finalAccessToken = accessToken || access_token;
      const finalRefreshToken = refreshToken || refresh_token;
      
      if (isValidToken(finalAccessToken) && isValidToken(finalRefreshToken)) {
        secureStorage.setItem('access_token', finalAccessToken);
        secureStorage.setItem('refresh_token', finalRefreshToken);
        secureStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response;
  },

  initiateGoogleAuth: (device_name = null) => {
    const deviceName = device_name || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device');
    const authUrl = `${API_BASE_URL}/auth/google?device_name=${encodeURIComponent(deviceName)}`;
    
    if (typeof window !== 'undefined') {
      window.location.href = authUrl;
    }
    
    return authUrl;
  },

  handleGoogleCallback: (encodedData) => {
    try {
      const response = JSON.parse(decodeURIComponent(encodedData));
      
      if (response.success && response.data?.tokens) {
        const { access_token, refresh_token } = response.data.tokens;
        
        if (isValidToken(access_token) && isValidToken(refresh_token)) {
          secureStorage.setItem('access_token', access_token);
          secureStorage.setItem('refresh_token', refresh_token);
          secureStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      
      return response;
    } catch (error) {
      throw new Error('Invalid callback data');
    }
  },

  completeGoogleProfile: async (mobile, countryCode = '+91') => {
    const response = await httpClient.post('/auth/google/complete-profile', {
      mobile,
      countryCode
    });
    
    if (response.success && response.data) {
      secureStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  },
};

export default authService;
