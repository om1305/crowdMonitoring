// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from 'chart.js'
// import { Line } from 'react-chartjs-2'

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// )

// export default function CrowdAnalyticsChart({
//   hourlyTrend,
// }: {
//   hourlyTrend: Array<{ label: string; value: number }>
// }) {
//   const labels = hourlyTrend.map((p) => p.label)
//   const values = hourlyTrend.map((p) => p.value)

//   const chartData = {
//     labels,
//     datasets: [
//       {
//         label: 'Crowd Level',
//         data: values,
//         borderColor: '#0ea5e9', // sky-500
//         backgroundColor: 'rgba(14,165,233,0.12)',
//         tension: 0.35,
//         pointRadius: 2,
//         pointHoverRadius: 4,
//         fill: true,
//       },
//     ],
//   }

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       tooltip: {
//         callbacks: {
//           label: (ctx: any) => ` ${ctx.parsed.y}`,
//         },
//       },
//     },
//     scales: {
//       x: {
//         ticks: {
//           maxTicksLimit: 8,
//           autoSkip: true,
//           color: '#64748b',
//         },
//         grid: {
//           color: 'rgba(148,163,184,0.18)',
//         },
//       },
//       y: {
//         ticks: {
//           color: '#64748b',
//         },
//         grid: {
//           color: 'rgba(148,163,184,0.18)',
//         },
//       },
//     },
//   } as const

//   return (
//     <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
//       <div className="flex items-center justify-between mb-4">
//         <div className="text-gray-800 font-semibold">
//           Crowd Analytics (24-hour)
//         </div>
//         <div className="text-xs text-gray-500">Hourly trend</div>
//       </div>
//       <div className="h-72">
//         <Line data={chartData as any} options={options as any} />
//       </div>
//     </div>
//   )
// }

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
)

export default function CrowdAnalyticsChart({
  title = 'Crowd Analytics (24-hour)',
  subtitle = 'Hourly trend',
  hourlyTrend,
}: {
  title?: string
  subtitle?: string
  hourlyTrend: Array<{ label: string; value: number }>
}) {
  const labels = hourlyTrend.map((p) => p.label)
  const values = hourlyTrend.map((p) => p.value)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Crowd Level',
        data: values,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14,165,233,0.12)',
        tension: 0.35,
        pointRadius: 2,
        pointHoverRadius: 4,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 8,
          autoSkip: true,
          color: '#64748b',
        },
        grid: {
          color: 'rgba(148,163,184,0.18)',
        },
      },
      y: {
        ticks: {
          color: '#64748b',
        },
        grid: {
          color: 'rgba(148,163,184,0.18)',
        },
      },
    },
  } as const

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-800 font-semibold">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
      <div className="h-72">
        <Line data={chartData as any} options={options as any} />
      </div>
    </div>
  )
}