'use client';

/**
 * Listings by Status Component
 * Displays listing counts grouped by status
 */
export default function ListingsByStatus({ data }) {
  if (!data || !Array.isArray(data)) return null;

  const statusColors = {
    draft: 'bg-gray-500',
    pending: 'bg-yellow-500',
    active: 'bg-green-500',
    expired: 'bg-orange-500',
    sold: 'bg-blue-500',
    rejected: 'bg-red-500'
  };

  const statusLabels = {
    draft: 'Draft',
    pending: 'Pending',
    active: 'Active',
    expired: 'Expired',
    sold: 'Sold',
    rejected: 'Rejected'
  };

  const total = data.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Listings by Status
      </h3>
      <div className="space-y-3">
        {data.map((item) => {
          const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
          return (
            <div key={item.status}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {statusLabels[item.status] || item.status}
                </span>
                <span className="text-sm text-gray-600">
                  {item.count} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${statusColors[item.status] || 'bg-gray-500'} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
