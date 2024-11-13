import express from 'express';
import { initRedis } from './database/redis';
import { initPostgres } from './database/postgres';
import { createRequest, getStats } from './controllers/requestController';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();
app.use(express.json());

// Initializing Redis and Postgres
initRedis();
initPostgres();

// Swagger Configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Request Logging API',
    version: '1.0.0',
    description: 'API to log and retrieve statistics of processed requests.',
  },
  servers: [
    {
      url: 'http://localhost:3001',
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/controllers/*.ts'], // Ensure the path is correct
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.post('/create/:status', createRequest);
app.get('/stats/status', getStats);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});