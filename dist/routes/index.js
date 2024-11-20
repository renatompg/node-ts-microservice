"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestRoutes = void 0;
const express_1 = require("express");
const request_controller_1 = require("../controllers/request-controller");
const router = (0, express_1.Router)();
// Definindo as rotas
router.post('/create/:status', request_controller_1.createRequest);
router.get('/stats/status', request_controller_1.getStatsRequest);
exports.requestRoutes = router;
