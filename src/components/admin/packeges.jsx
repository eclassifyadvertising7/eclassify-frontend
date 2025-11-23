"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon, Edit2Icon, EyeIcon, Trash2Icon, ToggleLeftIcon, ToggleRightIcon, EyeOffIcon } from "lucide-react"
import subscriptionService from "@/app/services/api/subscriptionService"
import { toast } from "sonner"

export default function SubscriptionPlans() {
  const router = useRouter()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, active, inactive

  useEffect(() => {
    fetchPlans()
  }, [filter])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const filters = {}
      if (filter === 'active') filters.isActive = true
      if (filter === 'inactive') filters.isActive = false
      
      const response = await subscriptionService.getAllPlans(filters)
      if (response.success) {
        setPlans(response.data || [])
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch plans')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (planId, currentStatus) => {
    try {
      const response = await subscriptionService.updatePlanStatus(planId, !currentStatus)
      if (response.success) {
        toast.success(`Plan ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
        fetchPlans()
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update plan status')
    }
  }

  const handleToggleVisibility = async (planId, currentVisibility) => {
    try {
      const response = await subscriptionService.updatePlanVisibility(planId, !currentVisibility)
      if (response.success) {
        toast.success(`Plan visibility ${!currentVisibility ? 'enabled' : 'disabled'} successfully`)
        fetchPlans()
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update plan visibility')
    }
  }

  const handleDelete = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return
    
    try {
      const response = await subscriptionService.deletePlan(planId)
      if (response.success) {
        toast.success('Plan deleted successfully')
        fetchPlans()
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete plan')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
        <button 
          onClick={() => router.push('/admin/subscriptions/create')}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Subscription Plan</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'all' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All Plans
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'active' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('inactive')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'inactive' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Inactive
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Loading plans...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Subscription Plans Yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first subscription plan to start offering premium features to your users.
              </p>
            </div>
            <button 
              onClick={() => router.push('/admin/subscriptions/create')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              Create Subscription Plan
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    {plan.tagline && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {plan.tagline}
                      </span>
                    )}
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      v{plan.version}
                    </span>
                    {plan.isActive ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                        Inactive
                      </span>
                    )}
                    {plan.isPublic ? (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                        Public
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                        Private
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{plan.shortDescription || plan.description}</p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div>
                      <span className="text-gray-500">Price: </span>
                      <span className="font-semibold text-gray-900">
                        {plan.currency} {plan.finalPrice}
                        {plan.showOriginalPrice && plan.basePrice !== plan.finalPrice && (
                          <span className="ml-2 line-through text-gray-400">{plan.basePrice}</span>
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Billing: </span>
                      <span className="font-medium text-gray-900">{plan.billingCycle}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration: </span>
                      <span className="font-medium text-gray-900">{plan.durationDays} days</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Listings: </span>
                      <span className="font-medium text-gray-900">{plan.maxActiveListings}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => router.push(`/admin/subscriptions/${plan.id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => router.push(`/admin/subscriptions/${plan.id}/edit`)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit Plan"
                  >
                    <Edit2Icon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(plan.id, plan.isActive)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title={plan.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {plan.isActive ? <ToggleRightIcon className="w-5 h-5" /> : <ToggleLeftIcon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(plan.id, plan.isPublic)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title={plan.isPublic ? 'Make Private' : 'Make Public'}
                  >
                    {plan.isPublic ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Plan"
                  >
                    <Trash2Icon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
