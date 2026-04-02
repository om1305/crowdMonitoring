// import { useEffect, useMemo, useRef } from 'react'
// import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'
// import 'leaflet.heat'

// type HeatPoint = { lat: number; lng: number; intensity: number }

// export default function HeatmapPanel({
//   points,
// }: {
//   points: HeatPoint[]
// }) {
//   const mapRef = useRef<L.Map | null>(null)
//   const heatLayerRef = useRef<any>(null)

//   const center = useMemo(() => {
//     const p = points?.[0]
//     return p ? [p.lat, p.lng] : [28.61, 77.23]
//   }, [points])

//   useEffect(() => {
//     if (!mapRef.current) {
//       const map = L.map('heatmap-container', {
//         zoomControl: true,
//         scrollWheelZoom: false,
//       }).setView(center as [number, number], 15)

//       L.tileLayer(
//         'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//         {
//           maxZoom: 19,
//           attribution:
//             '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//         },
//       ).addTo(map)

//       mapRef.current = map

//       // Create heat layer.
//       const heat = (L as any).heatLayer([], {
//         radius: 25,
//         blur: 18,
//         maxZoom: 17,
//         minOpacity: 0.35,
//       })
//       heat.addTo(map)
//       heatLayerRef.current = heat
//     }

//     // Update heat points.
//     const heat = heatLayerRef.current

// if (heat && points && points.length > 0) {
//   const latlngIntensity = points
//     .filter(p => 
//       p && 
//       typeof p.lat === "number" && 
//       typeof p.lng === "number"
//     )
//     .map((p) => [
//       p.lat,
//       p.lng,
//       Math.max(0, Math.min(1, p.intensity || 0)),
//     ])

//   if (latlngIntensity.length > 0) {
//     heat.setLatLngs(latlngIntensity)
//   }}
// }, [points, center]) 

//   useEffect(() => {
//     return () => {
//       try {
//         mapRef.current?.remove()
//       } catch {
//         // no-op
//       }
//       mapRef.current = null
//       heatLayerRef.current = null
//     }
//   }, [])

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
//       <div className="flex items-center justify-between mb-3">
//         <div className="font-semibold text-slate-900">
//           Heatmap (TOP)
//         </div>
//         <div className="text-xs text-gray-500">Crowd intensity overlay</div>
//       </div>

//       <div
//   id="heatmap-container"
//   style={{ height: "400px", width: "100%" }}
//   className="rounded-lg overflow-hidden border border-gray-100"
// />
//     </div>
//   )
// }

// import { useEffect, useMemo, useRef } from 'react'
// import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'
// import 'leaflet.heat'

// type HeatPoint = { lat: number; lng: number; intensity: number }

// export default function HeatmapPanel({
//   points,
// }: {
//   points: HeatPoint[]
// }) {
//   const mapRef = useRef<L.Map | null>(null)
//   const heatLayerRef = useRef<any>(null)

//   const center = useMemo(() => {
//     const p = points?.[0]
//     return p ? [p.lat, p.lng] : [28.61, 77.23]
//   }, [points])

//   // 🔹 Create map + update heatmap
//   useEffect(() => {
//     if (!mapRef.current) {
//       const map = L.map('heatmap-container', {
//         zoomControl: true,
//         scrollWheelZoom: false,
//       }).setView(center as [number, number], 15)

//       L.tileLayer(
//         'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//         {
//           maxZoom: 19,
//           attribution: '&copy; OpenStreetMap contributors',
//         },
//       ).addTo(map)

//       mapRef.current = map

//       const heat = (L as any).heatLayer([], {
//         radius: 25,
//         blur: 18,
//         maxZoom: 17,
//         minOpacity: 0.35,
//       })

//       heat.addTo(map)
//       heatLayerRef.current = heat
//     }

//     const heat = heatLayerRef.current

//     if (heat && points && points.length > 0) {
//       const latlngIntensity = points
//         .filter(
//           (p) =>
//             p &&
//             typeof p.lat === 'number' &&
//             typeof p.lng === 'number'
//         )
//         .map((p) => [
//           p.lat,
//           p.lng,
//           Math.max(0, Math.min(1, p.intensity || 0)),
//         ])

