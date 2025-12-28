'use client';

/**
 * Period Selector Component
 * Allows filtering dashboard data by time period
 */
export default function PeriodSelector({ value, onChange }) {
  const periods = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="period" className="text-sm font-medium text-gray-700">
        Period:
      </label>
      <select
        id="period"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        {periods.map((period) => (
          <option key={period.value} value={period.value}>
            {period.label}
          </option>
        ))}
      </select>
    </div>
  );
}
