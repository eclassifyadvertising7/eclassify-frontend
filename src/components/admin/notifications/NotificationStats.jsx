'use client';

import { RefreshCw, TrendingUp, Mail, Bell, MessageSquare } from 'lucide-react';

export default function NotificationStats({ stats, loading, onRefresh }) {
  if (loading && !stats) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-center text-gray-500">
        No statistics available
      </div>
    );
  }

  const categoryColors = {
    listing: 'bg-blue-100 text-blue-800',
    chat: 'bg-green-100 text-green-800',
    subscription: 'bg-purple-100 text-purple-800',
    system: 'bg-yellow-100 text-yellow-800',
    security: 'bg-red-100 text-red-800',
    marketing: 'bg-pink-100 text-pink-800'
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Notification Statistics</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Bell className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.totalNotifications.toLocaleString()}</div>
          <div className="text-blue-100 text-sm">Total Notifications</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Mail className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {stats.deliveryStats.email?.sent.toLocaleString() || 0}
          </div>
          <div className="text-green-100 text-sm">Emails Sent</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {stats.deliveryStats.push?.sent.toLocaleString() || 0}
          </div>
          <div className="text-purple-100 text-sm">Push Notifications</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Bell className="w-8 h-8 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {((stats.deliveryStats.email?.failed || 0) + 
              (stats.deliveryStats.push?.failed || 0) + 
              (stats.deliveryStats.sms?.failed || 0)).toLocaleString()}
          </div>
          <div className="text-orange-100 text-sm">Failed Deliveries</div>
        </div>
      </div>

      {/* Notifications by Category */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications by Category</h3>
        <div className="space-y-3">
          {Object.entries(stats.notificationsByCategory).map(([category, count]) => {
            const percentage = (count / stats.totalNotifications) * 100;
            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notifications by Type */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Notification Types</h3>
        <div className="space-y-2">
          {Object.entries(stats.notificationsByType)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([type, count]) => (
              <div key={type} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">
                  {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
                <span className="text-sm font-semibold text-gray-900">{count.toLocaleString()}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Delivery Statistics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats.deliveryStats).map(([method, data]) => (
            <div key={method} className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-2 capitalize">{method}</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sent:</span>
                  <span className="text-sm font-semibold text-green-600">{data.sent.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Failed:</span>
                  <span className="text-sm font-semibold text-red-600">{data.failed.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate:</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {((data.sent / (data.sent + data.failed)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500 text-center">
        Statistics for the last {stats.period}
      </div>
    </div>
  );
}
