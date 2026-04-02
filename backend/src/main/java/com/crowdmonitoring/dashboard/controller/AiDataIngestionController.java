// // // package com.crowdmonitoring.dashboard.controller;

// // // import java.time.Instant;
// // // import java.util.List;

// // // import org.slf4j.Logger;
// // // import org.slf4j.LoggerFactory;
// // // import org.springframework.messaging.handler.annotation.MessageMapping;
// // // import org.springframework.stereotype.Controller;

// // // import com.crowdmonitoring.dashboard.model.dto.AiSensorPayload;
// // // import com.crowdmonitoring.dashboard.model.dto.AlertsResponse;
// // // import com.crowdmonitoring.dashboard.model.dto.DashboardResponse;
// // // import com.crowdmonitoring.dashboard.model.dto.HeatmapResponse;
// // // import com.crowdmonitoring.dashboard.model.dto.SensorStatusResponse;
// // // import com.crowdmonitoring.dashboard.repository.AlertRepository;
// // // import com.crowdmonitoring.dashboard.repository.CrowdMinuteDataRepository;
// // // import com.crowdmonitoring.dashboard.repository.HourlyDataRepository;
// // // import com.crowdmonitoring.dashboard.repository.SensorStatusRepository;
// // // import com.crowdmonitoring.dashboard.service.AlertsEngineService;
// // // import com.crowdmonitoring.dashboard.service.DashboardQueryService;
// // // import com.crowdmonitoring.dashboard.service.HeatmapDataService;
// // // import com.crowdmonitoring.dashboard.service.ZoneDataBuffer;
// // // import com.crowdmonitoring.dashboard.repository.HeatmapDataRepository;
// // // import com.crowdmonitoring.dashboard.websocket.RealTimeBroadcastService;

// // // /**
// // //  * WebSocket controller that receives processed data FROM the AI layer.
// // //  *
// // //  * AI connects to: ws://backend-host/ws
// // //  * AI sends to:    /app/ai/sensor-data
// // //  *
// // //  * On each received payload:
// // //  *  1. Add to in-memory buffer (for 60s aggregation)
// // //  *  2. Run real-time alert check
// // //  *  3. Immediately re-broadcast to frontend via WebSocket
// // //  */
// // // @Controller
// // // public class AiDataIngestionController {

// // //     private static final Logger log =
// // //             LoggerFactory.getLogger(AiDataIngestionController.class);

// // //     private final ZoneDataBuffer zoneDataBuffer;
// // //     private final AlertsEngineService alertsEngineService;
// // //     private final DashboardQueryService dashboardQueryService;
// // //     private final HeatmapDataService heatmapDataService;
// // //     private final RealTimeBroadcastService broadcastService;

// // //     private final CrowdMinuteDataRepository crowdRepo;
// // //     private final AlertRepository alertRepo;
// // //     private final HourlyDataRepository hourlyRepo;
// // //     private final SensorStatusRepository sensorStatusRepo;
// // //     private final HeatmapDataRepository heatmapRepo;

// // //     public AiDataIngestionController(
// // //             ZoneDataBuffer zoneDataBuffer,
// // //             AlertsEngineService alertsEngineService,
// // //             DashboardQueryService dashboardQueryService,
// // //             HeatmapDataService heatmapDataService,
// // //             RealTimeBroadcastService broadcastService,
// // //             CrowdMinuteDataRepository crowdRepo,
// // //             AlertRepository alertRepo,
// // //             HourlyDataRepository hourlyRepo,
// // //             SensorStatusRepository sensorStatusRepo,
// // //             HeatmapDataRepository heatmapRepo
// // //     ) {
// // //         this.zoneDataBuffer = zoneDataBuffer;
// // //         this.alertsEngineService = alertsEngineService;
// // //         this.dashboardQueryService = dashboardQueryService;
// // //         this.heatmapDataService = heatmapDataService;
// // //         this.broadcastService = broadcastService;
// // //         this.crowdRepo = crowdRepo;
// // //         this.alertRepo = alertRepo;
// // //         this.hourlyRepo = hourlyRepo;
// // //         this.sensorStatusRepo = sensorStatusRepo;
// // //         this.heatmapRepo = heatmapRepo;
// // //     }

// // //     /**
// // //      * AI sends processed sensor data here via WebSocket.
// // //      * Endpoint: /app/ai/sensor-data
// // //      */
// // //     @MessageMapping("/ai/sensor-data")
// // //     public void receiveFromAI(AiSensorPayload payload) {
// // //         try {
// // //             log.debug("Received AI payload for zone: {}", payload.getZone());

// // //             // Step 1: Buffer for 60s aggregation
// // //             zoneDataBuffer.add(payload);

// // //             // Step 2: Real-time alert evaluation
// // //             alertsEngineService.evaluateRealTime(
// // //                     payload.getZone(),
// // //                     payload.getIntensity(),
// // //                     payload.getAvgRSSI(),
// // //                     Instant.now(),
// // //                     alertRepo
// // //             );

