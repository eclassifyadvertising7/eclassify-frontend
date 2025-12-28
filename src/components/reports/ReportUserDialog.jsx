'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';
import { reportUser, USER_REPORT_TYPES } from '@/app/services/api/reportsService';

const REPORT_OPTIONS = [
  { value: USER_REPORT_TYPES.SCAMMER, label: 'Scammer', description: 'User is attempting to scam or defraud' },
  { value: USER_REPORT_TYPES.FAKE_PROFILE, label: 'Fake Profile', description: 'Profile appears to be fake or impersonating' },
  { value: USER_REPORT_TYPES.HARASSMENT, label: 'Harassment', description: 'User is harassing or threatening' },
  { value: USER_REPORT_TYPES.SPAM, label: 'Spam', description: 'User is sending spam messages' },
  { value: USER_REPORT_TYPES.INAPPROPRIATE_BEHAVIOR, label: 'Inappropriate Behavior', description: 'Unprofessional or inappropriate conduct' },
  { value: USER_REPORT_TYPES.FAKE_LISTINGS, label: 'Fake Listings', description: 'User posts fake or misleading listings' },
  { value: USER_REPORT_TYPES.NON_RESPONSIVE, label: 'Non-Responsive', description: 'User doesn\'t respond after commitment' },
  { value: USER_REPORT_TYPES.OTHER, label: 'Other', description: 'Other reason not listed above' }
];

export default function ReportUserDialog({ 
  userId, 
  userName, 
  relatedListingId = null,
  relatedChatRoomId = null,
  isOpen, 
  onClose 
}) {
  const [selectedType, setSelectedType] = useState('');
  const [reason, setReason] = useState('');
  const [context, setContext] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedType) {
      toast.error('Please select a report type');
      return;
    }

    if (!reason.trim()) {
      toast.error('Please provide a reason for reporting');
      return;
    }

    setIsSubmitting(true);

    try {
      const reportData = {
        reportType: selectedType,
        reason: reason.trim()
      };

      // Add optional fields if provided
      if (context.trim()) {
        reportData.context = context.trim();
      }
      if (relatedListingId) {
        reportData.relatedListingId = relatedListingId;
      }
      if (relatedChatRoomId) {
        reportData.relatedChatRoomId = relatedChatRoomId;
      }

      const response = await reportUser(userId, reportData);

      toast.success(response.message || 'User reported successfully');
      
      // Reset form and close
      setSelectedType('');
      setReason('');
      setContext('');
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit report';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold">Report User</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {userName && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Reporting:</p>
              <p className="font-medium text-gray-900">{userName}</p>
            </div>
          )}

          {/* Report Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Why are you reporting this user? *
            </label>
            <div className="space-y-2">
              {REPORT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedType === option.value
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={option.value}
                    checked={selectedType === option.value}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Reason Text Area */}
          <div className="space-y-2">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Detailed Reason *
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide specific details about why you're reporting this user..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Context Text Area (Optional) */}
          <div className="space-y-2">
            <label htmlFor="context" className="block text-sm font-medium text-gray-700">
              Additional Context (Optional)
            </label>
            <textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Any additional information that might help us investigate..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Warning Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800 font-medium mb-1">
              Important Notice
            </p>
            <p className="text-sm text-amber-700">
              False or malicious reports are taken seriously and may result in action against your account. 
              Please only report genuine violations.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedType || !reason.trim()}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
