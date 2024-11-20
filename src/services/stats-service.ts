import redisClient from '../database/redis';
import pgClient from '../database/postgres';
import { StatsRequest } from '../entity/stats-request.entity';

const CACHE_KEY = 'request_logs';
const BATCH_SIZE = 5;

export class StatsService {
    async saveStatus(status: String, path: String) {

        try {
            const startTime = new Date();

            await redisClient.incr('totalCalls');
            if (status === 'success') {
                await redisClient.incr('totalSuccess');
            } else {
                await redisClient.incr('totalFailure');
            }

            const requestDetails = {
                path: path,
                startTime,
                finishTime: new Date(),
                result: status,
            };

            await redisClient.rPush(CACHE_KEY, JSON.stringify(requestDetails));

            const cacheLength = await redisClient.lLen(CACHE_KEY);

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

        const totalCalls = await redisClient.get('totalCalls') || '0';
        const totalSuccess = await redisClient.get('totalSuccess') || '0';
        const totalFailure = await redisClient.get('totalFailure') || '0';

        return new StatsRequest(Number(totalCalls), Number(totalSuccess), Number(totalFailure));
    }

    private async flushCacheToDatabase() {
        try {
            const cachedRequests = await redisClient.lRange('request_logs', 0, -1);
            if (cachedRequests.length === 0) return;

            const query = `
            INSERT INTO request (path, start_time, finish_time, result)
            VALUES ($1, $2, $3, $4)
          `;

            for (const request of cachedRequests) {
                const { path, startTime, finishTime, result } = JSON.parse(request);
                await pgClient.query(query, [path, new Date(startTime), new Date(finishTime), result]);
            }

            await redisClient.del('request_logs');
        } catch (error) {
            console.error('Error flushing cache to database:', error);
        }
    }
}