// // //             // Step 3: Build live dashboard response
// // //             DashboardResponse dashboardResponse =
// // //                     dashboardQueryService.buildDashboardResponse(
// // //                             crowdRepo,
// // //                             alertRepo,
// // //                             sensorStatusRepo,
// // //                             hourlyRepo,
// // //                             Instant.now()
// // //                     );

// // //             // Step 4: Build alerts response
// // //             AlertsResponse alertsResponse =
// // //                     alertsEngineService.buildAlertsResponse(alertRepo);

// // //             // Step 5: Build heatmap response
// // //             HeatmapResponse heatmapResponse =
// // //                     heatmapDataService.getRealtimeHeatmap();

// // //             // Step 6: Build sensor status response
// // //             SensorStatusResponse sensorResponse =
// // //                     SensorStatusResponse.builder()
// // //                             .status("Operational")
// // //                             .activeSensors(2L) // camera + wifi per zone
// // //                             .entryRate(payload.getEntryRate())
// // //                             .exitRate(payload.getExitRate())
// // //                             .build();

// // //             // Step 7: Broadcast ALL events to frontend via WebSocket
// // //             broadcastService.broadcastDashboard(dashboardResponse);
// // //             broadcastService.broadcastAlerts(alertsResponse);
// // //             broadcastService.broadcastHeatmap(heatmapResponse);
// // //             broadcastService.broadcastSensorStatus(sensorResponse);

// // //         } catch (Exception e) {
// // //             log.error("Failed to process AI payload for zone: {}",
// // //                     payload.getZone(), e);
// // //         }
// // //     }
// // // }
// // package com.crowdmonitoring.dashboard.controller;

// // import com.crowdmonitoring.dashboard.model.dto.*;
// // import com.crowdmonitoring.dashboard.repository.*;
// // import com.crowdmonitoring.dashboard.service.*;
// // import com.crowdmonitoring.dashboard.websocket.RealTimeBroadcastService;

// // import org.slf4j.Logger;
// // import org.slf4j.LoggerFactory;

// // import org.springframework.messaging.handler.annotation.MessageMapping;
// // import org.springframework.web.bind.annotation.*;

// // import java.time.Instant;

// // @RestController
// // @RequestMapping("/api/ai")
// // public class AiDataIngestionController {

// //     private static final Logger log =
// //             LoggerFactory.getLogger(AiDataIngestionController.class);

// //     private final ZoneDataBuffer zoneDataBuffer;
// //     private final AlertsEngineService alertsEngineService;
// //     private final DashboardQueryService dashboardQueryService;
// //     private final HeatmapDataService heatmapDataService;
// //     private final RealTimeBroadcastService broadcastService;

// //     private final CrowdMinuteDataRepository crowdRepo;
// //     private final AlertRepository alertRepo;
// //     private final HourlyDataRepository hourlyRepo;
// //     private final SensorStatusRepository sensorStatusRepo;

// //     public AiDataIngestionController(
// //             ZoneDataBuffer zoneDataBuffer,
// //             AlertsEngineService alertsEngineService,
// //             DashboardQueryService dashboardQueryService,
// //             HeatmapDataService heatmapDataService,
// //             RealTimeBroadcastService broadcastService,
// //             CrowdMinuteDataRepository crowdRepo,
// //             AlertRepository alertRepo,
// //             HourlyDataRepository hourlyRepo,
// //             SensorStatusRepository sensorStatusRepo
// //     ) {
// //         this.zoneDataBuffer = zoneDataBuffer;
// //         this.alertsEngineService = alertsEngineService;
// //         this.dashboardQueryService = dashboardQueryService;
// //         this.heatmapDataService = heatmapDataService;
// //         this.broadcastService = broadcastService;
// //         this.crowdRepo = crowdRepo;
// //         this.alertRepo = alertRepo;
// //         this.hourlyRepo = hourlyRepo;
// //         this.sensorStatusRepo = sensorStatusRepo;
// //     }

// //     /**
// //      * ✅ MAIN ENTRY POINT (AI → Backend via HTTP)
// //      * Endpoint: POST /api/ai/data
// //      */
// //     @PostMapping("/data")
// //     public void receiveFromAIHttp(@RequestBody AiSensorPayload payload) {
// //         processPayload(payload);
// //     }

// //     /**
// //      * 🔄 OPTIONAL: WebSocket input (if needed)
// //      * Endpoint: /app/ai/sensor-data
// //      */
// //     @MessageMapping("/ai/sensor-data")
// //     public void receiveFromAIWebSocket(AiSensorPayload payload) {
// //         processPayload(payload);
// //     }

// //     /**
// //      * 🔥 CORE PROCESSING LOGIC (Reusable)
// //      */
// //     private void processPayload(AiSensorPayload payload) {
// //         try {
// //             log.info("Received AI payload for zone: {}", payload.getZone());

// //             // Step 1: Store in real-time buffer
// //             zoneDataBuffer.add(payload);

