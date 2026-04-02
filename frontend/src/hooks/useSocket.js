import { useEffect, useMemo, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export default function useSocket({
  onCrowd,
  onAlerts,
  onHeatmap,
  onActivity,
}) {
  const [connected, setConnected] = useState(false)
  const clientRef = useRef(null)

  const webSocketUrl = useMemo(() => `${API_BASE_URL}/ws`, [])

  useEffect(() => {
    const client = new Client({
      // Use SockJS for compatibility.
      webSocketFactory: () => new SockJS(webSocketUrl),
      reconnectDelay: 2000,
      debug: () => {
        // Intentionally quiet by default; enable if you need troubleshooting.
      },
      onConnect: () => {
        setConnected(true)

        client.subscribe('/topic/crowd', (message) => {
          try {
            const payload = JSON.parse(message.body)
            onCrowd?.(payload)
          } catch {
            // Ignore malformed messages.
          }
        })

        client.subscribe('/topic/alerts', (message) => {
          try {
            const payload = JSON.parse(message.body)
            onAlerts?.(payload)
          } catch {
            // Ignore malformed messages.
          }
        })

        client.subscribe('/topic/heatmap', (message) => {
          try {
            const payload = JSON.parse(message.body)
            onHeatmap?.(payload)
          } catch {
            // Ignore malformed messages.
          }
        })

        client.subscribe('/topic/activity', (message) => {
          try {
            const payload = JSON.parse(message.body)
            onActivity?.(payload)
          } catch {
            // Ignore malformed messages.
          }
        })
      },
      onStompError: () => {
        setConnected(false)
      },
    })

    clientRef.current = client
    client.activate()

    return () => {
      try {
        client.deactivate()
      } catch {
        // no-op
      }
    }
  }, [onCrowd, onAlerts, onHeatmap, onActivity, webSocketUrl])

  return { connected, client: clientRef.current }
}

