'use client';

import { useState, useEffect } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { toast } from 'sonner';
import StatesList from '@/components/admin/locations/StatesList';
import CitiesList from '@/components/admin/locations/CitiesList';
import StateFormModal from '@/components/admin/locations/StateFormModal';
import CityFormModal from '@/components/admin/locations/CityFormModal';
import { getStates } from '@/app/services/api/adminLocationService';

export default function AdminLocationsPage() {
  const [activeTab, setActiveTab] = useState('cities');
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [editingState, setEditingState] = useState(null);
  const [editingCity, setEditingCity] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoadingStates, setIsLoadingStates] = useState(true);
  const [citySearchTerm, setCitySearchTerm] = useState('');

  // Load states on mount
  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    setIsLoadingStates(true);
    try {
      const response = await getStates(1, 100);
      if (response.success && response.data?.states) {
        setStates(response.data.states);
        // Select first state by default
        if (response.data.states.length > 0 && !selectedState) {
          setSelectedState(response.data.states[0]);
        }
      }
    } catch (error) {
      toast.error('Failed to load states');
    } finally {
      setIsLoadingStates(false);
    }
  };

  const handleStateUpdate = () => {
    setRefreshKey(prev => prev + 1);
    loadStates();
  };

  const handleCityUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleAddState = () => {
    setEditingState(null);
    setIsStateModalOpen(true);
  };

  const handleEditState = (state) => {
    setEditingState(state);
    setIsStateModalOpen(true);
  };

  const handleAddCity = () => {
    setEditingCity(null);
    setIsCityModalOpen(true);
  };

  const handleEditCity = (city) => {
    setEditingCity(city);
    setIsCityModalOpen(true);
  };

  const tabs = [
    { id: 'cities', label: 'Cities Management' },
    { id: 'states', label: 'States Management' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Location Management</h1>
          </div>
          <p className="text-gray-600">
            Manage states, cities, and popular locations
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border mb-6">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2 font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={activeTab === 'cities' ? handleAddCity : handleAddState}
              disabled={activeTab === 'cities' && !selectedState}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              {activeTab === 'cities' ? 'Add City' : 'Add State'}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'cities' && (
            <div className="space-y-6">
              {/* State Selector and Search */}
              <div className="bg-white rounded-lg border p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select State
                    </label>
                    {isLoadingStates ? (
                      <div className="text-center py-2 text-gray-500">Loading states...</div>
                    ) : states.length === 0 ? (
                      <div className="text-center py-2 text-gray-500">
                        No states available. Please add states first.
                      </div>
                    ) : (
                      <select
                        value={selectedState?.id || ''}
                        onChange={(e) => {
                          const state = states.find(s => s.id === parseInt(e.target.value));
                          setSelectedState(state);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {states.map((state) => (
                          <option key={state.id} value={state.id}>
                            {state.name} ({state.regionName || 'No Region'})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Cities
                    </label>
                    <input
                      type="text"
                      placeholder="Search cities..."
                      value={citySearchTerm}
                      onChange={(e) => setCitySearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Cities List */}
              {selectedState && (
                <CitiesList
                  key={`cities-${selectedState.id}-${refreshKey}`}
                  stateId={selectedState.id}
                  searchTerm={citySearchTerm}
                  onEdit={handleEditCity}
                  onUpdate={handleCityUpdate}
                />
              )}
            </div>
          )}

          {activeTab === 'states' && (
            <StatesList
              key={`states-${refreshKey}`}
              onEdit={handleEditState}
              onUpdate={handleStateUpdate}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <StateFormModal
        isOpen={isStateModalOpen}
        onClose={() => {
          setIsStateModalOpen(false);
          setEditingState(null);
        }}
        onSuccess={handleStateUpdate}
        editingState={editingState}
      />

      <CityFormModal
        isOpen={isCityModalOpen}
        onClose={() => {
          setIsCityModalOpen(false);
          setEditingCity(null);
        }}
        onSuccess={handleCityUpdate}
        editingCity={editingCity}
        states={states}
        defaultStateId={selectedState?.id}
      />
    </div>
  );
}