// //             // Step 2: Real-time alert evaluation
// //             alertsEngineService.evaluateRealTime(
// //                     payload.getZone(),
// //                     payload.getIntensity(),
// //                     payload.getAvgRSSI(),
// //                     Instant.now(),
// //                     alertRepo
// //             );

// //             // Step 3: Build dashboard response
// //             DashboardResponse dashboardResponse =
// //                     dashboardQueryService.buildDashboardResponse(
// //                             crowdRepo,
// //                             alertRepo,
// //                             sensorStatusRepo,
// //                             hourlyRepo,
// //                             Instant.now()
// //                     );

// //             // Step 4: Build alerts response
// //             AlertsResponse alertsResponse =
// //                     alertsEngineService.buildAlertsResponse(alertRepo);

// //             // Step 5: Build REAL-TIME heatmap
// //             HeatmapResponse heatmapResponse =
// //                     heatmapDataService.getRealtimeHeatmap();

// //             // Step 6: Build sensor status
// //             SensorStatusResponse sensorResponse =
// //                     SensorStatusResponse.builder()
// //                             .status("Operational")
// //                             .activeSensors(2L)
// //                             .entryRate(payload.getEntryRate())
// //                             .exitRate(payload.getExitRate())
// //                             .build();

// //             // Step 7: Broadcast to frontend (WebSocket)
// //             broadcastService.broadcastDashboard(dashboardResponse);
// //             broadcastService.broadcastAlerts(alertsResponse);
// //             broadcastService.broadcastHeatmap(heatmapResponse);
// //             broadcastService.broadcastSensorStatus(sensorResponse);

// //         } catch (Exception e) {
// //             log.error("Error processing AI payload for zone: {}",
// //                     payload.getZone(), e);
// //         }
// //     }
// // }
// package com.crowdmonitoring.dashboard.controller;

// import java.time.Instant;
// import java.util.List;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.http.ResponseEntity;
// import org.springframework.messaging.handler.annotation.MessageMapping;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.crowdmonitoring.dashboard.model.dto.AiSensorPayload;
// import com.crowdmonitoring.dashboard.model.dto.AlertsResponse;
// import com.crowdmonitoring.dashboard.model.dto.DashboardResponse;
// import com.crowdmonitoring.dashboard.model.dto.HeatmapResponse;
// import com.crowdmonitoring.dashboard.model.dto.SensorStatusResponse;
// import com.crowdmonitoring.dashboard.repository.AlertRepository;
// import com.crowdmonitoring.dashboard.repository.CrowdMinuteDataRepository;
// import com.crowdmonitoring.dashboard.repository.DailySummaryRepository;
// import com.crowdmonitoring.dashboard.repository.HeatmapDataRepository;
// import com.crowdmonitoring.dashboard.repository.HourlyDataRepository;
// import com.crowdmonitoring.dashboard.repository.SensorStatusRepository;
// import com.crowdmonitoring.dashboard.service.AlertsEngineService;
// import com.crowdmonitoring.dashboard.service.AnalyticsEngineService;
// import com.crowdmonitoring.dashboard.service.DashboardQueryService;
// import com.crowdmonitoring.dashboard.service.HeatmapDataService;
// import com.crowdmonitoring.dashboard.service.ZoneDataBuffer;
// import com.crowdmonitoring.dashboard.websocket.RealTimeBroadcastService;

// @RestController
// @RequestMapping("/api/ai")
// public class AiDataIngestionController {

//     private static final Logger log = LoggerFactory.getLogger(AiDataIngestionController.class);

//     private final ZoneDataBuffer zoneDataBuffer;
//     private final AlertsEngineService alertsEngineService;
//     private final AnalyticsEngineService analyticsEngineService;
//     private final DashboardQueryService dashboardQueryService;
//     private final HeatmapDataService heatmapDataService;
//     private final RealTimeBroadcastService realTimeBroadcastService;

//     private final CrowdMinuteDataRepository crowdRepo;
//     private final AlertRepository alertRepo;
//     private final HourlyDataRepository hourlyRepo;
//     private final DailySummaryRepository dailyRepo;
//     private final HeatmapDataRepository heatmapRepo;
//     private final SensorStatusRepository sensorStatusRepo;

//     public AiDataIngestionController(
//             ZoneDataBuffer zoneDataBuffer,
//             AlertsEngineService alertsEngineService,
//             AnalyticsEngineService analyticsEngineService,
//             DashboardQueryService dashboardQueryService,
//             HeatmapDataService heatmapDataService,
//             RealTimeBroadcastService realTimeBroadcastService,
//             CrowdMinuteDataRepository crowdRepo,
//             AlertRepository alertRepo,
//             HourlyDataRepository hourlyRepo,
//             DailySummaryRepository dailyRepo,
//             HeatmapDataRepository heatmapRepo,
//             SensorStatusRepository sensorStatusRepo
//     ) {
//         this.zoneDataBuffer = zoneDataBuffer;
//         this.alertsEngineService = alertsEngineService;
//         this.analyticsEngineService = analyticsEngineService;
//         this.dashboardQueryService = dashboardQueryService;
//         this.heatmapDataService = heatmapDataService;
//         this.realTimeBroadcastService = realTimeBroadcastService;
//         this.crowdRepo = crowdRepo;
//         this.alertRepo = alertRepo;
//         this.hourlyRepo = hourlyRepo;
//         this.dailyRepo = dailyRepo;
//         this.heatmapRepo = heatmapRepo;
//         this.sensorStatusRepo = sensorStatusRepo;
//     }

