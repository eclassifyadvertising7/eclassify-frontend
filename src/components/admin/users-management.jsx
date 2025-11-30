"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Shield, Calendar } from "lucide-react"
import { userAdminService } from "@/app/services/api/userAdminService"
import { toast } from "sonner"
import { formatDateTime } from "@/lib/dateTimeUtils"
import Tooltip from "@/components/ui/tooltip"
import ConfirmModal from "@/components/ui/confirm-modal"

export default function UsersManagement() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [userType, setUserType] = useState('external') // 'external' or 'internal'
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 20
  })
  const [tempFilters, setTempFilters] = useState({
    status: '',
    search: '',
    startDate: '',
    endDate: ''
  })
  const [pagination, setPagination] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null, userName: '' })

  useEffect(() => {
    fetchUsers()
  }, [filters.page, filters.limit, userType])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = userType === 'external' 
        ? await userAdminService.getExternalUsers(filters)
        : await userAdminService.getInternalUsers(filters)
      
      setUsers(response.data.users)
      setPagination(response.data.pagination)
    } catch (error) {
      toast.error(error.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await userAdminService.getUserStats()
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleApplyFilters = () => {
    setFilters({
      ...filters,
      ...tempFilters,
      page: 1
    })
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      search: '',
      startDate: '',
      endDate: ''
    }
    setTempFilters(clearedFilters)
    setFilters({
      ...filters,
      ...clearedFilters,
      page: 1
    })
  }

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await userAdminService.toggleUserStatus(userId, !currentStatus)
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
      fetchUsers()
    } catch (error) {
      toast.error(error.message || 'Failed to update user status')
    }
  }

  const handleToggleAutoApprove = async (userId, currentStatus) => {
    try {
      await userAdminService.toggleAutoApprove(userId, !currentStatus)
      toast.success(`Auto-approve ${!currentStatus ? 'enabled' : 'disabled'} successfully`)
      fetchUsers()
    } catch (error) {
      toast.error(error.message || 'Failed to update auto-approve status')
    }
  }

  const handleDelete = async () => {
    try {
      await userAdminService.deleteUser(deleteModal.userId)
      toast.success('User deleted successfully')
      fetchUsers()
      fetchStats()
    } catch (error) {
      toast.error(error.message || 'Failed to delete user')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-800',
      blocked: 'bg-red-100 text-red-800',
      suspended: 'bg-orange-100 text-orange-800',
      deleted: 'bg-gray-100 text-gray-800'
    }
    return statusConfig[status] || 'bg-gray-100 text-gray-800'
  }

  const getKycBadge = (kycStatus) => {
    const kycConfig = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return kycConfig[kycStatus] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
        {stats && (
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <span>Total: {stats.totalUsers}</span>
            <span className="text-green-600">Active: {stats.activeUsers}</span>
            <span className="text-blue-600">Verified: {stats.verifiedUsers}</span>
            <span className="text-yellow-600">KYC Pending: {stats.kycPending}</span>
          </div>
        )}
      </div>

      {/* User Type Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => {
            setUserType('external')
            setFilters({ ...filters, page: 1 })
          }}
          className={`px-4 py-2 font-medium transition-colors ${
            userType === 'external'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          External Users
        </button>
        <button
          onClick={() => {
            setUserType('internal')
            setFilters({ ...filters, page: 1 })
          }}
          className={`px-4 py-2 font-medium transition-colors ${
            userType === 'internal'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Internal Users (Staff)
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={tempFilters.status}
              onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="suspended">Suspended</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={tempFilters.startDate}
              onChange={(e) => setTempFilters({ ...tempFilters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={tempFilters.endDate}
              onChange={(e) => setTempFilters({ ...tempFilters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={tempFilters.search}
                onChange={(e) => setTempFilters({ ...tempFilters, search: e.target.value })}
                placeholder="Name, email, mobile..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No users found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    {userType === 'external' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        KYC Status
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {userType === 'external' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Auto Approve
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateTime(user.createdAt, 'date')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div>
                            <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                              {user.fullName}
                              {user.isVerified && (
                                <Tooltip content="Verified User" position="right">
                                  <Shield className="w-4 h-4 text-blue-500 cursor-pointer" />
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{user.mobile}</div>
                        <div className="text-xs text-gray-500">{user.email || 'N/A'}</div>
                      </td>
                      {userType === 'external' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getKycBadge(user.kycStatus)}`}>
                            {user.kycStatus}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.role?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(user.id, user.isActive)}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          style={{ backgroundColor: user.isActive ? '#10b981' : '#ef4444' }}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              user.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      {userType === 'external' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleAutoApprove(user.id, user.isAutoApproveEnabled)}
                            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            style={{ backgroundColor: user.isAutoApproveEnabled ? '#3b82f6' : '#9ca3af' }}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                user.isAutoApproveEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Tooltip content="View Details" position="top">
                            <button 
                              onClick={() => router.push(`/admin/users/${user.id}`)}
                              className="text-blue-600 hover:text-blue-900 cursor-pointer transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </Tooltip>
                          <Tooltip content="Edit User" position="top">
                            <button 
                              onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                              className="text-green-600 hover:text-green-900 cursor-pointer transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </Tooltip>
                          <Tooltip content="Delete User" position="top">
                            <button 
                              onClick={() => setDeleteModal({ isOpen: true, userId: user.id, userName: user.fullName })}
                              className="text-red-600 hover:text-red-900 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null, userName: '' })}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteModal.userName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}
