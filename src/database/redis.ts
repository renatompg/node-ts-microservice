import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://redis:6379',
});

export const initRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Successfully connected to Redis');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
    process.exit(1); // Exits the process if the connection fails
  }
};

export default redisClient;
