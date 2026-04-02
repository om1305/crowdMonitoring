// import { useEffect, useMemo, useState } from 'react'
// import {
//   getAlerts,
//   getAnalytics,
//   getDashboard,
//   getHeatmap,
// } from '../services/api'
// import useSocket from '../hooks/useSocket'
// import MetricCards from '../components/MetricCards'
// import HeatmapPanel from '../components/HeatmapPanel'
// import CrowdAnalyticsChart from '../components/CrowdAnalyticsChart'
// import ZoneStatsSection from '../components/ZoneStatsSection'
// import RecentAlertsTable from '../components/RecentAlertsTable'
// import RightPanel from '../components/RightPanel'

// type Zone = {
//   zoneName: string
//   crowdCount: number
//   density: 'Low' | 'Medium' | 'High' | string
//   riskScore: number
// }

// export default function DashboardPage() {
//   const [dashboard, setDashboard] = useState<any>(null)
//   const [alerts, setAlerts] = useState<any>(null)
//   const [analytics, setAnalytics] = useState<any>(null)
//   const [heatmapPoints, setHeatmapPoints] = useState<
//     Array<{ lat: number; lng: number; intensity: number }>
//   >([])

//   useEffect(() => {
//     let cancelled = false
//     async function load() {
//       const [d, a, an, h] = await Promise.all([
//         getDashboard(),
//         getAlerts(),
//         getAnalytics(),
//         getHeatmap(),
//       ])
//       if (cancelled) return
//       setDashboard(d.data)
//       setAlerts(a.data)
//       setAnalytics(an.data)
//       const points =
//         h.data?.points || h.data?.heatmap || h.data || []
//       setHeatmapPoints(Array.isArray(points) ? points : [])
//     }
//     load().catch(() => {
//       // Backend may be down during scaffolding; UI will stay empty.
//     })
//     return () => {
//       cancelled = true
//     }
//   }, [])

//   useSocket({
//     onCrowd: (payload: unknown) => {
//       // WebSocket "crowd" topic reuses /dashboard response shape.
//       setDashboard(payload)
//     },
//     onAlerts: (payload: unknown) => {
//       setAlerts(payload)
//     },
//     onHeatmap: (payload: unknown) => {
//       const p = payload as any
//       const points = p?.points || p?.heatmap || p || []
//       setHeatmapPoints(Array.isArray(points) ? points : [])
//     },
//   })

//   const metrics = useMemo(() => {
//     const totalCrowd = dashboard?.totalCrowd ?? 0
//     const activeAlerts = alerts?.activeAlerts?.length ?? 0
//     const networkScore = dashboard?.networkScore ?? 0
//     const peakCrowd =
//       analytics?.peakCrowd ?? dashboard?.peakCrowd ?? 0
//     return { totalCrowd, activeAlerts, networkScore, peakCrowd }
//   }, [analytics, alerts, dashboard])

//   const zones = useMemo<Zone[]>(() => dashboard?.zones || [], [dashboard])

//   const hourlyTrend = useMemo(() => {
//     const trend = analytics?.hourlyTrend || analytics?.hourlyData || []
//     return (Array.isArray(trend) ? trend : []).map((p: any) => ({
//       label:
//         p.label ??
//         p.hourLabel ??
//         p.hour ??
//         (typeof p.time === 'string' ? p.time : ''),
//       value: Number(p.value ?? p.count ?? p.traffic ?? 0),
//     }))
//   }, [analytics])

//   const recentAlerts = useMemo(() => {
//     const list =
//       alerts?.recentAlerts ||
//       alerts?.alertHistory ||
//       alerts?.activeAlerts ||
//       []
//     return (Array.isArray(list) ? list : []).slice(0, 10)
//   }, [alerts])

//   const sensorStatus = useMemo(() => {
//     return (
//       dashboard?.sensorStatus || {
//         status: 'Unknown',
//         activeSensors: 0,
//         uptimeSeconds: 0,
//         entryRate: 0,
//         exitRate: 0,
//       }
//     )
//   }, [dashboard])

//   const activity = useMemo(() => {
//     return (recentAlerts || []).slice(0, 6).map((a: any) => ({
//       text: `${a.zone || 'Zone'}: ${a.message || ''}`,
//       at: typeof a.timestamp === 'number' ? a.timestamp : Date.parse(a.timestamp),
//     }))
//   }, [recentAlerts])

//   return (
//     <div className="flex flex-col gap-6">
//       <MetricCards metrics={metrics} />

//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
//         <div className="xl:col-span-2 flex flex-col gap-6">
//           <HeatmapPanel points={heatmapPoints} />
//           <CrowdAnalyticsChart hourlyTrend={hourlyTrend} />
//           <ZoneStatsSection zones={zones} />
//           <RecentAlertsTable alerts={recentAlerts} />
//         </div>

//         <div className="hidden xl:block xl:col-span-1">
//           <RightPanel sensorStatus={sensorStatus} activity={activity} />
//         </div>
//       </div>
//     </div>
//   )
// }

import { useEffect, useMemo, useState } from 'react'
import {
  getAlerts,
  getAnalytics,
  getDashboard,
  getHeatmap,
} from '../services/api'
import useSocket from '../hooks/useSocket'
import MetricCards from '../components/MetricCards'
import HeatmapPanel from '../components/HeatmapPanel'
import CrowdAnalyticsChart from '../components/CrowdAnalyticsChart'
import ZoneStatsSection from '../components/ZoneStatsSection'
import RecentAlertsTable from '../components/RecentAlertsTable'
import RightPanel from '../components/RightPanel'

interface ZoneData {
  zone: string
  cameraCount: number
  wifiCount: number
  totalCrowd: number
  avgRSSI: number
  timestamp: string
}

