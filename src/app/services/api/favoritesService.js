import httpClient from '../httpClient';

class FavoritesService {
  async addToFavorites(listingId) {
    try {
      const response = await httpClient.post('/end-user/create/favorites', {
        listingId: parseInt(listingId)
      });
      return response;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  async removeFromFavorites(listingId) {
    try {
      const response = await httpClient.delete(`/end-user/delete/favorites/${listingId}`);
      return response;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  async getUserFavorites(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      const {
        page = 1,
        limit = 20,
        categoryId,
        priceMin,
        priceMax,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = params;

      queryParams.append('page', page.toString());
      queryParams.append('limit', Math.min(limit, 50).toString());
      queryParams.append('sortBy', sortBy);
      queryParams.append('sortOrder', sortOrder);

      if (categoryId) queryParams.append('categoryId', categoryId.toString());
      if (priceMin) queryParams.append('priceMin', priceMin.toString());
      if (priceMax) queryParams.append('priceMax', priceMax.toString());

      const response = await httpClient.get(`/end-user/get/favorites?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      throw error;
    }
  }

  async checkIsFavorited(listingId) {
    try {
      const response = await httpClient.get(`/end-user/check/${listingId}`);
      return response;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      throw error;
    }
  }

  async getFavoriteStats() {
    try {
      const response = await httpClient.get('/end-user/stats');
      return response;
    } catch (error) {
      console.error('Error fetching favorite stats:', error);
      throw error;
    }
  }

  async getMostFavorited(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      const {
        limit = 10,
        categoryId,
        startDate,
        endDate
      } = params;

      queryParams.append('limit', Math.min(limit, 50).toString());
      if (categoryId) queryParams.append('categoryId', categoryId.toString());
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await httpClient.get(`/panel/analytics/most-favorited?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching most favorited listings:', error);
      throw error;
    }
  }

  async getFavoriteAnalytics(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      const { startDate, endDate } = params;
      
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await httpClient.get(`/panel/analytics/stats?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching favorite analytics:', error);
      throw error;
    }
  }

  async getListingFavoriteCount(listingId) {
    try {
      const response = await httpClient.get(`/public/listings/${listingId}/favorite-count`);
      return response;
    } catch (error) {
      console.error('Error fetching listing favorite count:', error);
      throw error;
    }
  }

  async getFavoritesByCategory(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      const { userId, startDate, endDate } = params;
      
      if (userId) queryParams.append('userId', userId.toString());
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await httpClient.get(`/panel/analytics/by-category?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching favorites by category:', error);
      throw error;
    }
  }

  async getUserFavoritesAdmin(userId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      const {
        page = 1,
        limit = 20,
        categoryId,
        priceMin,
        priceMax,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = params;

      queryParams.append('page', page.toString());
      queryParams.append('limit', Math.min(limit, 50).toString());
      queryParams.append('sortBy', sortBy);
      queryParams.append('sortOrder', sortOrder);

      if (categoryId) queryParams.append('categoryId', categoryId.toString());
      if (priceMin) queryParams.append('priceMin', priceMin.toString());
      if (priceMax) queryParams.append('priceMax', priceMax.toString());

      const response = await httpClient.get(`/panel/user/${userId}?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching user favorites (admin):', error);
      throw error;
    }
  }
}

const favoritesService = new FavoritesService();
export default favoritesService;
