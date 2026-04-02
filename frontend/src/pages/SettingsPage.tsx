// export default function SettingsPage() {
//   return (
//     <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
//       <div className="font-semibold text-slate-900 text-lg mb-2">
//         Settings
//       </div>
//       <div className="text-sm text-gray-600">
//         Configure sensor sources, alert thresholds, and dashboard preferences.
//       </div>
//     </div>
//   )
// }
import { useState } from 'react'

export default function SettingsPage() {
  const [alertThreshold, setAlertThreshold] = useState(80)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [privacyMode, setPrivacyMode] = useState(true)
  const [mapOverlay, setMapOverlay] = useState(true)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="font-semibold text-slate-900 text-lg mb-2">
          Settings
        </div>
        <div className="text-sm text-gray-600">
          Configure alert rules, connectivity, privacy, maps, and data.
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Alert Configuration */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            Alert Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">
                Crowd Threshold
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                className="w-full mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Current: {alertThreshold}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Email Alerts</span>
              <button
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`px-3 py-1 rounded-full text-xs ${
                  emailAlerts
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {emailAlerts ? 'On' : 'Off'}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">SMS Alerts</span>
              <button
                onClick={() => setSmsAlerts(!smsAlerts)}
                className={`px-3 py-1 rounded-full text-xs ${
                  smsAlerts
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {smsAlerts ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            Connection Status
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Backend API</span>
              <span className="text-sm text-green-600 font-medium">
                Connected
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">WebSocket</span>
              <span className="text-sm text-green-600 font-medium">
                Active
              </span>
            </div>

            <div className="text-sm text-gray-500">
              Last sync: Just now
            </div>
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            Security & Privacy
          </h2>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Privacy Mode</span>
            <button
              onClick={() => setPrivacyMode(!privacyMode)}
              className={`px-3 py-1 rounded-full text-xs ${
                privacyMode
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {privacyMode ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Map Display Settings */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">
            Map Display Settings
          </h2>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Heatmap Overlay</span>
            <button
              onClick={() => setMapOverlay(!mapOverlay)}
              className={`px-3 py-1 rounded-full text-xs ${
                mapOverlay
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {mapOverlay ? 'Visible' : 'Hidden'}
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 xl:col-span-2">
          <h2 className="font-semibold text-slate-900 mb-4">
            Data Management
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Retention</p>
              <p className="text-sm font-medium text-gray-800 mt-1">
                30 Days
              </p>
            </div>

            <button className="border rounded-lg p-4 text-left hover:bg-gray-50">
              <p className="text-sm font-medium text-gray-800">
                Export Data
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Download analytics
              </p>
            </button>

            <button className="border border-red-200 rounded-lg p-4 text-left hover:bg-red-50">
              <p className="text-sm font-medium text-red-700">
                Clear Data
              </p>
              <p className="text-sm text-red-500 mt-1">
                Remove old records
              </p>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
