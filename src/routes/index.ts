import { Router } from 'express';
import { createRequest, getStatsRequest } from '../controllers/request-controller';

const router = Router();

// Definindo as rotas
router.post('/create/:status', createRequest);
router.get('/stats/status', getStatsRequest);

export const requestRoutes = router;
