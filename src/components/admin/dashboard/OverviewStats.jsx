'use client';

import { Users, FileText, DollarSign, Package, UserCheck } from 'lucide-react';

/**
 * Overview Statistics Cards Component
 * Displays high-level platform statistics
 */
export default function OverviewStats({ data }) {
  console.log('OverviewStats received data:', data);
  
  if (!data) {
    console.log('OverviewStats: No data, returning null');
    return null;
  }

  const stats = [
    {
      title: 'Total Users',
      value: data.users?.total || 0,
      subtitle: `${data.users?.active || 0} active, ${data.users?.inactive || 0} inactive`,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Ads',
      value: data.listings?.active || 0,
      subtitle: `${data.listings?.total || 0} total, ${data.listings?.sold || 0} sold`,
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'Active Subscriptions',
      value: data.subscriptions?.active || 0,
      subtitle: `${data.subscriptionPlans?.active || 0} active plans`,
      icon: UserCheck,
      color: 'bg-purple-500'
    },
    {
      title: 'Revenue',
      value: `₹${((data.revenue?.total || 0) / 100).toLocaleString('en-IN')}`,
      subtitle: data.revenue?.currency || 'INR',
      icon: DollarSign,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-2">{stat.subtitle}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
