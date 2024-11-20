import swaggerJSDoc from 'swagger-jsdoc';

// Definição do Swagger
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

// Opções do Swagger
const options = {
  definition: swaggerDefinition,
  apis: ['./src/controllers/*.ts'], 
};

export const swaggerSpec = swaggerJSDoc(options);
