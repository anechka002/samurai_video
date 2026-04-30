import express from "express";
import { setupApp } from "./setup-app";
import {runDB} from "./db/mongo.db";
import {SETTINGS} from "./core/settings/settings";

const startApp = async () => {
  const app = express();
  setupApp(app);
  const PORT = SETTINGS.PORT;

  await runDB(SETTINGS.MONGO_URL);

  app.listen(PORT, () => {
    console.log(`Я завелся на ${PORT} порту`);
  });
  return app;
};

startApp();
