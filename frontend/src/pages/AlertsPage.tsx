import { useEffect, useMemo, useState } from 'react'
import { getAlerts } from '../services/api'
import RecentAlertsTable from '../components/RecentAlertsTable'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any>(null)

  useEffect(() => {
    let cancelled = false
    getAlerts()
      .then((res: any) => {
        if (cancelled) return
        setAlerts(res.data)
      })
      .catch(() => {
        // ignore during scaffolding
      })
    return () => {
      cancelled = true
    }
  }, [])

  const recentAlerts = useMemo(() => {
    const list =
      alerts?.alertHistory ||
      alerts?.recentAlerts ||
      alerts?.activeAlerts ||
      []
    return Array.isArray(list) ? list.slice(0, 25) : []
  }, [alerts])

  return (
    <div className="flex flex-col gap-6">
      <RecentAlertsTable alerts={recentAlerts} />
    </div>
  )
}

