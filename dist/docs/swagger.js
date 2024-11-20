"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
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
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
