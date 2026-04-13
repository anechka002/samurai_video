"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const video_router_1 = require("./videos/routers/video.router");
const testing_router_1 = require("./testing/routers/testing.router");
const setupApp = (app) => {
    app.use(express_1.default.json()); // middleware для парсинга JSON в теле запроса
    // Подключаем роутеры
    app.use('/hometask_01/api/videos', video_router_1.videosRouter);
    app.use('/testing', testing_router_1.testingRouter);
    return app;
};
exports.setupApp = setupApp;
