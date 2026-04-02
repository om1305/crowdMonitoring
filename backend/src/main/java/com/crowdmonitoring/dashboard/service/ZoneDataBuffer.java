// package com.crowdmonitoring.dashboard.service;

// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.concurrent.ConcurrentHashMap;

// import org.springframework.stereotype.Component;

// import com.crowdmonitoring.dashboard.model.dto.AiSensorPayload;

// /**
//  * In-memory buffer that holds AI-streamed payloads per zone.
//  *
//  * Flow:
//  * 1. AI sends data via WebSocket → stored here
//  * 2. Every 60 seconds → SensorCollectorScheduler drains buffer
//  * 3. Scheduler computes aggregates → writes to MongoDB
//  * 4. Buffer is cleared after drain
//  */
// @Component
// public class ZoneDataBuffer {

//     // Key = zone name, Value = list of payloads received in this window
//     private final ConcurrentHashMap<String, List<AiSensorPayload>>
//             buffer = new ConcurrentHashMap<>();

//     /**
//      * Called by AiDataIngestionController every time
//      * AI sends a new WebSocket message.
//      */
//     public void add(AiSensorPayload payload) {
//         if (payload.getZone() == null) return;
//         buffer.computeIfAbsent(
//                 payload.getZone(),
//                 k -> new ArrayList<>()
//         ).add(payload);
//     }

//     /**
//      * Called by SensorCollectorScheduler every 60 seconds.
//      * Returns a snapshot of current buffer and clears it.
//      */
//     public Map<String, List<AiSensorPayload>> drainAndClear() {
//         Map<String, List<AiSensorPayload>> snapshot =
//                 new HashMap<>(buffer);
//         buffer.clear();
//         return snapshot;
//     }

//     /**
//      * Returns latest payload per zone without clearing.
//      * Used for immediate re-broadcast to frontend.
//      */
//     public Map<String, AiSensorPayload> getLatestPerZone() {
//         Map<String, AiSensorPayload> latest = new HashMap<>();
//         buffer.forEach((zone, list) -> {
//             if (!list.isEmpty()) {
//                 latest.put(zone, list.get(list.size() - 1));
//             }
//         });
//         return latest;
//     }
// }
package com.crowdmonitoring.dashboard.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import com.crowdmonitoring.dashboard.model.dto.AiSensorPayload;

/**
 * In-memory buffer that holds AI-streamed payloads per zone.
 *
 * Flow:
 * 1. AI sends data via HTTP/WebSocket -> stored here
 * 2. Scheduler drains buffer periodically
 * 3. Aggregates are written to DB
 * 4. Buffer is cleared after drain
 */
@Component
public class ZoneDataBuffer {

    // Key = zone name, Value = list of payloads received in this window
    private final ConcurrentHashMap<String, List<AiSensorPayload>> buffer =
            new ConcurrentHashMap<>();

    /**
     * Called by AiDataIngestionController whenever AI sends a payload.
     */
    public void add(AiSensorPayload payload) {
        if (payload == null || payload.getZone() == null || payload.getZone().isBlank()) {
            return;
        }

        buffer.compute(payload.getZone(), (zone, list) -> {
            List<AiSensorPayload> updatedList = (list == null) ? new ArrayList<>() : new ArrayList<>(list);
            updatedList.add(payload);
            return updatedList;
        });
    }

    /**
     * Called by scheduler every window.
     * Returns current snapshot and clears buffer.
     */
    public Map<String, List<AiSensorPayload>> drainAndClear() {
        Map<String, List<AiSensorPayload>> snapshot = new HashMap<>();
        buffer.forEach((zone, list) -> snapshot.put(zone, new ArrayList<>(list)));
        buffer.clear();
        return snapshot;
    }

    /**
     * Returns latest payload per zone without clearing.
     * Useful for immediate UI broadcast or debug.
     */
    public Map<String, AiSensorPayload> getLatestPerZone() {
        Map<String, AiSensorPayload> latest = new HashMap<>();
        buffer.forEach((zone, list) -> {
            if (list != null && !list.isEmpty()) {
                latest.put(zone, list.get(list.size() - 1));
            }
        });
        return latest;
    }
}