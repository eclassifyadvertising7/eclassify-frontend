import httpClient from '../httpClient';

/**
 * Dashboard API Service
 * Handles admin dashboard statistics and analytics
 */

const DASHBOARD_BASE_URL = '/panel/dashboard';

/**
 * Get overview statistics
 * @returns {Promise<Object>} Overview statistics including users, listings, revenue
 */
export const getOverviewStats = async () => {
  const response = await httpClient.get(`${DASHBOARD_BASE_URL}/overview`);
  return response.data;
};

/**
 * Get detailed statistics with period filtering
 * @param {string} period - Time period: 'all', 'today', 'week', 'month', 'year'
 * @returns {Promise<Object>} Detailed statistics including listings by status, revenue, recent data
 */
export const getDetailedStats = async (period = 'all') => {
  const response = await httpClient.get(`${DASHBOARD_BASE_URL}/detailed`, {
    params: { period }
  });
  return response.data;
};

export default {
  getOverviewStats,
  getDetailedStats
};
