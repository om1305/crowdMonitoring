function severityStyle(severity: string) {
  const s = String(severity).toLowerCase()
  if (s === 'high') return 'bg-rose-50 text-rose-700 border-rose-200'
  if (s === 'medium') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-green-50 text-green-700 border-green-200'
}

function formatTime(ts: number | string) {
  try {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return String(ts)
  }
}

export default function RecentAlertsTable({
  alerts,
}: {
  alerts: Array<{
    zone: string
    message: string
    severity: 'High' | 'Medium' | 'Low' | string
    timestamp: number | string
  }>
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-800 font-semibold">
          Recent Alerts
        </div>
        <div className="text-xs text-gray-500">Last updates</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="font-medium py-2 pr-3">Zone</th>
              <th className="font-medium py-2 pr-3">Message</th>
              <th className="font-medium py-2 pr-3">Severity</th>
              <th className="font-medium py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  No alerts right now.
                </td>
              </tr>
            ) : (
              alerts.map((a, idx) => (
                <tr
                  key={`${a.zone}-${a.timestamp}-${idx}`}
                  className="border-t border-gray-100"
                >
                  <td className="py-3 pr-3 text-gray-800 font-medium">
                    {a.zone}
                  </td>
                  <td className="py-3 pr-3 text-gray-700">
                    {a.message}
                  </td>
                  <td className="py-3 pr-3">
                    <span
                      className={[
                        'px-2.5 py-1 text-xs font-medium rounded-full border',
                        severityStyle(a.severity),
                      ].join(' ')}
                    >
                      {a.severity}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">
                    {formatTime(a.timestamp)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

