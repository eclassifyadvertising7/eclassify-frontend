'use client';

import { useState, useEffect } from 'react';
import { Flag, AlertTriangle, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import {
  getListingReportStats,
  getUserReportStats
} from '@/app/services/api/reportsService';

export default function ReportsStats() {
  const [listingStats, setListingStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [listingResponse, userResponse] = await Promise.all([
        getListingReportStats(),
        getUserReportStats()
      ]);

      setListingStats(listingResponse.data);
      setUserStats(userResponse.data);
    } catch (error) {
      toast.error('Failed to load statistics');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Listing Reports Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Flag className="w-5 h-5 text-red-600" />
          Listing Reports Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            icon={Flag}
            label="Total Reports"
            value={listingStats?.total || 0}
            color="text-gray-600"
            bgColor="bg-gray-100"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={listingStats?.pending || 0}
            color="text-yellow-600"
            bgColor="bg-yellow-100"
          />
          <StatCard
            icon={TrendingUp}
            label="Under Review"
            value={listingStats?.underReview || 0}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            icon={CheckCircle}
            label="Resolved"
            value={listingStats?.resolved || 0}
            color="text-green-600"
            bgColor="bg-green-100"
          />
          <StatCard
            icon={XCircle}
            label="Dismissed"
            value={listingStats?.dismissed || 0}
            color="text-gray-600"
            bgColor="bg-gray-100"
          />
        </div>

        {/* Most Reported Listings */}
        {listingStats?.mostReportedListings?.length > 0 && (
          <div className="mt-6 bg-white rounded-lg border p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Most Reported Listings</h4>
            <div className="space-y-3">
              {listingStats.mostReportedListings.map((item) => (
                <div key={item.listingId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.listing?.title || `Listing #${item.listingId}`}
                    </p>
                    <p className="text-sm text-gray-600">ID: {item.listingId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">{item.reportCount}</p>
                    <p className="text-xs text-gray-600">reports</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Reports Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          User Reports Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            icon={AlertTriangle}
            label="Total Reports"
            value={userStats?.total || 0}
            color="text-gray-600"
            bgColor="bg-gray-100"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={userStats?.pending || 0}
            color="text-yellow-600"
            bgColor="bg-yellow-100"
          />
          <StatCard
            icon={TrendingUp}
            label="Under Review"
            value={userStats?.underReview || 0}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            icon={CheckCircle}
            label="Resolved"
            value={userStats?.resolved || 0}
            color="text-green-600"
            bgColor="bg-green-100"
          />
          <StatCard
            icon={XCircle}
            label="Dismissed"
            value={userStats?.dismissed || 0}
            color="text-gray-600"
            bgColor="bg-gray-100"
          />
        </div>

        {/* Most Reported Users */}
        {userStats?.mostReportedUsers?.length > 0 && (
          <div className="mt-6 bg-white rounded-lg border p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Most Reported Users</h4>
            <div className="space-y-3">
              {userStats.mostReportedUsers.map((item) => (
                <div key={item.reportedUserId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.reportedUser?.fullName || `User #${item.reportedUserId}`}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-600">ID: {item.reportedUserId}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.reportedUser?.status === 'suspended' 
                          ? 'bg-red-100 text-red-800'
                          : item.reportedUser?.status === 'banned'
                          ? 'bg-black text-white'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.reportedUser?.status || 'unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">{item.reportCount}</p>
                    <p className="text-xs text-gray-600">reports</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
