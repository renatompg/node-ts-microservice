import { Request, Response } from 'express';
import { StatsService } from '../services/stats-service';

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

  if (status !== 'success' && status !== 'failure') {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await new StatsService().saveStatus(status, req.path);
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
export const getStatsRequest = async (req: Request, res: Response) => {
  try {
    var statsRequest = await new StatsService().getStats();

    res.status(200).json({
      statsRequest
    });
  } catch (err) {
    console.error('Error retrieving statistics:', err);
    res.status(500).json({ error: 'Error retrieving statistics' });
  }
};
