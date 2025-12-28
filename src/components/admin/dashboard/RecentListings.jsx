'use client';

import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

/**
 * Recent Listings Component
 * Displays the latest created listings
 */
export default function RecentListings({ data }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Listings
        </h3>
        <p className="text-sm text-gray-500">No recent listings</p>
      </div>
    );
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    expired: 'bg-orange-100 text-orange-800',
    sold: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Listings
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((listing) => (
              <tr key={listing.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/ads/${listing.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {listing.title}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {listing.user?.fullName || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {listing.user?.mobile || ''}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    ₹{(listing.price || 0).toLocaleString('en-IN')}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[listing.status] || 'bg-gray-100 text-gray-800'}`}>
                    {listing.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {listing.createdAt
                    ? formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
