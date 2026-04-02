type Metrics = {
  totalCrowd: number
  activeAlerts: number
  networkScore: number
  peakCrowd: number
}

function MetricCard({
  label,
  value,
}: {
  label: string
  value: number | string
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-gray-800">{value}</div>
    </div>
  )
}

export default function MetricCards({ metrics }: { metrics: Metrics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <MetricCard label="Total Crowd" value={metrics.totalCrowd} />
      <MetricCard label="Active Alerts" value={metrics.activeAlerts} />
      <MetricCard label="Network Score" value={metrics.networkScore} />
      <MetricCard label="Peak Crowd" value={metrics.peakCrowd} />
    </div>
  )
}