//       if (latlngIntensity.length > 0) {
//         heat.setLatLngs(latlngIntensity)
//       }
//     }
//   }, [points, center])

//   // 🔹 Cleanup
//   useEffect(() => {
//     return () => {
//       try {
//         mapRef.current?.remove()
//       } catch {
//         // ignore
//       }
//       mapRef.current = null
//       heatLayerRef.current = null
//     }
//   }, [])

//   return (
//     <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
//       <div className="flex items-center justify-between mb-4">
//         <div className="text-gray-800 font-semibold">
//           Heatmap (TOP)
//         </div>
//         <div className="text-xs text-gray-500">
//           Crowd intensity overlay
//         </div>
//       </div>

//       <div
//         id="heatmap-container"
//         style={{ height: '360px', width: '100%' }}
//         className="rounded-2xl overflow-hidden border border-gray-200 bg-white"
//       />
//     </div>
//   )
// }


// import { useEffect, useMemo, useRef, useState } from 'react'
// import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'
// import 'leaflet.heat'
// import 'leaflet-draw'
// import 'leaflet-draw/dist/leaflet.draw.css'

// type HeatPoint = { lat: number; lng: number; intensity: number }

// type ZoneShape = {
//   id: string
//   name: string
//   type: 'polygon' | 'rectangle'
//   coordinates: Array<[number, number]>
// }

// export default function HeatmapPanel({
//   points,
// }: {
//   points: HeatPoint[]
// }) {
//   const mapRef = useRef<L.Map | null>(null)
//   const heatLayerRef = useRef<any>(null)
//   const drawnItemsRef = useRef<L.FeatureGroup | null>(null)
//   const drawControlRef = useRef<L.Control.Draw | null>(null)

//   const [locationQuery, setLocationQuery] = useState('')
//   const [zones, setZones] = useState<ZoneShape[]>([])
//   const [isSearching, setIsSearching] = useState(false)

//   const center = useMemo(() => {
//     const p = points?.[0]
//     return p ? [p.lat, p.lng] : [28.6139, 77.209] // Delhi fallback
//   }, [points])

//   const extractZoneCoordinates = (layer: any): Array<[number, number]> => {
//     if (!layer) return []

//     if (typeof layer.getLatLngs === 'function') {
//       const latlngs = layer.getLatLngs()

//       // Polygon / Rectangle usually returns nested arrays
//       const firstRing = Array.isArray(latlngs?.[0]) ? latlngs[0] : latlngs

//       return (firstRing || []).map((p: L.LatLng) => [p.lat, p.lng])
//     }

//     return []
//   }

//   const refreshZonesFromMap = () => {
//     const group = drawnItemsRef.current
//     if (!group) return

//     const nextZones: ZoneShape[] = []

//     group.eachLayer((layer: any) => {
//       const id =
//         layer._leaflet_id?.toString?.() || Math.random().toString(36).slice(2)

//       const coordinates = extractZoneCoordinates(layer)

//       if (coordinates.length === 0) return

//       const type =
//         layer instanceof L.Rectangle ? 'rectangle' : 'polygon'

//       const existing = zones.find((z) => z.id === id)

//       nextZones.push({
//         id,
//         name: existing?.name || `Zone ${nextZones.length + 1}`,
//         type,
//         coordinates,
//       })
//     })

//     setZones(nextZones)
//   }

//   const searchLocation = async () => {
//     if (!locationQuery.trim()) return

//     try {
//       setIsSearching(true)

//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
//           locationQuery,
//         )}`,
//       )
//       const data = await res.json()

//       if (!Array.isArray(data) || data.length === 0) {
//         alert('Location not found')
//         return
//       }

//       const first = data[0]
//       const lat = Number(first.lat)
//       const lon = Number(first.lon)

//       if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
//         alert('Invalid location result')
//         return
//       }

//       if (mapRef.current) {
//   mapRef.current.setView([lat, lon], 17)

//   setTimeout(() => {
//     mapRef.current?.invalidateSize()
//   }, 100)

