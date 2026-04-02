function densityStyle(density: string) {
  const d = String(density).toLowerCase()
  if (d === 'low') return 'bg-green-50 text-green-700 border-green-200'
  if (d === 'medium')
    return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-rose-50 text-rose-700 border-rose-200'
}

export default function ZoneStatCard({
  zone,
}: {
  zone: {
    zoneName: string
    crowdCount: number
    density: 'Low' | 'Medium' | 'High' | string
    riskScore: number
  }
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-gray-800 font-semibold">{zone.zoneName}</div>
        <div
          className={[
            'px-2.5 py-1 text-xs font-medium rounded-full border',
            densityStyle(zone.density),
          ].join(' ')}
        >
          {zone.density}
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600">Crowd</div>
      <div className="text-2xl font-semibold text-gray-800">
        {zone.crowdCount}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">Risk Score</div>
        <div className="text-sm font-semibold text-gray-800">
          {Math.round(zone.riskScore)}
        </div>
      </div>
    </div>
  )
}

