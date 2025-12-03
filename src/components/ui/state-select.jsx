"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import commonService from "@/app/services/api/commonService"

/**
 * StateSelect Component
 * Reusable state selector with loading and error handling
 * 
 * @param {string} value - Selected state ID
 * @param {function} onChange - Callback when state changes (stateId, stateName)
 * @param {string} placeholder - Placeholder text
 * @param {boolean} disabled - Disable the select
 * @param {string} error - Error message to display
 * @param {boolean} required - Mark as required field
 * @param {boolean} showLabel - Show label above select
 * @param {string} label - Custom label text
 * @param {string} className - Additional CSS classes
 */
export function StateSelect({
  value,
  onChange,
  placeholder = "Select state",
  disabled = false,
  error = "",
  required = false,
  showLabel = true,
  label = "State",
  className = "",
}) {
  const [states, setStates] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState("")

  useEffect(() => {
    fetchStates()
  }, [])

  const fetchStates = async () => {
    try {
      setLoading(true)
      setFetchError("")
      const response = await commonService.getStates()
      // API returns { success, data } format
      const stateList = response?.data || response || []
      setStates(Array.isArray(stateList) ? stateList : [])
    } catch (err) {
      console.error("Error fetching states:", err)
      setFetchError("Failed to load states")
      setStates([])
    } finally {
      setLoading(false)
    }
  }

  const handleValueChange = (stateId) => {
    const selectedState = states.find(s => s.id.toString() === stateId)
    onChange(stateId, selectedState?.name || "")
  }

  const displayError = error || fetchError

  return (
    <div className={className}>
      {showLabel && (
        <Label className="mb-2">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <Select
        value={value?.toString()}
        onValueChange={handleValueChange}
        disabled={disabled || loading}
      >
        <SelectTrigger className="w-full" aria-invalid={!!displayError}>
          <SelectValue placeholder={loading ? "Loading states..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : states.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No states available
            </div>
          ) : (
            states.map((state) => (
              <SelectItem key={state.id} value={state.id.toString()}>
                {state.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {displayError && (
        <p className="text-destructive text-sm mt-1">{displayError}</p>
      )}
    </div>
  )
}