//         L.popup()
//           .setLatLng([lat, lon])
//           .setContent(`<b>${first.display_name}</b>`)
//           .openOn(mapRef.current)
//       }
//     } catch (error) {
//       console.error('Location search failed:', error)
//       alert('Failed to search location')
//     } finally {
//       setIsSearching(false)
//     }
//   }

// //   useEffect(() => {
// //     if (mapRef.current) return

// //     const map = L.map('heatmap-container', {
// //       zoomControl: true,
// //       scrollWheelZoom: false,
// //     }).setView(center as [number, number], 15)

// //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// //       maxZoom: 19,
// //       attribution: '&copy; OpenStreetMap contributors',
// //     }).addTo(map)

// //     mapRef.current = map

// //     // Heat layer
// //     const heat = (L as any).heatLayer([], {
// //       radius: 25,
// //       blur: 18,
// //       maxZoom: 17,
// //       minOpacity: 0.35,
// //     })
// //     heat.addTo(map)
// //     heatLayerRef.current = heat

// //     // Group for editable drawn layers
// //     const drawnItems = new L.FeatureGroup()
// //     map.addLayer(drawnItems)
// //     drawnItemsRef.current = drawnItems

// //     // Draw control
// //     // const drawControl = new L.Control.Draw({
// //     //   position: 'topleft',
// //     //   draw: {
// //     //     polyline: false,
// //     //     circle: false,
// //     //     circlemarker: false,
// //     //     marker: false,
// //     //     polygon: {
// //     //       allowIntersection: false,
// //     //       showArea: true,
// //     //     },
// //     //     rectangle: true,
// //     //   },
// //     //   edit: {
// //     //     featureGroup: drawnItems,
// //     //     remove: true,
// //     //   },
// //     // })
// //     const drawControl = new (L.Control as any).Draw({
// //   position: 'topleft',
// //   draw: {
// //     polyline: false,
// //     circle: false,
// //     circlemarker: false,
// //     marker: false,
// //     polygon: {
// //       allowIntersection: false,
// //       showArea: true,
// //     },
// //     rectangle: {},
// //   },
// //   edit: {
// //     featureGroup: drawnItems,
// //     remove: true,
// //   },
// // })

// //     map.addControl(drawControl)
// //     drawControlRef.current = drawControl

// //     map.on(L.Draw.Event.CREATED, (e: any) => {
// //       const layer = e.layer
// //       drawnItems.addLayer(layer)
// //       refreshZonesFromMap()
// //     })

// //     map.on(L.Draw.Event.EDITED, () => {
// //       refreshZonesFromMap()
// //     })

// //     map.on(L.Draw.Event.DELETED, () => {
// //       refreshZonesFromMap()
// //     })
// //   }, [center])

//   useEffect(() => {
//   if (mapRef.current) return

//   // const map = L.map('heatmap-container', {
//   //   zoomControl: false,
//   //   scrollWheelZoom: true,
//   // }).setView(center as [number, number], 15)

//   // L.control.zoom({ position: 'topleft' }).addTo(map)
//   const map = L.map('heatmap-container', {
//   zoomControl: false,
//   scrollWheelZoom: true,
//   doubleClickZoom: false,
//   boxZoom: false,
// }).setView(center as [number, number], 15)

// L.control.zoom({ position: 'topleft' }).addTo(map)

//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; OpenStreetMap contributors',
//   }).addTo(map)

//   mapRef.current = map

//   setTimeout(() => {
//     map.invalidateSize()
//   }, 100)

//   const heat = (L as any).heatLayer([], {
//     radius: 25,
//     blur: 18,
//     maxZoom: 17,
//     minOpacity: 0.35,
//   })
//   heat.addTo(map)
//   heatLayerRef.current = heat

//   const drawnItems = new L.FeatureGroup()
//   map.addLayer(drawnItems)
//   drawnItemsRef.current = drawnItems

//   console.log('Draw loaded:', !!(L.Control as any).Draw)

