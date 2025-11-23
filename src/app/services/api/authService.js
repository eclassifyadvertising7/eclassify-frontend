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

  // OTP-based authentication (to be implemented later)
  sendOTP: async (mobile, countryCode = '+91') => {
    // Placeholder for OTP implementation
    return httpClient.post('/auth/send-otp', { mobile, countryCode });
  },

  verifyOTP: async (mobile, otp, countryCode = '+91') => {
    // Placeholder for OTP implementation
    const response = await httpClient.post('/auth/verify-otp', { mobile, otp, countryCode });
    
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
};

export default authService;
