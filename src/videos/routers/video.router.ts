import {Response, Request, Router} from "express";
import {HttpStatus} from "../../core/types/http-statuses";
import {db} from "../../db/in-memory.db";
import {
  createVideoInputDtoValidation,
  updateVideoInputDtoValidation
} from "../validation/videoValidation";
import {createErrorMessage} from "../../core/utils/error.utils";
import {Video} from "../types/video";

export const videosRouter = Router({});

videosRouter
  .get('/', (_req, res: Response) => {
    res.status(HttpStatus.Ok_200).send(db.mockVideos);
  })

  .get('/:id', (req: Request, res: Response) => {
    const foundVideo = db.mockVideos.find((d) => d.id === +req.params.id);
    if (!foundVideo) {
      res.status(404).send({ message: "Video not found" });
      return;
    }
    res.status(HttpStatus.Ok_200).json(foundVideo);
  })

  .post('/', (req: Request, res: Response) => {
    const errors = createVideoInputDtoValidation(req.body);

    if(errors.length > 0) {
      res.status(HttpStatus.BadRequest_400).send(createErrorMessage(errors));
      return;
    }

    const createdAtDate = new Date();
    const createdAt = createdAtDate.toISOString()
    const publicationDate = new Date(createdAtDate.getTime() + 24 * 60 * 60 * 1000).toISOString()

    const newVideo: Video = {
      id: +(new Date()),
      title: req.body.title.trim(),
      author: req.body.author.trim(),
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt,
      publicationDate,
      availableResolutions: req.body.availableResolutions ?? [],
    }
    db.mockVideos.push(newVideo);

    res.status(HttpStatus.Created_201).json(newVideo);
  })

  .delete('/:id', (req: Request, res: Response) => {
    const videoIndex = db.mockVideos.findIndex((d) => d.id === +req.params.id);
    if (videoIndex === -1) {
      res.status(404).send({ message: "Video not found" });
      return;
    }

    db.mockVideos = db.mockVideos.filter((d) => d.id !== +req.params.id);

    res.sendStatus(HttpStatus.NoContent_204);
  })

  .put('/:id', (req: Request, res: Response) => {
  const foundVideo = db.mockVideos.find((d) => d.id === +req.params.id);

  if (!foundVideo) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }

  const errors = updateVideoInputDtoValidation(req.body);
  if(errors.length > 0) {
    res.status(HttpStatus.BadRequest_400).send(createErrorMessage(errors));
    return;
  }

  foundVideo.title = req.body.title.trim();
  foundVideo.author = req.body.author.trim();
  foundVideo.availableResolutions = req.body.availableResolutions;
  foundVideo.canBeDownloaded = req.body.canBeDownloaded;
  foundVideo.minAgeRestriction = req.body.minAgeRestriction;
  foundVideo.publicationDate = req.body.publicationDate;

  res.sendStatus(HttpStatus.NoContent_204);
})