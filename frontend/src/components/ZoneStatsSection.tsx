import ZoneStatCard from './ZoneStatCard'

export default function ZoneStatsSection({
  zones,
}: {
  zones: Array<{
    zoneName: string
    crowdCount: number
    density: 'Low' | 'Medium' | 'High' | string
    riskScore: number
  }>
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-800 font-semibold">Zone Statistics</div>
        <div className="text-xs text-gray-500">Live density & risk</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {zones.map((z) => (
          <ZoneStatCard key={z.zoneName} zone={z} />
        ))}
      </div>
    </div>
  )
}

