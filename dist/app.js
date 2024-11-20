"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("./database/redis");
const postgres_1 = require("./database/postgres");
const swagger_1 = require("./docs/swagger");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Inicialização do Redis e Postgres
(0, redis_1.initRedis)();
(0, postgres_1.initPostgres)();
// Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Rotas
app.use('/api', routes_1.requestRoutes);
exports.default = app;