type Zone = {
  zoneName: string
  crowdCount: number
  density: 'Low' | 'Medium' | 'High' | string
  riskScore: number
}

export default function DashboardPage() {
  const [zones, setZones] = useState<ZoneData[]>([])
  const [dashboard, setDashboard] = useState<any>(null)
  const [alerts, setAlerts] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [heatmapPoints, setHeatmapPoints] = useState<
    Array<{ lat: number; lng: number; intensity: number }>
  >([])

  // Fetch data from FastAPI endpoint
  const fetchData = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/combined')
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data: ZoneData[] = await res.json()
      setZones(data)
    } catch (error) {
      console.error('API error:', error)
    }
  }

  // Real-time refresh every 2 seconds
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [d, a, an, h] = await Promise.all([
        getDashboard(),
        getAlerts(),
        getAnalytics(),
        getHeatmap(),
      ])
      if (cancelled) return
      setDashboard(d.data)
      setAlerts(a.data)
      setAnalytics(an.data)
      const points =
        h.data?.points || h.data?.heatmap || h.data || []
      setHeatmapPoints(Array.isArray(points) ? points : [])
    }
    load().catch(() => {
      // Backend may be down during scaffolding; UI will stay empty.
    })
    return () => {
      cancelled = true
    }
  }, [])

  useSocket({
    onCrowd: (payload: unknown) => {
      setDashboard(payload)
    },
    onAlerts: (payload: unknown) => {
      setAlerts(payload)
    },
    onHeatmap: (payload: unknown) => {
      const p = payload as any
      const points = p?.points || p?.heatmap || p || []
      setHeatmapPoints(Array.isArray(points) ? points : [])
    },
  })

  const metrics = useMemo(() => {
    // Calculate metrics from zones data
    const totalCrowd = zones.reduce((sum, z) => sum + z.totalCrowd, 0)
    const highRiskZones = zones.filter((z) => z.totalCrowd > 100).length
    const avgRSSI =
      zones.length > 0
        ? Math.round(zones.reduce((sum, z) => sum + z.avgRSSI, 0) / zones.length)
        : 0
    const peakCrowd = zones.length > 0 ? Math.max(...zones.map((z) => z.totalCrowd)) : 0

    return {
      totalCrowd,
      activeAlerts: highRiskZones,
      networkScore: Math.abs(avgRSSI),
      peakCrowd,
    }
  }, [zones])

  const transformedZones = useMemo<Zone[]>(() => {
    return zones.map((z) => {
      const density =
        z.totalCrowd > 100 ? 'High' : z.totalCrowd > 50 ? 'Medium' : 'Low'
      const riskScore = z.totalCrowd > 0 ? (z.totalCrowd / 150) * 100 : 0
      return {
        zoneName: z.zone,
        crowdCount: z.totalCrowd,
        density,
        riskScore,
      }
    })
  }, [zones])

  const hourlyTrend = useMemo(() => {
    const trend = analytics?.hourlyTrend || analytics?.hourlyData || []
    return (Array.isArray(trend) ? trend : []).map((p: any) => ({
      label:
        p.label ??
        p.hourLabel ??
        p.hour ??
        (typeof p.time === 'string' ? p.time : ''),
      value: Number(p.value ?? p.count ?? p.traffic ?? 0),
    }))
  }, [analytics])

  const recentAlerts = useMemo(() => {
    const list =
      alerts?.recentAlerts ||
      alerts?.alertHistory ||
      alerts?.activeAlerts ||
      []
    return (Array.isArray(list) ? list : []).slice(0, 10)
  }, [alerts])

  const sensorStatus = useMemo(() => {
    return (
      dashboard?.sensorStatus || {
        status: 'Unknown',
        activeSensors: 0,
        uptimeSeconds: 0,
        entryRate: 0,
        exitRate: 0,
      }
    )
  }, [dashboard])

  const activity = useMemo(() => {
    return (recentAlerts || []).slice(0, 6).map((a: any) => ({
      text: `${a.zone || 'Zone'}: ${a.message || ''}`,
      at: typeof a.timestamp === 'number' ? a.timestamp : Date.parse(a.timestamp),
    }))
  }, [recentAlerts])

  // Generate heatmap points from zones data
  const generatedHeatmapPoints = useMemo(() => {
    return zones.map((zone, index) => {
      // Create pseudo coordinates based on zone index for distribution
      const lat = 28.61 + (index % 3) * 0.05
      const lng = 77.23 + Math.floor(index / 3) * 0.05
      // Intensity: > 100 danger, > 50 medium, else safe
      const intensity =
        zone.totalCrowd > 100 ? 0.9 : zone.totalCrowd > 50 ? 0.5 : 0.2
      return { lat, lng, intensity }
    })
  }, [zones])

  const finalHeatmapPoints = useMemo(() => {
    // Prefer generated points from zones, fallback to heatmapPoints
    return generatedHeatmapPoints.length > 0 ? generatedHeatmapPoints : heatmapPoints
  }, [generatedHeatmapPoints, heatmapPoints])

  return (
    <div className="flex flex-col gap-6">
      <MetricCards metrics={metrics} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2">
          <HeatmapPanel points={finalHeatmapPoints} />
        </div>

        <div className="hidden xl:block xl:col-span-1">
          <RightPanel sensorStatus={sensorStatus} activity={activity} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2">
          <CrowdAnalyticsChart hourlyTrend={hourlyTrend} />
        </div>

        <div className="xl:col-span-1">
          <ZoneStatsSection zones={transformedZones} />
        </div>
      </div>

      <div className="w-full">
        <RecentAlertsTable alerts={recentAlerts} />
      </div>
    </div>
  )
}