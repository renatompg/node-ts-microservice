"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("../../database/redis"));
const request_controller_1 = require("../request-controller");
jest.mock('../../database/redis', () => ({
    incr: jest.fn(),
    rPush: jest.fn(),
    lLen: jest.fn().mockResolvedValue(0),
    get: jest.fn(),
}));
jest.mock('../../services/cacheService');
it('should respond with status 200 for a successful request', async () => {
    const req = {
        params: { status: 'success' },
        path: '/create/success',
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    await (0, request_controller_1.createRequest)(req, res);
    expect(redis_1.default.incr).toHaveBeenCalledWith('totalCalls');
    expect(redis_1.default.rPush).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Request processed', status: 'success' });
});
it('should respond with status 400 for an invalid status', async () => {
    const req = {
        params: { status: 'invalid' },
        path: '/create/invalid',
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    await (0, request_controller_1.createRequest)(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid status' });
});
it('should return statistics with status 200', async () => {
    const req = {
        params: { status: 'success' },
        path: '/get/stats',
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    redis_1.default.get.mockResolvedValueOnce('10')
        .mockResolvedValueOnce('5')
        .mockResolvedValueOnce('5');
    await (0, request_controller_1.getStatsRequest)(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        totalCalls: 10,
        totalSuccess: 5,
        totalFailure: 5,
    });
});
