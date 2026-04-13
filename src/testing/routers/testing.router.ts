import {Router, Request, Response} from "express";
import {HttpStatus} from "../../core/types/http-statuses";
import {db} from "../../db/in-memory.db";

export const testingRouter = Router({});
  testingRouter.delete('/all-data', (_req: Request, res: Response) => {
    db.mockVideos = [];
    res.sendStatus(HttpStatus.NoContent_204);
  })