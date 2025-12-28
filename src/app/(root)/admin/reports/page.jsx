'use client';

import { useState } from 'react';
import { Flag, AlertTriangle, BarChart3 } from 'lucide-react';
import ReportsStats from '@/components/admin/reports/ReportsStats';
import ReportsList from '@/components/admin/reports/ReportsList';
import ReportDetailsModal from '@/components/admin/reports/ReportDetailsModal';

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState('listing-reports');
  const [reportType, setReportType] = useState('listing');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleReportUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const tabs = [
    { id: 'listing-reports', label: 'Listing Reports', icon: Flag },
    { id: 'user-reports', label: 'User Reports', icon: AlertTriangle },
    { id: 'stats', label: 'Statistics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Moderation</h1>
          <p className="text-gray-600 mt-2">
            Review and manage user reports for listings and users
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border mb-6">
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
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
        <div>
          {activeTab === 'stats' && (
            <ReportsStats key={refreshKey} />
          )}

          {activeTab === 'listing-reports' && (
            <ReportsList
              key={`listing-${refreshKey}`}
              type="listing"
              onViewReport={handleViewReport}
            />
          )}

          {activeTab === 'user-reports' && (
            <ReportsList
              key={`user-${refreshKey}`}
              type="user"
              onViewReport={handleViewReport}
            />
          )}
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          type={activeTab === 'listing-reports' ? 'listing' : 'user'}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={handleReportUpdate}
        />
      )}
    </div>
  );
}
