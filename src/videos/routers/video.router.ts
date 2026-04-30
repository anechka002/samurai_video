import {Response, Request, Router} from "express";
import {HttpStatus} from "../../core/types/http-statuses";
import {videoInputDtoValidation} from "../validation/videoValidation";
import {createErrorMessage} from "../../core/utils/error.utils";
import {Video} from "../types/video";
import {videoCollection} from "../../db/mongo.db";
import {videoRepository} from "../repositories/video.repository";
import {mapToVideoViewModel} from "./mappers/map-to-video-view-model.utils";
import {
  inputValidationResultMiddleware
} from "../../core/middlewares/validation/input-validation-result.middleware";

export const videosRouter = Router({});

videosRouter
  .get('/', async (req: Request<{ title: string }>, res: Response) => {
    const title = req.query.title as string;
    const promise = await videoRepository.findAll(title)
    res.status(HttpStatus.Ok_200).send(promise);
  })

  .get('/:id', inputValidationResultMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    const foundVideo = await videoRepository.findOne(req.params.id)
    if (!foundVideo) {
      res.status(404).send({ message: "Video not found" });
      return;
    }
    res.status(HttpStatus.Ok_200).json(foundVideo);
  })

  .post('/', videoInputDtoValidation, inputValidationResultMiddleware, async (req: Request, res: Response) => {

    const createdAtDate = new Date();
    const createdAt = createdAtDate.toISOString()
    const publicationDate = new Date(createdAtDate.getTime() + 24 * 60 * 60 * 1000).toISOString()

    const newVideo: Video = {
      title: req.body.title.trim(),
      author: req.body.author.trim(),
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt,
      publicationDate,
      availableResolutions: req.body.availableResolutions ?? [],
    }

    const createdVideo = await videoRepository.create(newVideo);
    if (!createdVideo) {
      res.sendStatus(HttpStatus.InternalServerError_500)
      return;
    }

    const videoViewModel = mapToVideoViewModel(createdVideo);

    res.status(HttpStatus.Created_201).json(videoViewModel);
  })

  .delete('/:id', inputValidationResultMiddleware, async (req: Request<{ id: string }>, res: Response) => {
    const isDeleted = videoRepository.delete(req.params.id);
    if (!isDeleted) {
      res.status(HttpStatus.NotFound_404).send({ message: "Video not found" });
      return;
    }

    res.sendStatus(HttpStatus.NoContent_204);
  })

  .put('/:id', videoInputDtoValidation, inputValidationResultMiddleware, async (req: Request<{ id: string }>, res: Response) => {

    const isUpdated = await videoRepository.update(req.params.id, req.body);

    if (!isUpdated) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }

    res.sendStatus(HttpStatus.NoContent_204);
})