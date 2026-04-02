function formatNumber(n: any) {
  const v = Number(n)
  if (Number.isFinite(v)) return v.toLocaleString()
  return String(n ?? '')
}

function formatUptime(seconds: any) {
  const s = Number(seconds)
  if (!Number.isFinite(s) || s < 0) return '0s'
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const rem = s % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${rem}s`
  return `${rem}s`
}

export default function RightPanel({
  sensorStatus,
  activity,
}: {
  sensorStatus: {
    status: string
    activeSensors: number
    uptimeSeconds: number
    entryRate: number
    exitRate: number
  }
  activity: Array<{ text: string; at: number }>
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="text-gray-800 font-semibold mb-3">
          System Summary
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Status</span>
            <span className="font-medium text-slate-900">
              {sensorStatus.status}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Active Sensors</span>
            <span className="font-medium text-slate-900">
              {formatNumber(sensorStatus.activeSensors)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Uptime</span>
            <span className="font-medium text-slate-900">
              {formatUptime(sensorStatus.uptimeSeconds)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Entry Rate</span>
            <span className="font-medium text-slate-900">
              {formatNumber(sensorStatus.entryRate)}/min
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Exit Rate</span>
            <span className="font-medium text-slate-900">
              {formatNumber(sensorStatus.exitRate)}/min
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-800 font-semibold">Activity Feed</div>
          <div className="text-xs text-gray-500">Latest alerts</div>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {activity.length === 0 ? (
            <div className="text-sm text-gray-500">No activity yet.</div>
          ) : (
            activity.map((a, i) => (
              <div
                key={`${a.at}-${i}`}
                className="text-sm text-gray-700 border border-gray-200 rounded-2xl px-4 py-3 bg-white"
              >
                <div className="font-medium text-gray-800">{a.text}</div>
                <div className="text-xs text-gray-500">
                  {new Date(a.at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

