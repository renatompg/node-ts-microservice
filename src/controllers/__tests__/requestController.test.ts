// src/controllers/__tests__/requestController.test.ts
import { Request, Response } from 'express';
import redisClient from '../../database/redis';
import { createRequest, getStats } from '../requestController';
import { flushCacheToDatabase } from '../../services/cacheService';

// Mocks for redisClient and flushCacheToDatabase
jest.mock('../../database/redis', () => ({
  incr: jest.fn(),
  rPush: jest.fn(),
  lLen: jest.fn().mockResolvedValue(0),
  get: jest.fn(),
}));
jest.mock('../../services/cacheService');

describe('Request Controller', () => {
  let req: Partial<Request> & { params: { status: string } };
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: { status: 'success' },
      path: '/create/success',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createRequest', () => {
    it('should respond with status 200 for a successful request', async () => {
      await createRequest(req as Request, res as Response);

      expect(redisClient.incr).toHaveBeenCalledWith('totalCalls');
      expect(redisClient.rPush).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Request processed', status: 'success' });
    });

    it('should respond with status 400 for an invalid status', async () => {
      req.params.status = 'invalid';

      await createRequest(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid status' });
    });

    it('should respond with status 500 in case of an error', async () => {
      (redisClient.incr as jest.Mock).mockRejectedValue(new Error('Redis error'));

      await createRequest(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('getStats', () => {
    it('should return statistics with status 200', async () => {
      (redisClient.get as jest.Mock).mockResolvedValueOnce('10')
        .mockResolvedValueOnce('5')
        .mockResolvedValueOnce('5');

      await getStats(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        totalCalls: 10,
        totalSuccess: 5,
        totalFailure: 5,
      });
    });

    it('should return status 500 in case of an error', async () => {
      (redisClient.get as jest.Mock).mockRejectedValue(new Error('Redis error'));

      await getStats(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error retrieving statistics' });
    });
  });
});