//   // const drawControl = new (L.Control as any).Draw({
//   //   position: 'topleft',
//   //   draw: {
//   //     polyline: false,
//   //     circle: false,
//   //     circlemarker: false,
//   //     marker: false,
//   //     polygon: {
//   //       allowIntersection: false,
//   //       showArea: true,
//   //     },
//   //     rectangle: {},
//   //   },
//   //   edit: {
//   //     featureGroup: drawnItems,
//   //     remove: true,
//   //   },
//   // })
//   const drawControl = new (L.Control as any).Draw({
//   position: 'topleft',
//   draw: {
//     polyline: false,
//     circle: false,
//     circlemarker: false,
//     marker: false,
//     polygon: {
//       allowIntersection: false,
//       showArea: true,
//       repeatMode: false,
//       shapeOptions: {
//         weight: 2,
//       },
//     },
//     rectangle: {
//       repeatMode: false,
//       shapeOptions: {
//         weight: 2,
//       },
//     },
//   },
//   edit: {
//     featureGroup: drawnItems,
//     remove: true,
//   },
// })

//   map.addControl(drawControl)
//   drawControlRef.current = drawControl
//   map.on((L as any).Draw.Event.DRAWSTART, (e: any) => {
//   console.log('DRAW START', e.layerType)
// })

// map.on((L as any).Draw.Event.CREATED, (e: any) => {
//   console.log('CREATED', e.layerType, e.layer)
//   const layer = e.layer
//   drawnItems.addLayer(layer)
//   refreshZonesFromMap()
// })

//   map.on((L as any).Draw.Event.CREATED, (e: any) => {
//     const layer = e.layer
//     drawnItems.addLayer(layer)
//     refreshZonesFromMap()
//   })

//   map.on((L as any).Draw.Event.EDITED, () => {
//     refreshZonesFromMap()
//   })

//   map.on((L as any).Draw.Event.DELETED, () => {
//     refreshZonesFromMap()
//   })
// }, [center])

//   useEffect(() => {
//     const heat = heatLayerRef.current

//     if (!heat) return

//     if (points && points.length > 0) {
//       const latlngIntensity = points
//         .filter(
//           (p) =>
//             p &&
//             typeof p.lat === 'number' &&
//             typeof p.lng === 'number',
//         )
//         .map((p) => [
//           p.lat,
//           p.lng,
//           Math.max(0, Math.min(1, p.intensity || 0)),
//         ])

//       heat.setLatLngs(latlngIntensity)

//       if (latlngIntensity.length > 0 && mapRef.current) {
//         mapRef.current.panTo([latlngIntensity[0][0], latlngIntensity[0][1]])
//       }
//     } else {
//       heat.setLatLngs([])
//     }
//   }, [points])

//   useEffect(() => {
//     return () => {
//       try {
//         mapRef.current?.remove()
//       } catch {
//         // ignore
//       }
//       mapRef.current = null
//       heatLayerRef.current = null
//       drawnItemsRef.current = null
//       drawControlRef.current = null
//     }
//   }, [])

//   const renameZone = (id: string, newName: string) => {
//     setZones((prev) =>
//       prev.map((z) => (z.id === id ? { ...z, name: newName } : z)),
//     )
//   }

//   return (
//     <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
//       <div className="flex flex-col gap-4 mb-4">
//         <div className="flex items-center justify-between">
//           <div className="text-gray-800 font-semibold">
//             Heatmap + Zone Setup
//           </div>
//           <div className="text-xs text-gray-500">
//             Search location, then draw zones
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row gap-3">
//           <input
//             value={locationQuery}
//             onChange={(e) => setLocationQuery(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') searchLocation()
//             }}
//             placeholder="Enter location, venue, campus, gate..."
//             className="flex-1 h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500"
//           />
//           <button
//             onClick={searchLocation}
//             disabled={isSearching}
//             className="h-11 px-5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
//           >
//             {isSearching ? 'Searching...' : 'Set Location'}
//           </button>
//         </div>
//       </div>

//       <div
//         id="heatmap-container"
//         style={{ height: '420px', width: '100%' }}
//         className="rounded-2xl border border-gray-200 bg-white"
//       />

