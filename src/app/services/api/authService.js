/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */

import httpClient from '../httpClient';

// Token validation helper
const isValidToken = (token) => {
  return token && typeof token === 'string' && token.split('.').length === 3;
};

// Secure storage helper
const secureStorage = {
  setItem: (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  getItem: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },
  removeItem: (key) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
};

export const authService = {
  // User registration with mobile and password
  signup: async (userData) => {
    const response = await httpClient.post('/auth/signup', userData);
    
    // Store tokens if provided and valid
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

  // User login with mobile and password
  login: async (credentials) => {
    const response = await httpClient.post('/auth/login', credentials);
    
    // Store tokens if provided and valid
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

  // Get user profile
  getProfile: async () => {
    return httpClient.get('/profile/me');
  },

  // Refresh access token
  refreshToken: async () => {
    const refresh_token = secureStorage.getItem('refresh_token');
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }

    const response = await httpClient.post('/auth/refresh-token', { refresh_token });
    
    // Update tokens if valid
    if (response.success && response.data?.tokens) {
      const { access_token, refresh_token: new_refresh_token } = response.data.tokens;
      
      if (isValidToken(access_token) && isValidToken(new_refresh_token)) {
        secureStorage.setItem('access_token', access_token);
        secureStorage.setItem('refresh_token', new_refresh_token);
      }
    }
    
    return response;
  },

  // User logout
  logout: async () => {
    const refresh_token = secureStorage.getItem('refresh_token');
    
    try {
      if (refresh_token) {
        await httpClient.post('/auth/logout', { refresh_token });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call result
      secureStorage.removeItem('access_token');
      secureStorage.removeItem('refresh_token');
      secureStorage.removeItem('user');
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = secureStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = secureStorage.getItem('access_token');
    return !!token && isValidToken(token);
  },

  // Send OTP for signup or login
  sendOTP: async (mobile, type = 'login', countryCode = '+91', fullName = null, email = null) => {
    const payload = { 
      mobile, 
      countryCode,
      type // 'signup', 'login', or 'verification'
    };
    
    // Include fullName and email for signup
    if (type === 'signup' && fullName) {
      payload.fullName = fullName;
    }
    if (type === 'signup' && email) {
      payload.email = email;
    }
    
    return httpClient.post('/auth/otp/send', payload);
  },

  // Verify OTP for signup (requires fullName)
  verifyOTPSignup: async (mobile, otp, fullName, countryCode = '+91', device_name = null, email = null) => {
    const payload = { 
      mobile, 
      otp, 
      type: 'signup',
      fullName,
      countryCode,
      device_name: device_name || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device')
    };
    
    // Include email if provided
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

  // Verify OTP for login (no fullName required)
  verifyOTPLogin: async (mobile, otp, countryCode = '+91', device_name = null) => {
    const response = await httpClient.post('/auth/otp/verify', { 
      mobile, 
      otp, 
      type: 'login',
      countryCode,
      device_name: device_name || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device')
    });
    
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

  // Verify OTP (separate from signup)
  verifyOTP: async (mobile, otp, countryCode = '+91') => {
    return httpClient.post('/auth/otp/verify', { 
      mobile, 
      otp, 
      countryCode
    });
  },

  // Complete OTP-based signup (after OTP verification)
  otpSignup: async (mobile, email, fullName, countryCode = '+91', device_name = null) => {
    const response = await httpClient.post('/auth/otp/signup', {
      mobile,
      email,
      fullName,
      countryCode,
      device_name: device_name || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device')
    });
    
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

  // Google OAuth Authentication
  initiateGoogleAuth: (device_name = null) => {
    const deviceName = device_name || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device');
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
    const authUrl = `${API_BASE_URL}/auth/google?device_name=${encodeURIComponent(deviceName)}`;
    
    if (typeof window !== 'undefined') {
      window.location.href = authUrl;
    }
    
    return authUrl;
  },

  // Handle Google OAuth callback data
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
      console.error('Error parsing Google callback data:', error);
      throw new Error('Invalid callback data');
    }
  },

  // Complete Google user profile (add mobile number)
  completeGoogleProfile: async (mobile, countryCode = '+91') => {
    const response = await httpClient.post('/auth/google/complete-profile', {
      mobile,
      countryCode
    });
    
    // Update user data in localStorage if successful
    if (response.success && response.data) {
      secureStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  },
};

export default authService;
