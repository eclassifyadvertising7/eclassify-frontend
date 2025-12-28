import httpClient from '../httpClient';

/**
 * Roles Service
 * Handles role management operations
 */

/**
 * Get all roles in the system
 * @returns {Promise<Object>} Roles list
 */
export const getAllRoles = async () => {
  const response = await httpClient.get('/panel/roles');
  return response;
};

/**
 * Get users by role
 * @param {number} roleId - Role ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Users list
 */
export const getUsersByRole = async (roleId, params = {}) => {
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 50,
    ...(params.search && { search: params.search }),
    ...(params.status && { status: params.status })
  });

  const response = await httpClient.get(`/panel/roles/users/${roleId}?${queryParams}`);
  return response;
};