//     @PostMapping("/data")
//     public ResponseEntity<String> receiveFromAIHttp(@RequestBody List<AiSensorPayload> payloads) {
//         try {
//             for (AiSensorPayload payload : payloads) {
//                 processPayload(payload);
//             }
//             return ResponseEntity.ok("AI data received successfully");
//         } catch (Exception e) {
//             log.error("Error processing AI HTTP payloads", e);
//             return ResponseEntity.internalServerError().body("Failed to process AI data");
//         }
//     }

//     @MessageMapping("/ai/sensor-data")
//     public void receiveFromAI(AiSensorPayload payload) {
//         try {
//             processPayload(payload);
//         } catch (Exception e) {
//             log.error("Error processing AI WebSocket payload", e);
//         }
//     }

// //     private void processPayload(AiSensorPayload payload) {
// //         String zone = payload.getZone();
// //         long totalCrowd = payload.getTotalCrowd();
// //         double avgRSSI = payload.getAvgRSSI();

// //         String density = calculateDensity(totalCrowd);
// //         double intensity = calculateIntensity(totalCrowd);
// //         double riskScore = calculateRiskScore(totalCrowd, avgRSSI);
// //         double networkScore = calculateNetworkScore(avgRSSI);
// //         double entryRate = 0.0;
// //         double exitRate = 0.0;

// //         log.info("Received AI payload for zone: {}", zone);

// //         zoneDataBuffer.updateZone(
// //                 zone,
// //                 totalCrowd,
// //                 density,
// //                 riskScore,
// //                 avgRSSI,
// //                 intensity,
// //                 networkScore,
// //                 entryRate,
// //                 exitRate
// //         );

// //         alertsEngineService.evaluateRealTime(
// //                 zone,
// //                 totalCrowd,
// //                 avgRSSI,
// //                 Instant.now(),
// //                 alertRepo
// //         );

// //         DashboardResponse dashboardResponse =
// //                 dashboardQueryService.buildDashboardResponse(
// //                         crowdRepo,
// //                         alertRepo,
// //                         sensorStatusRepo,
// //                         hourlyRepo,
// //                         Instant.now()
// //                 );

// //         AlertsResponse alertsResponse =
// //                 alertsEngineService.buildAlertsResponse(alertRepo);

// //         HeatmapResponse heatmapResponse =
// //                 heatmapDataService.getRealtimeHeatmap();

// //         SensorStatusResponse sensorStatusResponse = SensorStatusResponse.builder()
// //                 .status("Operational")
// //                 .activeSensors(sensorStatusRepo.count())
// //                 .entryRate(entryRate)
// //                 .exitRate(exitRate)
// //                 .build();

// //         realTimeBroadcastService.broadcastDashboard(dashboardResponse);
// //         realTimeBroadcastService.broadcastAlerts(alertsResponse);
// //         realTimeBroadcastService.broadcastHeatmap(heatmapResponse);
// //         realTimeBroadcastService.broadcastSensorStatus(sensorStatusResponse);
// //     }

// //     private String calculateDensity(long totalCrowd) {
// //         if (totalCrowd < 30) return "Low";
// //         if (totalCrowd < 60) return "Medium";
// //         return "High";
// //     }
// private void processPayload(AiSensorPayload incomingPayload) {
//     if (incomingPayload == null || incomingPayload.getZone() == null || incomingPayload.getZone().isBlank()) {
//         return;
//     }

//     String zone = incomingPayload.getZone();
//     long totalCrowd = incomingPayload.getTotalCrowd();
//     double avgRSSI = incomingPayload.getAvgRSSI();

//     String density = calculateDensity(totalCrowd);
//     double intensity = calculateIntensity(totalCrowd);
//     double riskScore = calculateRiskScore(totalCrowd, avgRSSI);
//     double networkScore = calculateNetworkScore(avgRSSI);
//     double entryRate = 0.0;
//     double exitRate = 0.0;

//     AiSensorPayload normalizedPayload = AiSensorPayload.builder()
//             .zone(zone)
//             .cameraCount(incomingPayload.getCameraCount())
//             .wifiCount(incomingPayload.getWifiCount())
//             .totalCrowd(totalCrowd)
//             .avgRSSI(avgRSSI)
//             .timestamp(incomingPayload.getTimestamp())
//             .density(density)
//             .intensity(intensity)
//             .riskScore(riskScore)
//             .networkScore(networkScore)
//             .entryRate(entryRate)
//             .exitRate(exitRate)
//             .build();

//     log.info("Received AI payload for zone: {}", zone);

//     zoneDataBuffer.add(normalizedPayload);

