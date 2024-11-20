"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRedis = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: 'redis://redis:6379',
});
const initRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Successfully connected to Redis');
    }
    catch (err) {
        console.error('Error connecting to Redis:', err);
        process.exit(1); // Exits the process if the connection fails
    }
};
exports.initRedis = initRedis;
exports.default = redisClient;
