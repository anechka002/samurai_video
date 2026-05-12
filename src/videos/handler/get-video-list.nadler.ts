import { Request, Response } from 'express';
import {matchedData} from "express-validator";
import {VideoQueryInput} from "../routers/input/video-query.input";
import {videoService} from "../application/videos.service";
import {HttpStatus} from "../../core/types/http-statuses";
import {PaginationOutput} from "../../core/types/pagination.output";
import {VideoViewDto} from "../dto/videoViewDto";
import {errorsHandler} from "../../core/errors/errors.handler";

export const getVideoListHandler = async (req: Request, res: Response<PaginationOutput<VideoViewDto>>) => {
  try {
    const queryInput = matchedData<VideoQueryInput>(req, {
      locations: ["query"],
      includeOptionals: true,
    })

    const videos = await videoService.findMany(queryInput)

    res.status(HttpStatus.Ok_200).send(videos)
  } catch (error: unknown) {
    errorsHandler(error, res)
  }
}