//     alertsEngineService.evaluateRealTime(
//             zone,
//             totalCrowd,
//             avgRSSI,
//             Instant.now(),
//             alertRepo
//     );

//     DashboardResponse dashboardResponse =
//             dashboardQueryService.buildDashboardResponse(
//                     crowdRepo,
//                     alertRepo,
//                     sensorStatusRepo,
//                     hourlyRepo,
//                     Instant.now()
//             );

//     AlertsResponse alertsResponse =
//             alertsEngineService.buildAlertsResponse(alertRepo);

//     HeatmapResponse heatmapResponse =
//             heatmapDataService.getRealtimeHeatmap();

//     SensorStatusResponse sensorStatusResponse = SensorStatusResponse.builder()
//             .status("Operational")
//             .activeSensors(sensorStatusRepo.count())
//             .entryRate(entryRate)
//             .exitRate(exitRate)
//             .build();

//     realTimeBroadcastService.broadcastDashboard(dashboardResponse);
//     realTimeBroadcastService.broadcastAlerts(alertsResponse);
//     realTimeBroadcastService.broadcastHeatmap(heatmapResponse);
//     realTimeBroadcastService.broadcastSensorStatus(sensorStatusResponse);
// }

//     private double calculateIntensity(long totalCrowd) {
//         return Math.min(totalCrowd / 100.0, 1.0);
//     }

//     private double calculateRiskScore(long totalCrowd, double avgRSSI) {
//         double crowdPart = Math.min(totalCrowd, 100) * 0.7;
//         double signalPenalty = Math.max(0, (Math.abs(avgRSSI) - 40)) * 0.8;
//         return Math.min(crowdPart + signalPenalty, 100.0);
//     }

//     private double calculateNetworkScore(double avgRSSI) {
//         double score = 100 - Math.max(0, Math.abs(avgRSSI) - 40) * 1.5;
//         return Math.max(0.0, Math.min(score, 100.0));
//     }
// }
// package com.crowdmonitoring.dashboard.controller;

// import java.time.Instant;
// import java.util.List;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.http.ResponseEntity;
// import org.springframework.messaging.handler.annotation.MessageMapping;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.crowdmonitoring.dashboard.model.dto.AiSensorPayload;
// import com.crowdmonitoring.dashboard.model.dto.AlertsResponse;
// import com.crowdmonitoring.dashboard.model.dto.DashboardResponse;
// import com.crowdmonitoring.dashboard.model.dto.HeatmapResponse;
// import com.crowdmonitoring.dashboard.model.dto.SensorStatusResponse;
// import com.crowdmonitoring.dashboard.repository.AlertRepository;
// import com.crowdmonitoring.dashboard.repository.CrowdMinuteDataRepository;
// import com.crowdmonitoring.dashboard.repository.DailySummaryRepository;
// import com.crowdmonitoring.dashboard.repository.HeatmapDataRepository;
// import com.crowdmonitoring.dashboard.repository.HourlyDataRepository;
// import com.crowdmonitoring.dashboard.repository.SensorStatusRepository;
// import com.crowdmonitoring.dashboard.service.AlertsEngineService;
// import com.crowdmonitoring.dashboard.service.AnalyticsEngineService;
// import com.crowdmonitoring.dashboard.service.DashboardQueryService;
// import com.crowdmonitoring.dashboard.service.HeatmapDataService;
// import com.crowdmonitoring.dashboard.service.ZoneDataBuffer;
// import com.crowdmonitoring.dashboard.websocket.RealTimeBroadcastService;

// @RestController
// @RequestMapping("/api/ai")
// public class AiDataIngestionController {

//     private static final Logger log =
//             LoggerFactory.getLogger(AiDataIngestionController.class);

//     private final ZoneDataBuffer zoneDataBuffer;
//     private final AlertsEngineService alertsEngineService;
//     private final AnalyticsEngineService analyticsEngineService;
//     private final DashboardQueryService dashboardQueryService;
//     private final HeatmapDataService heatmapDataService;
//     private final RealTimeBroadcastService realTimeBroadcastService;

//     private final CrowdMinuteDataRepository crowdRepo;
//     private final AlertRepository alertRepo;
//     private final HourlyDataRepository hourlyRepo;
//     private final DailySummaryRepository dailyRepo;
//     private final HeatmapDataRepository heatmapRepo;
//     private final SensorStatusRepository sensorStatusRepo;

