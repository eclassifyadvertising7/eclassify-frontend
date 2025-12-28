'use client';

import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { toast } from 'sonner';
import { sendBroadcastNotification } from '@/app/services/api/adminNotificationsService';

const CATEGORIES = [
  { value: 'system', label: 'System' },
  { value: 'listing', label: 'Listing' },
  { value: 'chat', label: 'Chat' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'security', label: 'Security' },
  { value: 'marketing', label: 'Marketing' }
];

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

const DELIVERY_METHODS = [
  { value: 'in_app', label: 'In-App' },
  { value: 'email', label: 'Email' },
  { value: 'push', label: 'Push Notification' }
];

export default function BroadcastNotificationModal({ 
  isOpen, 
  onClose, 
  selectedUserIds, 
  targetType,
  onSuccess 
}) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    category: 'system',
    priority: 'normal',
    deliveryMethods: ['in_app'],
    actionUrl: '',
    scheduledFor: '',
    expiresAt: ''
  });
  const [loading, setLoading] = useState(false);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.message) {
      toast.error('Title and message are required');
      return;
    }

    if (formData.deliveryMethods.length === 0) {
      toast.error('Please select at least one delivery method');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        message: formData.message,
        category: formData.category,
        priority: formData.priority,
        deliveryMethods: formData.deliveryMethods,
        targetType,
        ...(targetType === 'specific' && { userIds: selectedUserIds }),
        ...(formData.actionUrl && { actionUrl: formData.actionUrl }),
        ...(formData.scheduledFor && { scheduledFor: new Date(formData.scheduledFor).toISOString() }),
        ...(formData.expiresAt && { expiresAt: new Date(formData.expiresAt).toISOString() })
      };

      const response = await sendBroadcastNotification(payload);
      
      toast.success(
        targetType === 'all'
          ? 'Notification sent to all users successfully'
          : `Notification sent to ${response.successful} users successfully`
      );

      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send notification');
      console.error('Error sending notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryMethodToggle = (method) => {
    setFormData(prev => ({
      ...prev,
      deliveryMethods: prev.deliveryMethods.includes(method)
        ? prev.deliveryMethods.filter(m => m !== method)
        : [...prev.deliveryMethods, method]
    }));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ animation: 'zoomIn 0.2s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Send Broadcast Notification</h2>
            <p className="text-sm text-gray-600 mt-1">
              {targetType === 'all' 
                ? 'Sending to all users' 
                : `Sending to ${selectedUserIds.length} selected user${selectedUserIds.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {PRIORITIES.map(pri => (
                  <option key={pri.value} value={pri.value}>{pri.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Notification title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Notification message"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Methods <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {DELIVERY_METHODS.map(method => (
                <label
                  key={method.value}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.deliveryMethods.includes(method.value)}
                    onChange={() => handleDeliveryMethodToggle(method.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action URL (optional)
            </label>
            <input
              type="url"
              value={formData.actionUrl}
              onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
              placeholder="https://example.com/action"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule For (optional)
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expires At (optional)
              </label>
              <input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
        </form>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
