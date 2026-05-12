import {Router, Request, Response} from "express";
import {HttpStatus} from "../../core/types/http-statuses";
import {videoCollection} from "../../db/mongo.db";

export const testingRouter = Router({});

  testingRouter.delete('/all-data', async (_req: Request, res: Response) => {
    await Promise.all([
      videoCollection.deleteMany({})
    ])
    res.sendStatus(HttpStatus.NoContent_204);
  })