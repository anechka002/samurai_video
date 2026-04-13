import express, { Express, Request, Response } from "express";
import {videosRouter} from "./videos/routers/video.router";
import {testingRouter} from "./testing/routers/testing.router";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('hello world!!!');
  });

  // Подключаем роутеры
  app.use('/hometask_01/api/videos', videosRouter);
  app.use('/testing', testingRouter);

  return app;
};