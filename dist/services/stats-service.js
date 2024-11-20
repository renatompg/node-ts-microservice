"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const redis_1 = __importDefault(require("../database/redis"));
const postgres_1 = __importDefault(require("../database/postgres"));
const stats_request_entity_1 = require("../entity/stats-request.entity");
const CACHE_KEY = 'request_logs';
const BATCH_SIZE = 5;
class StatsService {
    async saveStatus(status, path) {
        try {
            const startTime = new Date();
            await redis_1.default.incr('totalCalls');
            if (status === 'success') {
                await redis_1.default.incr('totalSuccess');
            }
            else {
                await redis_1.default.incr('totalFailure');
            }
            const requestDetails = {
                path: path,
                startTime,
                finishTime: new Date(),
                result: status,
            };
            await redis_1.default.rPush(CACHE_KEY, JSON.stringify(requestDetails));
            const cacheLength = await redis_1.default.lLen(CACHE_KEY);
            if (cacheLength > BATCH_SIZE) {
                await this.flushCacheToDatabase();
            }
        }
        catch (err) {
            console.error('Error processing request:', err);
            throw err;
        }
    }
    async getStats() {
        const totalCalls = await redis_1.default.get('totalCalls') || '0';
        const totalSuccess = await redis_1.default.get('totalSuccess') || '0';
        const totalFailure = await redis_1.default.get('totalFailure') || '0';
        return new stats_request_entity_1.StatsRequest(Number(totalCalls), Number(totalSuccess), Number(totalFailure));
    }
    async flushCacheToDatabase() {
        try {
            const cachedRequests = await redis_1.default.lRange('request_logs', 0, -1);
            if (cachedRequests.length === 0)
                return;
            const query = `
            INSERT INTO request (path, start_time, finish_time, result)
            VALUES ($1, $2, $3, $4)
          `;
            for (const request of cachedRequests) {
                const { path, startTime, finishTime, result } = JSON.parse(request);
                await postgres_1.default.query(query, [path, new Date(startTime), new Date(finishTime), result]);
            }
            await redis_1.default.del('request_logs');
        }
        catch (error) {
            console.error('Error flushing cache to database:', error);
        }
    }
}
exports.StatsService = StatsService;
