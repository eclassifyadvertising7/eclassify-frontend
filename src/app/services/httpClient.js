/**
 * HTTP Client Base
 * Centralized configuration for all API calls
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

class HttpClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}, retryCount = 0) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error accessing token:', error);
      }
    }

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(url, { ...config, signal: controller.signal });
      clearTimeout(timeoutId);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');
      
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        // Handle 401 Unauthorized - try to refresh token
        if (response.status === 401 && retryCount === 0 && endpoint !== '/auth/refresh-token' && endpoint !== '/auth/login') {
          try {
            // Attempt to refresh the token
            const refreshed = await this.refreshAccessToken();
            if (refreshed) {
              // Retry the original request with new token
              return this.request(endpoint, options, retryCount + 1);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            this.handleAuthFailure();
          }
        }

        throw {
          status: response.status,
          message: data.message || data.error || 'Request failed',
          data,
        };
      }

      return data;
    } catch (error) {
      // Network or parsing errors
      if (!error.status) {
        throw {
          status: 0,
          message: 'Network error or server unavailable',
          data: null,
        };
      }
      throw error;
    }
  }

  async refreshAccessToken() {
    if (typeof window === 'undefined') return false;

    try {
      const refresh_token = localStorage.getItem('refresh_token');
      if (!refresh_token) {
        return false;
      }

      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      if (data.success && data.data?.tokens) {
        localStorage.setItem('access_token', data.data.tokens.access_token);
        localStorage.setItem('refresh_token', data.data.tokens.refresh_token);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  handleAuthFailure() {
    if (typeof window === 'undefined') return;

    // Clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    // Redirect to login
    window.location.href = '/sign-in';
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // For file uploads
  upload(endpoint, formData, options = {}) {
    const uploadOptions = { ...options };
    // Remove Content-Type to let browser set it with boundary
    delete uploadOptions.headers?.['Content-Type'];
    
    return this.request(endpoint, {
      ...uploadOptions,
      method: 'POST',
      body: formData,
      headers: {
        ...uploadOptions.headers,
      },
    });
  }
}

export const httpClient = new HttpClient();
export default httpClient;
