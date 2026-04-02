import { useEffect, useMemo, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import type { IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

type SocketCallbacks = {
  onCrowd?: (payload: unknown) => void
  onAlerts?: (payload: unknown) => void
  onHeatmap?: (payload: unknown) => void
  onActivity?: (payload: unknown) => void
}

export default function useSocket({
  onCrowd,
  onAlerts,
  onHeatmap,
  onActivity,
}: SocketCallbacks) {
  const [connected, setConnected] = useState(false)
  const clientRef = useRef<Client | null>(null)

  const webSocketUrl = useMemo(() => `${API_BASE_URL}/ws`, [])

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(webSocketUrl),
      reconnectDelay: 2000,
      debug: () => {
        // quiet by default
      },
      onConnect: () => {
        setConnected(true)

        client.subscribe('/topic/crowd', (message: IMessage) => {
          try {
            onCrowd?.(JSON.parse(message.body))
          } catch {
            // ignore malformed messages
          }
        })

        client.subscribe('/topic/alerts', (message: IMessage) => {
          try {
            onAlerts?.(JSON.parse(message.body))
          } catch {
            // ignore malformed messages
          }
        })

        client.subscribe('/topic/heatmap', (message: IMessage) => {
          try {
            onHeatmap?.(JSON.parse(message.body))
          } catch {
            // ignore malformed messages
          }
        })

        client.subscribe('/topic/activity', (message: IMessage) => {
          try {
            onActivity?.(JSON.parse(message.body))
          } catch {
            // ignore malformed messages
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
  }, [onActivity, onAlerts, onCrowd, onHeatmap, webSocketUrl])

  return { connected, client: clientRef.current }
}

