import redisClient from '../database/redis.js';
import pgClient from '../database/postgres.js';
export const flushCacheToDatabase = async () => {
    try {
        const cachedRequests = await redisClient.lRange('request_logs', 0, -1);
        if (cachedRequests.length === 0)
            return;
        const query = `
      INSERT INTO request (path, start_time, finish_time, result)
      VALUES ($1, $2, $3, $4)
    `;
        for (const request of cachedRequests) {
            const { path, startTime, finishTime, result } = JSON.parse(request);
            await pgClient.query(query, [path, new Date(startTime), new Date(finishTime), result]);
        }
        await redisClient.del('request_logs');
    }
    catch (error) {
        console.error('Error flushing cache to database:', error);
    }
};
