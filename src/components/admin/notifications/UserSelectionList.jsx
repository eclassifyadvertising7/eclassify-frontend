'use client';

import { useState, useEffect } from 'react';
import { Search, Send, Users as UsersIcon, CheckSquare, Square } from 'lucide-react';
import { toast } from 'sonner';
import BroadcastNotificationModal from './BroadcastNotificationModal';
import { getAllRoles, getUsersByRole } from '@/app/services/api/rolesService';

export default function UserSelectionList() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [targetType, setTargetType] = useState('specific'); // 'specific' or 'all'

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    if (selectedRoleId) {
      loadUsers(1);
    }
  }, [selectedRoleId]);

  const loadRoles = async () => {
    try {
      const response = await getAllRoles();
      // Filter out super_admin role
      const filteredRoles = response.data.roles.filter(
        role => role.slug !== 'super_admin'
      );
      setRoles(filteredRoles);
      
      // Set default to 'user' role
      const userRole = filteredRoles.find(role => role.slug === 'user');
      if (userRole) {
        setSelectedRoleId(userRole.id);
      } else if (filteredRoles.length > 0) {
        setSelectedRoleId(filteredRoles[0].id);
      }
    } catch (error) {
      toast.error('Failed to load roles');
      console.error('Error loading roles:', error);
    }
  };

  const loadUsers = async (page = 1, search = searchQuery) => {
    if (!selectedRoleId) return;

    try {
      setLoading(true);
      const response = await getUsersByRole(selectedRoleId, {
        page,
        limit: 50,
        search,
        status: 'active'
      });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers(1, searchQuery);
  };

  const handleRoleChange = (roleId) => {
    setSelectedRoleId(parseInt(roleId));
    setSearchQuery('');
    setSelectedUsers(new Set());
  };

  const toggleUserSelection = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)));
    }
  };

  const handleSendToSelected = () => {
    if (selectedUsers.size === 0) {
      toast.error('Please select at least one user');
      return;
    }
    setTargetType('specific');
    setShowModal(true);
  };

  const handleSendToAll = () => {
    setTargetType('all');
    setShowModal(true);
  };

  const handleNotificationSent = () => {
    setSelectedUsers(new Set());
    setShowModal(false);
  };

  const getRoleBadgeColor = (roleSlug) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      user: 'bg-blue-100 text-blue-800'
    };
    return colors[roleSlug] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Select Users</h2>
          <p className="text-sm text-gray-600 mt-1">
            {selectedUsers.size > 0 
              ? `${selectedUsers.size} user${selectedUsers.size > 1 ? 's' : ''} selected`
              : 'Select users to send notification'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSendToAll}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <UsersIcon className="w-5 h-5" />
            Send to All Users
          </button>
          <button
            onClick={handleSendToSelected}
            disabled={selectedUsers.size === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            Send to Selected ({selectedUsers.size})
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <select
          value={selectedRoleId || ''}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>

        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No users found
        </div>
      )}

      {!loading && users.length > 0 && (
        <>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={toggleSelectAll}
                      className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                    >
                      {selectedUsers.size === users.length ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                      <span className="text-sm font-medium">Select All</span>
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedUsers.has(user.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => toggleUserSelection(user.id)}
                  >
                    <td className="px-4 py-3">
                      {selectedUsers.has(user.id) ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {user.fullName?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.fullName || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{user.email || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{user.mobile || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role?.slug)}`}>
                        {user.role?.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? 'Active' : user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} users
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadUsers(pagination.page - 1, searchQuery)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => loadUsers(pagination.page + 1, searchQuery)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Broadcast Modal */}
      {showModal && (
        <BroadcastNotificationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          selectedUserIds={Array.from(selectedUsers)}
          targetType={targetType}
          onSuccess={handleNotificationSent}
        />
      )}
    </div>
  );
}
