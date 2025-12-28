'use client';

import { useState } from 'react';
import { X, Save, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import {
  updateListingReportStatus,
  updateUserReportStatus,
  REPORT_STATUS,
  LISTING_REPORT_ACTIONS,
  USER_REPORT_ACTIONS
} from '@/app/services/api/reportsService';

export default function ReportDetailsModal({ report, type = 'listing', isOpen, onClose, onUpdate }) {
  const [status, setStatus] = useState(report?.status || '');
  const [adminNotes, setAdminNotes] = useState(report?.adminNotes || '');
  const [actionTaken, setActionTaken] = useState(report?.actionTaken || 'none');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isListingReport = type === 'listing';
  const availableActions = isListingReport ? LISTING_REPORT_ACTIONS : USER_REPORT_ACTIONS;

  if (!isOpen || !report) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        status,
        adminNotes: adminNotes.trim(),
        actionTaken
      };

      const updateFunction = isListingReport ? updateListingReportStatus : updateUserReportStatus;
      const response = await updateFunction(report.id, updateData);

      toast.success(response.message || 'Report updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update report';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">
            Report Details #{report.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Report Type</h3>
              <p className="text-gray-900 capitalize">{report.reportType.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Submitted</h3>
              <p className="text-gray-900">{formatDate(report.createdAt)}</p>
            </div>
          </div>

          {/* Reported Item/User */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {isListingReport ? 'Reported Listing' : 'Reported User'}
            </h3>
            {isListingReport ? (
              <div>
                <p className="font-medium text-gray-900">{report.listing?.title || `Listing #${report.listingId}`}</p>
                {report.listing?.slug && (
                  <a
                    href={`/product-details/${report.listing.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-1"
                  >
                    View Listing
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ) : (
              <div>
                <p className="font-medium text-gray-900">{report.reportedUser?.fullName || `User #${report.reportedUserId}`}</p>
                <p className="text-sm text-gray-600">{report.reportedUser?.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Status: <span className="capitalize">{report.reportedUser?.status}</span>
                </p>
              </div>
            )}
          </div>

          {/* Reporter Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Reported By</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">{report.reporter?.fullName}</p>
              <p className="text-sm text-gray-600">{report.reporter?.email}</p>
            </div>
          </div>

          {/* Reason */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Reason</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{report.reason}</p>
            </div>
          </div>

          {/* Context (for user reports) */}
          {!isListingReport && report.context && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Context</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{report.context}</p>
              </div>
            </div>
          )}

          {/* Related Information (for user reports) */}
          {!isListingReport && (report.relatedListingId || report.relatedChatRoomId) && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Related Information</h3>
              {report.relatedListingId && (
                <p className="text-sm text-blue-800">Related Listing ID: {report.relatedListingId}</p>
              )}
              {report.relatedChatRoomId && (
                <p className="text-sm text-blue-800">Related Chat Room ID: {report.relatedChatRoomId}</p>
              )}
            </div>
          )}

          {/* Review Information */}
          {report.reviewedBy && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Review Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-900">
                  Reviewed by: <span className="font-medium">{report.reviewer?.fullName || `Admin #${report.reviewedBy}`}</span>
                </p>
                <p className="text-sm text-gray-900">
                  Reviewed at: {formatDate(report.reviewedAt)}
                </p>
              </div>
            </div>
          )}

          {/* Update Form */}
          <form onSubmit={handleSubmit} className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Update Report Status</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={REPORT_STATUS.PENDING}>Pending</option>
                  <option value={REPORT_STATUS.UNDER_REVIEW}>Under Review</option>
                  <option value={REPORT_STATUS.RESOLVED}>Resolved</option>
                  <option value={REPORT_STATUS.DISMISSED}>Dismissed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action Taken *
                </label>
                <select
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {Object.entries(availableActions).map(([key, value]) => (
                    <option key={value} value={value}>
                      {key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about your review and actions taken..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

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
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
