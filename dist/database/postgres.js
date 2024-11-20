"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPostgres = void 0;
const pg_1 = __importDefault(require("pg"));
const { Client } = pg_1.default;
const pgClient = new Client({
    host: 'postgres',
    port: 5432,
    user: 'user',
    password: 'password',
    database: 'microservice',
});
const initPostgres = async () => {
    try {
        await pgClient.connect();
        console.log('Successfully connected to PostgreSQL');
    }
    catch (err) {
        console.error('Error connecting to PostgreSQL:', err);
        process.exit(1);
    }
};
exports.initPostgres = initPostgres;
exports.default = pgClient;
