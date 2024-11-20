import express from 'express';
import { initRedis } from './database/redis';
import { initPostgres } from './database/postgres';
import { swaggerSpec } from './docs/swagger';
import swaggerUi from 'swagger-ui-express';
import { requestRoutes } from './routes';

const app = express();
app.use(express.json());

// Inicialização do Redis e Postgres
initRedis();
initPostgres();

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/api', requestRoutes);

export default app;
