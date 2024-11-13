import { Request, Response } from 'express';
import redisClient from '../database/redis';
import { flushCacheToDatabase } from '../services/cacheService';

const CACHE_KEY = 'request_logs';
const BATCH_SIZE = 5;

/**
 * @swagger
 * /create/{status}:
 *   post:
 *     summary: Creates a request and logs the status (success or failure).
 *     description: Logs the request details and stores them in Redis.
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [success, failure]
 *         description: The request status (success or failure).
 *     responses:
 *       200:
 *         description: Request processed successfully
 *       400:
 *         description: Invalid status
 *       500:
 *         description: Internal server error
 */
export const createRequest = async (req: Request, res: Response) => {
  const { status } = req.params;
  const startTime = new Date();

  if (status !== 'success' && status !== 'failure') {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await redisClient.incr('totalCalls');
    if (status === 'success') {
      await redisClient.incr('totalSuccess');
    } else {
      await redisClient.incr('totalFailure');
    }

    const requestDetails = {
      path: req.path,
      startTime,
      finishTime: new Date(),
      result: status,
    };

    await redisClient.rPush(CACHE_KEY, JSON.stringify(requestDetails));

    const cacheLength = await redisClient.lLen(CACHE_KEY);

    if (cacheLength > BATCH_SIZE) {
      await flushCacheToDatabase();
    }

    res.status(200).json({ message: 'Request processed', status });
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * @swagger
 * /stats/status:
 *   get:
 *     summary: Returns the statistics of processed calls.
 *     description: Retrieves the statistics for total, successful, and failed calls.
 *     responses:
 *       200:
 *         description: Statistics of processed requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCalls:
 *                   type: integer
 *                   example: 100
 *                 totalSuccess:
 *                   type: integer
 *                   example: 80
 *                 totalFailure:
 *                   type: integer
 *                   example: 20
 *       500:
 *         description: Error retrieving statistics
 */
export const getStats = async (req: Request, res: Response) => {
  try {
    const totalCalls = await redisClient.get('totalCalls') || '0';
    const totalSuccess = await redisClient.get('totalSuccess') || '0';
    const totalFailure = await redisClient.get('totalFailure') || '0';

    res.status(200).json({
      totalCalls: parseInt(totalCalls),
      totalSuccess: parseInt(totalSuccess),
      totalFailure: parseInt(totalFailure),
    });
  } catch (err) {
    console.error('Error retrieving statistics:', err);
    res.status(500).json({ error: 'Error retrieving statistics' });
  }
};