//     public AiDataIngestionController(
//             ZoneDataBuffer zoneDataBuffer,
//             AlertsEngineService alertsEngineService,
//             AnalyticsEngineService analyticsEngineService,
//             DashboardQueryService dashboardQueryService,
//             HeatmapDataService heatmapDataService,
//             RealTimeBroadcastService realTimeBroadcastService,
//             CrowdMinuteDataRepository crowdRepo,
//             AlertRepository alertRepo,
//             HourlyDataRepository hourlyRepo,
//             DailySummaryRepository dailyRepo,
//             HeatmapDataRepository heatmapRepo,
//             SensorStatusRepository sensorStatusRepo
//     ) {
//         this.zoneDataBuffer = zoneDataBuffer;
//         this.alertsEngineService = alertsEngineService;
//         this.analyticsEngineService = analyticsEngineService;
//         this.dashboardQueryService = dashboardQueryService;
//         this.heatmapDataService = heatmapDataService;
//         this.realTimeBroadcastService = realTimeBroadcastService;
//         this.crowdRepo = crowdRepo;
//         this.alertRepo = alertRepo;
//         this.hourlyRepo = hourlyRepo;
//         this.dailyRepo = dailyRepo;
//         this.heatmapRepo = heatmapRepo;
//         this.sensorStatusRepo = sensorStatusRepo;
//     }

//     /**
//      * AI -> Backend via HTTP
//      * Endpoint: POST /api/ai/data
//      */
//     @PostMapping("/data")
//     public ResponseEntity<String> receiveFromAIHttp(@RequestBody List<AiSensorPayload> payloads) {
//         try {
//             if (payloads == null || payloads.isEmpty()) {
//                 return ResponseEntity.badRequest().body("No AI payloads received");
//             }

//             for (AiSensorPayload payload : payloads) {
//                 processPayload(payload);
//             }

//             return ResponseEntity.ok("AI data received successfully");
//         } catch (Exception e) {
//             log.error("Error processing AI HTTP payloads", e);
//             return ResponseEntity.internalServerError().body("Failed to process AI data");
//         }
//     }

//     /**
//      * AI -> Backend via WebSocket
//      * Endpoint: /app/ai/sensor-data
//      */
//     @MessageMapping("/ai/sensor-data")
//     public void receiveFromAI(AiSensorPayload payload) {
//         try {
//             processPayload(payload);
//         } catch (Exception e) {
//             log.error("Error processing AI WebSocket payload", e);
//         }
//     }

//     /**
//      * Main processing logic
//      */
//     private void processPayload(AiSensorPayload incomingPayload) {
//         if (incomingPayload == null
//                 || incomingPayload.getZone() == null
//                 || incomingPayload.getZone().isBlank()) {
//             log.warn("Ignoring invalid payload");
//             return;
//         }

//         String zone = incomingPayload.getZone();
//         long totalCrowd = incomingPayload.getTotalCrowd();
//         double avgRSSI = incomingPayload.getAvgRSSI();

//         String density = calculateDensity(totalCrowd);
//         double intensity = calculateIntensity(totalCrowd);
//         double riskScore = calculateRiskScore(totalCrowd, avgRSSI);
//         double networkScore = calculateNetworkScore(avgRSSI);
//         double entryRate = 0.0;
//         double exitRate = 0.0;

//         AiSensorPayload normalizedPayload = AiSensorPayload.builder()
//                 .zone(zone)
//                 .cameraCount(incomingPayload.getCameraCount())
//                 .wifiCount(incomingPayload.getWifiCount())
//                 .totalCrowd(totalCrowd)
//                 .avgRSSI(avgRSSI)
//                 .timestamp(incomingPayload.getTimestamp())
//                 .density(density)
//                 .intensity(intensity)
//                 .riskScore(riskScore)
//                 .networkScore(networkScore)
//                 .entryRate(entryRate)
//                 .exitRate(exitRate)
//                 .build();

//         log.info("Received AI payload for zone: {}", zone);

//         // 1. Store in buffer
//         zoneDataBuffer.add(normalizedPayload);

//         // 2. Real-time alerts
//         alertsEngineService.evaluateRealTime(
//                 zone,
//                 totalCrowd,
//                 avgRSSI,
//                 Instant.now(),
//                 alertRepo
//         );

//         // 3. Build dashboard response
//         DashboardResponse dashboardResponse =
//                 dashboardQueryService.buildDashboardResponse(
//                         crowdRepo,
//                         alertRepo,
//                         sensorStatusRepo,
//                         hourlyRepo,
//                         Instant.now()
//                 );

//         // 4. Build alerts response
//         AlertsResponse alertsResponse =
//                 alertsEngineService.buildAlertsResponse(alertRepo);

//         // 5. Build realtime heatmap response
//         HeatmapResponse heatmapResponse =
//                 heatmapDataService.getRealtimeHeatmap();

//         // 6. Build sensor status response
//         SensorStatusResponse sensorStatusResponse = SensorStatusResponse.builder()
//                 .status("Operational")
//                 .activeSensors(sensorStatusRepo.count())
//                 .entryRate(entryRate)
//                 .exitRate(exitRate)
//                 .build();

//         // 7. Broadcast to frontend
//         realTimeBroadcastService.broadcastDashboard(dashboardResponse);
//         realTimeBroadcastService.broadcastAlerts(alertsResponse);
//         realTimeBroadcastService.broadcastHeatmap(heatmapResponse);
//         realTimeBroadcastService.broadcastSensorStatus(sensorStatusResponse);
//     }

//     private String calculateDensity(long totalCrowd) {
//         if (totalCrowd < 30) {
//             return "Low";
//         }
//         if (totalCrowd < 60) {
//             return "Medium";
//         }
//         return "High";
//     }

