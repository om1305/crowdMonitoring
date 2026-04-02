// import { useEffect, useMemo, useState } from 'react'
// import { getAnalytics, getHeatmap } from '../services/api'
// import HeatmapPanel from '../components/HeatmapPanel'
// import CrowdAnalyticsChart from '../components/CrowdAnalyticsChart'

// export default function AnalyticsPage() {
//   const [analytics, setAnalytics] = useState<any>(null)
//   const [heatmapPoints, setHeatmapPoints] = useState<
//     Array<{ lat: number; lng: number; intensity: number }>
//   >([])

//   useEffect(() => {
//     let cancelled = false
//     async function load() {
//       const [an, h] = await Promise.all([getAnalytics(), getHeatmap()])
//       if (cancelled) return
//       setAnalytics(an.data)
//       const points = h.data?.points || h.data?.heatmap || h.data || []
//       setHeatmapPoints(Array.isArray(points) ? points : [])
//     }
//     load().catch(() => {})
//     return () => {
//       cancelled = true
//     }
//   }, [])

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

//   return (
//     <div className="flex flex-col gap-6">
//       <HeatmapPanel points={heatmapPoints} />
//       <CrowdAnalyticsChart hourlyTrend={hourlyTrend} />
//     </div>
//   )
// }

import { useEffect, useMemo, useState } from 'react'
import { getAnalytics } from '../services/api'
import CrowdAnalyticsChart from '../components/CrowdAnalyticsChart'

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const an = await getAnalytics()
      if (cancelled) return
      setAnalytics(an.data)
    }
    load().catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const hourlyEntryExit = useMemo(() => {
    const trend =
      analytics?.hourlyEntryExit ||
      analytics?.hourlyTrend ||
      analytics?.hourlyData ||
      []

    return (Array.isArray(trend) ? trend : []).map((p: any) => ({
      label:
        p.label ??
        p.hourLabel ??
        p.hour ??
        (typeof p.time === 'string' ? p.time : ''),
      value: Number(p.value ?? p.entry ?? p.count ?? p.traffic ?? 0),
    }))
  }, [analytics])

  const weeklyCrowdTrend = useMemo(() => {
    const trend = analytics?.weeklyCrowdTrend || analytics?.weeklyTrend || []

    return (Array.isArray(trend) ? trend : []).map((p: any) => ({
      label: p.label ?? p.day ?? p.name ?? '',
      value: Number(p.value ?? p.count ?? p.crowd ?? 0),
    }))
  }, [analytics])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Peak Control</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            {analytics?.peakControl ?? analytics?.peakCrowd ?? 0}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Avg Daily Traffic</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            {analytics?.avgDailyTraffic ?? analytics?.averageTraffic ?? 0}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Busiest Day of Week</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            {analytics?.busiestDayOfWeek ?? analytics?.busiestDay ?? 'N/A'}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
  <CrowdAnalyticsChart
    title="Hourly Entry & Exit"
    subtitle="Hourly movement"
    hourlyTrend={hourlyEntryExit}
  />

  <CrowdAnalyticsChart
    title="Weekly Crowd Trend"
    subtitle="Weekly overview"
    hourlyTrend={weeklyCrowdTrend}
  />
</div>
    </div>
  )
}