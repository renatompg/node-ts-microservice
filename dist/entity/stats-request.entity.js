"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRequest = void 0;
class StatsRequest {
    constructor(totalCalls, totalSuccess, totalFailure) {
        this.totalCalls = Number(totalCalls); // Ensure numbers are parsed correctly
        this.totalSuccess = Number(totalSuccess);
        this.totalFailure = Number(totalFailure);
    }
    /**
     * Factory method to create a `StatsRequest` instance from raw data.
     * @param data Object containing raw stats
     */
    static fromJson(data) {
        return new StatsRequest(parseInt(data.totalCalls, 10), parseInt(data.totalSuccess, 10), parseInt(data.totalFailure, 10));
    }
    /**
     * Converts the `StatsRequest` instance to a plain object (e.g., for JSON serialization).
     * @returns Plain object with the stats data
     */
    toJson() {
        return {
            totalCalls: this.totalCalls,
            totalSuccess: this.totalSuccess,
            totalFailure: this.totalFailure,
        };
    }
}
exports.StatsRequest = StatsRequest;
