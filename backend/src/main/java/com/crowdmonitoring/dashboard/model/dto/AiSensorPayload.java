// // package com.crowdmonitoring.dashboard.model.dto;

// // import lombok.AllArgsConstructor;
// // import lombok.Builder;
// // import lombok.Data;
// // import lombok.NoArgsConstructor;

// // /**
// //  * Payload sent by the AI layer to the backend via WebSocket.
// //  * AI has already processed raw Camera + WiFi data and computed
// //  * all metrics. Backend just receives, buffers, broadcasts, and stores.
// //  */
// // @Data
// // @NoArgsConstructor
// // @AllArgsConstructor
// // @Builder
// // public class AiSensorPayload {

// //     // Zone identifier
// //     private String zone;

// //     // Raw counts (retained for debugging/storage)
// //     private int cameraCount;
// //     private int wifiCount;
// //     private double avgRSSI;

// //     // AI-computed metrics
// //     private long totalCrowd;
// //     private String density;      // Low | Medium | High
// //     private double intensity;    // 0.0 to 1.0
// //     private double riskScore;    // 0 to 100
// //     private double networkScore; // 0 to 100
// //     private double entryRate;    // people/min
// //     private double exitRate;     // people/min
// // }
// // package com.crowdmonitoring.dashboard.model.dto;

// // import lombok.AllArgsConstructor;
// // import lombok.Builder;
// // import lombok.Data;
// // import lombok.NoArgsConstructor;

// // @Data
// // @NoArgsConstructor
// // @AllArgsConstructor
// // @Builder
// // public class AiSensorPayload {

// //     private String zone;
// //     private int cameraCount;
// //     private int wifiCount;
// //     private long totalCrowd;
// //     private double avgRSSI;
// //     private String timestamp;
// // }
// package com.crowdmonitoring.dashboard.model.dto;

// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// public class AiSensorPayload {

//     private String zone;

//     private int cameraCount;
//     private int wifiCount;
//     private long totalCrowd;
//     private double avgRSSI;
//     private String timestamp;

//     // ✅ ADD THESE (this is what your error is about)
//     private String density;
//     private double intensity;
//     private double riskScore;
//     private double networkScore;
//     private double entryRate;
//     private double exitRate;
// }
package com.crowdmonitoring.dashboard.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiSensorPayload {

    private String zone;

    private int cameraCount;
    private int wifiCount;
    private long totalCrowd;
    private double avgRSSI;
    private String timestamp;

    private String density;
    private double intensity;
    private double riskScore;
    private double networkScore;
    private double entryRate;
    private double exitRate;
}