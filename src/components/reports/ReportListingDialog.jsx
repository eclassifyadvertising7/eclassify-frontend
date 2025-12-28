'use client';

import { useState } from 'react';
import { Flag, X } from 'lucide-react';
import { toast } from 'sonner';
import { reportListing, LISTING_REPORT_TYPES } from '@/app/services/api/reportsService';

const REPORT_OPTIONS = [
  { value: LISTING_REPORT_TYPES.SPAM, label: 'Spam', description: 'Repetitive or irrelevant content' },
  { value: LISTING_REPORT_TYPES.FRAUD, label: 'Fraud/Scam', description: 'Fraudulent or deceptive listing' },
  { value: LISTING_REPORT_TYPES.OFFENSIVE, label: 'Offensive Content', description: 'Inappropriate or offensive material' },
  { value: LISTING_REPORT_TYPES.DUPLICATE, label: 'Duplicate', description: 'This listing is posted multiple times' },
  { value: LISTING_REPORT_TYPES.WRONG_CATEGORY, label: 'Wrong Category', description: 'Listed in incorrect category' },
  { value: LISTING_REPORT_TYPES.MISLEADING, label: 'Misleading', description: 'False or misleading information' },
  { value: LISTING_REPORT_TYPES.SOLD, label: 'Already Sold', description: 'Item is no longer available' },
  { value: LISTING_REPORT_TYPES.OTHER, label: 'Other', description: 'Other reason not listed above' }
];

export default function ReportListingDialog({ listingId, listingTitle, isOpen, onClose }) {
  const [selectedType, setSelectedType] = useState('');
  const [reason, setReason] = useState('');
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
      const response = await reportListing(listingId, {
        reportType: selectedType,
        reason: reason.trim()
      });

      toast.success(response.message || 'Listing reported successfully');
      
      // Reset form and close
      setSelectedType('');
      setReason('');
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
            <Flag className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold">Report Listing</h2>
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
          {listingTitle && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Reporting:</p>
              <p className="font-medium text-gray-900">{listingTitle}</p>
            </div>
          )}

          {/* Report Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              What's wrong with this listing? *
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
              Additional Details *
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide more details about why you're reporting this listing..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              required
            />
            <p className="text-xs text-gray-500">
              Minimum 10 characters. Be specific to help our team review this report.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Our team will review your report within 24-48 hours. False reports may result in account restrictions.
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
