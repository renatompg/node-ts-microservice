import { Request, Response } from 'express';
import redisClient from '../../database/redis';
import { createRequest, getStats } from '../requestController';

// Mocks for redisClient and flushCacheToDatabase
jest.mock('../../database/redis', () => ({
  incr: jest.fn(),
  rPush: jest.fn(),
  lLen: jest.fn().mockResolvedValue(0),
  get: jest.fn(),
}));
jest.mock('../../services/cacheService');

// Test for createRequest function
it('should respond with status 200 for a successful request', async () => {
  const req: Partial<Request> & { params: { status: string } } = {
    params: { status: 'success' },
    path: '/create/success',
  };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await createRequest(req as Request, res as Response);

  expect(redisClient.incr).toHaveBeenCalledWith('totalCalls');
  expect(redisClient.rPush).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: 'Request processed', status: 'success' });
});

it('should respond with status 400 for an invalid status', async () => {
  const req: Partial<Request> & { params: { status: string } } = {
    params: { status: 'invalid' },
    path: '/create/invalid',
  };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await createRequest(req as Request, res as Response);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: 'Invalid status' });
});

// Test for getStats function
it('should return statistics with status 200', async () => {
  const req: Partial<Request> & { params: { status: string } } = {
    params: { status: 'success' },
    path: '/get/stats',
  };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

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