//     private double calculateIntensity(long totalCrowd) {
//         return Math.min(totalCrowd / 100.0, 1.0);
//     }

//     private double calculateRiskScore(long totalCrowd, double avgRSSI) {
//         double crowdPart = Math.min(totalCrowd, 100) * 0.7;
//         double signalPenalty = Math.max(0, (Math.abs(avgRSSI) - 40)) * 0.8;
//         return Math.min(crowdPart + signalPenalty, 100.0);
//     }

//     private double calculateNetworkScore(double avgRSSI) {
//         double score = 100 - Math.max(0, Math.abs(avgRSSI) - 40) * 1.5;
//         return Math.max(0.0, Math.min(score, 100.0));
//     }
// }
package com.crowdmonitoring.dashboard.controller;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crowdmonitoring.dashboard.model.dto.AiSensorPayload;
import com.crowdmonitoring.dashboard.model.dto.AlertsResponse;
import com.crowdmonitoring.dashboard.model.dto.DashboardResponse;
import com.crowdmonitoring.dashboard.model.dto.HeatmapResponse;
import com.crowdmonitoring.dashboard.model.dto.SensorStatusResponse;
import com.crowdmonitoring.dashboard.repository.AlertRepository;
import com.crowdmonitoring.dashboard.repository.CrowdMinuteDataRepository;
import com.crowdmonitoring.dashboard.repository.DailySummaryRepository;
import com.crowdmonitoring.dashboard.repository.HeatmapDataRepository;
import com.crowdmonitoring.dashboard.repository.HourlyDataRepository;
import com.crowdmonitoring.dashboard.repository.SensorStatusRepository;
import com.crowdmonitoring.dashboard.service.AlertsEngineService;
import com.crowdmonitoring.dashboard.service.AnalyticsEngineService;
import com.crowdmonitoring.dashboard.service.DashboardQueryService;
import com.crowdmonitoring.dashboard.service.HeatmapDataService;
import com.crowdmonitoring.dashboard.service.ZoneDataBuffer;
import com.crowdmonitoring.dashboard.websocket.RealTimeBroadcastService;

@RestController
@RequestMapping("/api/ai")
public class AiDataIngestionController {

    private static final Logger log =
            LoggerFactory.getLogger(AiDataIngestionController.class);

    private final ZoneDataBuffer zoneDataBuffer;
    private final AlertsEngineService alertsEngineService;
    private final AnalyticsEngineService analyticsEngineService;
    private final DashboardQueryService dashboardQueryService;
    private final HeatmapDataService heatmapDataService;
    private final RealTimeBroadcastService realTimeBroadcastService;

    private final CrowdMinuteDataRepository crowdRepo;
    private final AlertRepository alertRepo;
    private final HourlyDataRepository hourlyRepo;
    private final DailySummaryRepository dailyRepo;
    private final HeatmapDataRepository heatmapRepo;
    private final SensorStatusRepository sensorStatusRepo;

    public AiDataIngestionController(
            ZoneDataBuffer zoneDataBuffer,
            AlertsEngineService alertsEngineService,
            AnalyticsEngineService analyticsEngineService,
            DashboardQueryService dashboardQueryService,
            HeatmapDataService heatmapDataService,
            RealTimeBroadcastService realTimeBroadcastService,
            CrowdMinuteDataRepository crowdRepo,
            AlertRepository alertRepo,
            HourlyDataRepository hourlyRepo,
            DailySummaryRepository dailyRepo,
            HeatmapDataRepository heatmapRepo,
            SensorStatusRepository sensorStatusRepo
    ) {
        this.zoneDataBuffer = zoneDataBuffer;
        this.alertsEngineService = alertsEngineService;
        this.analyticsEngineService = analyticsEngineService;
        this.dashboardQueryService = dashboardQueryService;
        this.heatmapDataService = heatmapDataService;
        this.realTimeBroadcastService = realTimeBroadcastService;
        this.crowdRepo = crowdRepo;
        this.alertRepo = alertRepo;
        this.hourlyRepo = hourlyRepo;
        this.dailyRepo = dailyRepo;
        this.heatmapRepo = heatmapRepo;
        this.sensorStatusRepo = sensorStatusRepo;
    }

    /**
     * AI -> Backend via HTTP
     * POST /api/ai/data
     */
    @PostMapping("/data")
    public ResponseEntity<String> receiveFromAIHttp(@RequestBody List<AiSensorPayload> payloads) {
        log.info("HTTP AI payloads received: {}", payloads);

        try {
            if (payloads == null || payloads.isEmpty()) {
                log.warn("No AI payloads received in HTTP request");
                return ResponseEntity.badRequest().body("No AI payloads received");
            }

            for (AiSensorPayload payload : payloads) {
                processPayload(payload);
            }

            return ResponseEntity.ok("AI data received successfully");
        } catch (Exception e) {
            log.error("Error processing AI HTTP payloads", e);
            return ResponseEntity.internalServerError().body("Failed to process AI data");
        }
    }

