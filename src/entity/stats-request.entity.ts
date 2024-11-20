export class StatsRequest {
    totalCalls: number;
    totalSuccess: number;
    totalFailure: number;

    constructor(totalCalls: number, totalSuccess: number, totalFailure: number) {
        this.totalCalls = Number(totalCalls); // Ensure numbers are parsed correctly
        this.totalSuccess = Number(totalSuccess);
        this.totalFailure = Number(totalFailure);
    }

    /**
     * Factory method to create a `StatsRequest` instance from raw data.
     * @param data Object containing raw stats
     */
    static fromJson(data: any): StatsRequest {
        return new StatsRequest(
            parseInt(data.totalCalls, 10),
            parseInt(data.totalSuccess, 10),
            parseInt(data.totalFailure, 10)
        );
    }

    /**
     * Converts the `StatsRequest` instance to a plain object (e.g., for JSON serialization).
     * @returns Plain object with the stats data
     */
    toJson(): Record<string, number> {
        return {
            totalCalls: this.totalCalls,
            totalSuccess: this.totalSuccess,
            totalFailure: this.totalFailure,
        };
    }
}
