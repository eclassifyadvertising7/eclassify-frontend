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
      console.error('Logout error:', error);
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
      console.error('Error parsing user data:', error);
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
    
    console.log('🔵 [sendOTP] Request payload:', payload);
    const response = await httpClient.post('/auth/otp/send', payload);
    console.log('🔵 [sendOTP] Backend response:', response);
    console.log('🔵 [sendOTP] Response success:', response.success);
    console.log('🔵 [sendOTP] Response data:', response.data);
    console.log('🔵 [sendOTP] Response message:', response.message);
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
    
    console.log('🟢 [verifyOTPSignup] Request payload:', payload);
    const response = await httpClient.post('/auth/otp/verify', payload);
    console.log('🟢 [verifyOTPSignup] Backend response:', response);
    console.log('🟢 [verifyOTPSignup] Response success:', response.success);
    console.log('🟢 [verifyOTPSignup] Response data:', response.data);
    console.log('🟢 [verifyOTPSignup] Response tokens:', response.data?.tokens);
    console.log('🟢 [verifyOTPSignup] Response user:', response.data?.user);
    
    if (response.success && response.data?.tokens) {
      const { access_token, refresh_token } = response.data.tokens;
      console.log('🟢 [verifyOTPSignup] Token validation - access_token valid:', isValidToken(access_token));
      console.log('🟢 [verifyOTPSignup] Token validation - refresh_token valid:', isValidToken(refresh_token));
      
      if (isValidToken(access_token) && isValidToken(refresh_token)) {
        secureStorage.setItem('access_token', access_token);
        secureStorage.setItem('refresh_token', refresh_token);
        secureStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('🟢 [verifyOTPSignup] Tokens stored successfully');
      } else {
        console.error('🔴 [verifyOTPSignup] Invalid tokens received');
      }
    } else {
      console.error('🔴 [verifyOTPSignup] No tokens in response or request failed');
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
    
    console.log('🟡 [verifyOTPLogin] Request payload:', payload);
    const response = await httpClient.post('/auth/otp/verify', payload);
    console.log('🟡 [verifyOTPLogin] Backend response:', response);
    console.log('🟡 [verifyOTPLogin] Response success:', response.success);
    console.log('🟡 [verifyOTPLogin] Response data:', response.data);
    console.log('🟡 [verifyOTPLogin] Response tokens:', response.data?.tokens);
    console.log('🟡 [verifyOTPLogin] Response user:', response.data?.user);
    
    if (response.success && response.data?.tokens) {
      const { access_token, refresh_token } = response.data.tokens;
      console.log('🟡 [verifyOTPLogin] Token validation - access_token valid:', isValidToken(access_token));
      console.log('🟡 [verifyOTPLogin] Token validation - refresh_token valid:', isValidToken(refresh_token));
      
      if (isValidToken(access_token) && isValidToken(refresh_token)) {
        secureStorage.setItem('access_token', access_token);
        secureStorage.setItem('refresh_token', refresh_token);
        secureStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('🟡 [verifyOTPLogin] Tokens stored successfully');
      } else {
        console.error('🔴 [verifyOTPLogin] Invalid tokens received');
      }
    } else {
      console.error('🔴 [verifyOTPLogin] No tokens in response or request failed');
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
    
    console.log('🟣 [verifyOTP] Request payload:', payload);
    const response = await httpClient.post('/auth/otp/verify', payload);
    console.log('🟣 [verifyOTP] Backend response:', response);
    console.log('🟣 [verifyOTP] Response success:', response.success);
    console.log('🟣 [verifyOTP] Response data:', response.data);
    console.log('🟣 [verifyOTP] Response message:', response.message);
    return response;
  },

  otpSignup: async (mobile, email, fullName, countryCode = '+91', device_name = null) => {
    const payload = {
      mobile,
      email,
      fullName,
      countryCode,
      device_name: device_name || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown Device')
    };
    
    console.log('🟠 [otpSignup] Request payload:', payload);
    const response = await httpClient.post('/auth/otp/signup', payload);
    console.log('🟠 [otpSignup] Backend response:', response);
    console.log('🟠 [otpSignup] Response success:', response.success);
    console.log('🟠 [otpSignup] Response data:', response.data);
    console.log('🟠 [otpSignup] Response tokens:', response.data?.tokens);
    console.log('🟠 [otpSignup] Response user:', response.data?.user);
    
    if (response.success && response.data?.tokens) {
      // Handle both old and new token field names
      const { access_token, refresh_token, accessToken, refreshToken } = response.data.tokens;
      const finalAccessToken = accessToken || access_token;
      const finalRefreshToken = refreshToken || refresh_token;
      
      console.log('🟠 [otpSignup] Token validation - access_token valid:', isValidToken(finalAccessToken));
      console.log('🟠 [otpSignup] Token validation - refresh_token valid:', isValidToken(finalRefreshToken));
      
      if (isValidToken(finalAccessToken) && isValidToken(finalRefreshToken)) {
        secureStorage.setItem('access_token', finalAccessToken);
        secureStorage.setItem('refresh_token', finalRefreshToken);
        secureStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('🟠 [otpSignup] Tokens stored successfully');
      } else {
        console.error('🔴 [otpSignup] Invalid tokens received');
      }
    } else {
      console.error('🔴 [otpSignup] No tokens in response or request failed');
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
    
    console.log('🟡 [otpLogin] Request payload:', payload);
    const response = await httpClient.post('/auth/otp/login', payload);
    console.log('🟡 [otpLogin] Backend response:', response);
    console.log('🟡 [otpLogin] Response success:', response.success);
    console.log('🟡 [otpLogin] Response data:', response.data);
    console.log('🟡 [otpLogin] Response tokens:', response.data?.tokens);
    console.log('🟡 [otpLogin] Response user:', response.data?.user);
    
    if (response.success && response.data?.tokens) {
      // Handle both old and new token field names
      const { access_token, refresh_token, accessToken, refreshToken } = response.data.tokens;
      const finalAccessToken = accessToken || access_token;
      const finalRefreshToken = refreshToken || refresh_token;
      
      console.log('🟡 [otpLogin] Token validation - access_token valid:', isValidToken(finalAccessToken));
      console.log('🟡 [otpLogin] Token validation - refresh_token valid:', isValidToken(finalRefreshToken));
      
      if (isValidToken(finalAccessToken) && isValidToken(finalRefreshToken)) {
        secureStorage.setItem('access_token', finalAccessToken);
        secureStorage.setItem('refresh_token', finalRefreshToken);
        secureStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('🟡 [otpLogin] Tokens stored successfully');
      } else {
        console.error('🔴 [otpLogin] Invalid tokens received');
      }
    } else {
      console.error('🔴 [otpLogin] No tokens in response or request failed');
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
      console.error('Error parsing Google callback data:', error);
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