    /**
     * AI -> Backend via WebSocket
     * /app/ai/sensor-data
     */
    @MessageMapping("/ai/sensor-data")
    public void receiveFromAIWebSocket(AiSensorPayload payload) {
        log.info("WebSocket AI payload received: {}", payload);

        try {
            processPayload(payload);
        } catch (Exception e) {
            log.error("Error processing AI WebSocket payload", e);
        }
    }

    /**
     * Debug endpoint:
     * Check latest data stored in memory buffer
     * GET /api/ai/debug/latest
     */
    @GetMapping("/debug/latest")
    public ResponseEntity<Map<String, AiSensorPayload>> getLatestBufferedPayloads() {
        return ResponseEntity.ok(zoneDataBuffer.getLatestPerZone());
    }

    /**
     * Debug endpoint:
     * Simple health check
     * GET /api/ai/debug/ping
     */
    @GetMapping("/debug/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("AI ingestion controller is running");
    }

    /**
     * Main processing logic
     */
    private void processPayload(AiSensorPayload incomingPayload) {
        if (incomingPayload == null
                || incomingPayload.getZone() == null
                || incomingPayload.getZone().isBlank()) {
            log.warn("Ignoring invalid payload: {}", incomingPayload);
            return;
        }

        String zone = incomingPayload.getZone();
        long totalCrowd = incomingPayload.getTotalCrowd();
        double avgRSSI = incomingPayload.getAvgRSSI();

        log.info("processPayload called with zone={}, totalCrowd={}, avgRSSI={}",
                zone, totalCrowd, avgRSSI);

        String density = calculateDensity(totalCrowd);
        double intensity = calculateIntensity(totalCrowd);
        double riskScore = calculateRiskScore(totalCrowd, avgRSSI);
        double networkScore = calculateNetworkScore(avgRSSI);
        double entryRate = 0.0;
        double exitRate = 0.0;

        AiSensorPayload normalizedPayload = AiSensorPayload.builder()
                .zone(zone)
                .cameraCount(incomingPayload.getCameraCount())
                .wifiCount(incomingPayload.getWifiCount())
                .totalCrowd(totalCrowd)
                .avgRSSI(avgRSSI)
                .timestamp(incomingPayload.getTimestamp())
                .density(density)
                .intensity(intensity)
                .riskScore(riskScore)
                .networkScore(networkScore)
                .entryRate(entryRate)
                .exitRate(exitRate)
                .build();

        log.info("Normalized payload for zone {} => {}", zone, normalizedPayload);

        // 1. Store in buffer
        zoneDataBuffer.add(normalizedPayload);
        log.info("Payload added to ZoneDataBuffer for zone={}", zone);

        // 2. Real-time alerts
        alertsEngineService.evaluateRealTime(
                zone,
                totalCrowd,
                avgRSSI,
                Instant.now(),
                alertRepo
        );

        // 3. Build dashboard response
        DashboardResponse dashboardResponse =
                dashboardQueryService.buildDashboardResponse(
                        crowdRepo,
                        alertRepo,
                        sensorStatusRepo,
                        hourlyRepo,
                        Instant.now()
                );

        // 4. Build alerts response
        AlertsResponse alertsResponse =
                alertsEngineService.buildAlertsResponse(alertRepo);

        // 5. Build realtime heatmap response
        HeatmapResponse heatmapResponse =
                heatmapDataService.getRealtimeHeatmap();

        // 6. Build sensor status response
        SensorStatusResponse sensorStatusResponse = SensorStatusResponse.builder()
                .status("Operational")
                .activeSensors(sensorStatusRepo.count())
                .entryRate(entryRate)
                .exitRate(exitRate)
                .build();

        // 7. Broadcast to frontend
        realTimeBroadcastService.broadcastDashboard(dashboardResponse);
        realTimeBroadcastService.broadcastAlerts(alertsResponse);
        realTimeBroadcastService.broadcastHeatmap(heatmapResponse);
        realTimeBroadcastService.broadcastSensorStatus(sensorStatusResponse);

        log.info("Broadcast completed for zone={}", zone);
    }

    private String calculateDensity(long totalCrowd) {
        if (totalCrowd < 30) {
            return "Low";
        }
        if (totalCrowd < 60) {
            return "Medium";
        }
        return "High";
    }

    private double calculateIntensity(long totalCrowd) {
        return Math.min(totalCrowd / 100.0, 1.0);
    }

    private double calculateRiskScore(long totalCrowd, double avgRSSI) {
        double crowdPart = Math.min(totalCrowd, 100) * 0.7;
        double signalPenalty = Math.max(0, (Math.abs(avgRSSI) - 40)) * 0.8;
        return Math.min(crowdPart + signalPenalty, 100.0);
    }

    private double calculateNetworkScore(double avgRSSI) {
        double score = 100 - Math.max(0, Math.abs(avgRSSI) - 40) * 1.5;
        return Math.max(0.0, Math.min(score, 100.0));
    }
}