//       <div className="mt-4 border border-gray-200 rounded-2xl p-4">
//         <div className="text-sm font-semibold text-gray-800 mb-3">
//           Created Zones
//         </div>

//         {zones.length === 0 ? (
//           <div className="text-sm text-gray-500">
//             No zones yet. Use the draw tools on the map to create polygon or rectangle zones.
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {zones.map((zone, index) => (
//               <div
//                 key={zone.id}
//                 className="border border-gray-200 rounded-xl p-3 bg-gray-50"
//               >
//                 <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
//                   <input
//                     value={zone.name}
//                     onChange={(e) => renameZone(zone.id, e.target.value)}
//                     className="h-10 rounded-lg border border-gray-300 px-3 bg-white"
//                   />
//                   <div className="text-xs text-gray-600">
//                     {zone.type} • {zone.coordinates.length} points
//                   </div>
//                 </div>

//                 <div className="mt-2 text-xs text-gray-500 break-all">
//                   {JSON.stringify(zone.coordinates)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'

type HeatPoint = { lat: number; lng: number; intensity: number }

type ZoneShape = {
  id: string
  name: string
  type: 'polygon' | 'rectangle'
  coordinates: Array<[number, number]>
}

export default function HeatmapPanel({
  points,
}: {
  points: HeatPoint[]
}) {
  const mapRef = useRef<L.Map | null>(null)
  const heatLayerRef = useRef<any>(null)
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null)
  const drawControlRef = useRef<any>(null)
  const hasCenteredRef = useRef(false)

  const [locationQuery, setLocationQuery] = useState('')
  const [zones, setZones] = useState<ZoneShape[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const extractZoneCoordinates = (layer: any): Array<[number, number]> => {
    if (!layer) return []

    if (typeof layer.getLatLngs === 'function') {
      const latlngs = layer.getLatLngs()
      const firstRing = Array.isArray(latlngs?.[0]) ? latlngs[0] : latlngs
      return (firstRing || []).map((p: L.LatLng) => [p.lat, p.lng])
    }

    return []
  }

  const refreshZonesFromMap = () => {
    const group = drawnItemsRef.current
    if (!group) return

    setZones((prevZones) => {
      const nextZones: ZoneShape[] = []

      group.eachLayer((layer: any) => {
        const id =
          layer._leaflet_id?.toString?.() ||
          Math.random().toString(36).slice(2)

        const coordinates = extractZoneCoordinates(layer)
        if (coordinates.length === 0) return

        const type = layer instanceof L.Rectangle ? 'rectangle' : 'polygon'
        const existing = prevZones.find((z) => z.id === id)

        nextZones.push({
          id,
          name: existing?.name || `Zone ${nextZones.length + 1}`,
          type,
          coordinates,
        })
      })

      return nextZones
    })
  }

  const searchLocation = async () => {
    if (!locationQuery.trim()) return

    try {
      setIsSearching(true)

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          locationQuery,
        )}`,
      )
      const data = await res.json()

      if (!Array.isArray(data) || data.length === 0) {
        alert('Location not found')
        return
      }

      const first = data[0]
      const lat = Number(first.lat)
      const lon = Number(first.lon)

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        alert('Invalid location result')
        return
      }

      if (mapRef.current) {
        mapRef.current.setView([lat, lon], 17)

        setTimeout(() => {
          mapRef.current?.invalidateSize()
        }, 100)

        L.popup()
          .setLatLng([lat, lon])
          .setContent(`<b>${first.display_name}</b>`)
          .openOn(mapRef.current)
      }
    } catch (error) {
      console.error('Location search failed:', error)
      alert('Failed to search location')
    } finally {
      setIsSearching(false)
    }
  }

  // Create map only once
  useEffect(() => {
    if (mapRef.current) return

    const initialCenter: [number, number] =
      points && points.length > 0
        ? [points[0].lat, points[0].lng]
        : [28.6139, 77.209]

    const map = L.map('heatmap-container', {
      zoomControl: false,
      scrollWheelZoom: true,
      doubleClickZoom: false,
      boxZoom: false,
    }).setView(initialCenter, 15)

    L.control.zoom({ position: 'topleft' }).addTo(map)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    mapRef.current = map

    setTimeout(() => {
      map.invalidateSize()
    }, 100)

    const heat = (L as any).heatLayer([], {
      radius: 25,
      blur: 18,
      maxZoom: 17,
      minOpacity: 0.35,
    })
    heat.addTo(map)
    heatLayerRef.current = heat

    const drawnItems = new L.FeatureGroup()
    map.addLayer(drawnItems)
    drawnItemsRef.current = drawnItems

    const drawControl = new (L.Control as any).Draw({
      position: 'topleft',
      draw: {
        polyline: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
          repeatMode: false,
          shapeOptions: {
            weight: 2,
          },
        },
        rectangle: {
          repeatMode: false,
          shapeOptions: {
            weight: 2,
          },
        },
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    })

    map.addControl(drawControl)
    drawControlRef.current = drawControl

    map.on((L as any).Draw.Event.CREATED, (e: any) => {
      const layer = e.layer
      drawnItems.addLayer(layer)
      refreshZonesFromMap()
    })

    map.on((L as any).Draw.Event.EDITED, () => {
      refreshZonesFromMap()
    })

    map.on((L as any).Draw.Event.DELETED, () => {
      refreshZonesFromMap()
    })
  }, [])

  // Update heat layer when points change
  useEffect(() => {
    if (!mapRef.current || !heatLayerRef.current) return

    const heat = heatLayerRef.current

    if (points && points.length > 0) {
      const latlngIntensity = points
        .filter(
          (p) =>
            p &&
            typeof p.lat === 'number' &&
            typeof p.lng === 'number',
        )
        .map((p) => [
          p.lat,
          p.lng,
          Math.max(0, Math.min(1, p.intensity || 0)),
        ])

      heat.setLatLngs(latlngIntensity)

      // center only once on first real data
      if (!hasCenteredRef.current && latlngIntensity.length > 0) {
        mapRef.current.setView(
          [latlngIntensity[0][0] as number, latlngIntensity[0][1] as number],
          15,
        )
        hasCenteredRef.current = true
      }
    } else {
      heat.setLatLngs([])
    }
  }, [points])

  useEffect(() => {
    return () => {
      try {
        mapRef.current?.remove()
      } catch {
        // ignore
      }
      mapRef.current = null
      heatLayerRef.current = null
      drawnItemsRef.current = null
      drawControlRef.current = null
    }
  }, [])

  const renameZone = (id: string, newName: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, name: newName } : z)),
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="text-gray-800 font-semibold">
            Heatmap + Zone Setup
          </div>
          <div className="text-xs text-gray-500">
            Search location, then draw zones
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') searchLocation()
            }}
            placeholder="Enter location, venue, campus, gate..."
            className="flex-1 h-11 rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500"
          />
          <button
            onClick={searchLocation}
            disabled={isSearching}
            className="h-11 px-5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {isSearching ? 'Searching...' : 'Set Location'}
          </button>
        </div>
      </div>

      <div
        id="heatmap-container"
        style={{ height: '420px', width: '100%' }}
        className="rounded-2xl border border-gray-200 bg-white"
      />

      <div className="mt-4 border border-gray-200 rounded-2xl p-4">
        <div className="text-sm font-semibold text-gray-800 mb-3">
          Created Zones
        </div>

        {zones.length === 0 ? (
          <div className="text-sm text-gray-500">
            No zones yet. Use the draw tools on the map to create polygon or rectangle zones.
          </div>
        ) : (
          <div className="space-y-3">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="border border-gray-200 rounded-xl p-3 bg-gray-50"
              >
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                  <input
                    value={zone.name}
                    onChange={(e) => renameZone(zone.id, e.target.value)}
                    className="h-10 rounded-lg border border-gray-300 px-3 bg-white"
                  />
                  <div className="text-xs text-gray-600">
                    {zone.type} • {zone.coordinates.length} points
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-500 break-all">
                  {JSON.stringify(zone.coordinates)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}