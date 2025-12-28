'use client';

import { useState, useEffect } from 'react';
import { Bell, Send, BarChart3, Users, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import UserSelectionList from '@/components/admin/notifications/UserSelectionList';
import NotificationStats from '@/components/admin/notifications/NotificationStats';
import UserNotificationsView from '@/components/admin/notifications/UserNotificationsView';
import { 
  getNotificationStats, 
  processScheduledNotifications, 
  cleanupExpiredNotifications 
} from '@/app/services/api/adminNotificationsService';

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState('broadcast');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'stats') {
      loadStats();
    }
  }, [activeTab]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await getNotificationStats(30);
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load notification statistics');
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessScheduled = async () => {
    try {
      setLoading(true);
      const response = await processScheduledNotifications();
      toast.success(`Processed ${response.data.processed} scheduled notifications`);
      if (activeTab === 'stats') {
        loadStats();
      }
    } catch (error) {
      toast.error('Failed to process scheduled notifications');
      console.error('Error processing scheduled:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    if (!confirm('Are you sure you want to delete expired notifications older than 180 days?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await cleanupExpiredNotifications(180);
      toast.success(`Deleted ${response.data.deleted} expired notifications`);
      if (activeTab === 'stats') {
        loadStats();
      }
    } catch (error) {
      toast.error('Failed to cleanup expired notifications');
      console.error('Error cleaning up:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'broadcast', label: 'Send Broadcast', icon: Send },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'user-view', label: 'User Notifications', icon: Users }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notification Management</h1>
              <p className="text-gray-600">Send and manage user notifications</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleProcessScheduled}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Clock className="w-4 h-4" />
              Process Scheduled
            </button>
            <button
              onClick={handleCleanup}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Cleanup Expired
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {activeTab === 'broadcast' && <UserSelectionList />}
        {activeTab === 'stats' && <NotificationStats stats={stats} loading={loading} onRefresh={loadStats} />}
        {activeTab === 'user-view' && <UserNotificationsView />}
      </div>
    </div>
  );
}
