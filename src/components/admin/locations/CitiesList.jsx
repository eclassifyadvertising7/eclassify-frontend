'use client';

import { useState, useEffect } from 'react';
import { Edit2, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ui/confirm-modal';
import { getCitiesByState, deleteCity, toggleCityPopularity } from '@/app/services/api/adminLocationService';

export default function CitiesList({ stateId, searchTerm = '', onEdit, onUpdate }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, city: null });
  const [togglingPopularity, setTogglingPopularity] = useState(null);

  useEffect(() => {
    if (stateId) {
      loadCities();
    }
  }, [stateId, currentPage, searchTerm]);

  const loadCities = async () => {
    setIsLoading(true);
    try {
      const response = await getCitiesByState(stateId, currentPage, 50, searchTerm);
      if (response.success && response.data) {
        setCities(response.data.cities || []);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to load cities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (city) => {
    try {
      const response = await deleteCity(city.id);
      toast.success(response.message || 'City deleted successfully');
      onUpdate();
      loadCities();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete city';
      toast.error(errorMessage);
    }
  };

  const handleTogglePopularity = async (city) => {
    setTogglingPopularity(city.id);
    try {
      const response = await toggleCityPopularity(city.id, !city.isPopular);
      toast.success(response.message || 'City popularity updated');
      loadCities();
      onUpdate();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update city popularity';
      toast.error(errorMessage);
    } finally {
      setTogglingPopularity(null);
    }
  };

  const handleSearchChange = (e) => {
    setCurrentPage(1);
  };

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="bg-white rounded-lg border">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                District
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pincode
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Popular
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Loading cities...
                </td>
              </tr>
            ) : cities.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No cities found for this state
                </td>
              </tr>
            ) : (
              cities.map((city) => (
                <tr key={city.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{city.name}</div>
                    <div className="text-xs text-gray-500">{city.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{city.district || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{city.pincode || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleTogglePopularity(city)}
                      disabled={togglingPopularity === city.id}
                      className={`p-2 rounded-lg transition-colors ${
                        city.isPopular
                          ? 'text-yellow-500 hover:bg-yellow-50'
                          : 'text-gray-300 hover:bg-gray-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={city.isPopular ? 'Remove from popular' : 'Mark as popular'}
                    >
                      <Star className={`w-5 h-5 ${city.isPopular ? 'fill-current' : ''}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      city.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {city.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(city)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ isOpen: true, city })}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} total)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, city: null })}
        onConfirm={() => handleDelete(deleteConfirm.city)}
        title="Delete City"
        message={`Are you sure you want to delete "${deleteConfirm.city?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
