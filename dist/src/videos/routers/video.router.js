"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const http_statuses_1 = require("../../core/types/http-statuses");
const in_memory_db_1 = require("../../db/in-memory.db");
const videoValidation_1 = require("../validation/videoValidation");
const error_utils_1 = require("../../core/utils/error.utils");
exports.videosRouter = (0, express_1.Router)({});
exports.videosRouter
    .get('/', (_req, res) => {
    res.status(http_statuses_1.HttpStatus.Ok_200).send(in_memory_db_1.db.mockVideos);
})
    .get('/:id', (req, res) => {
    const foundVideo = in_memory_db_1.db.mockVideos.find((d) => d.id === +req.params.id);
    if (!foundVideo) {
        res.status(404).send({ message: "Video not found" });
        return;
    }
    res.status(http_statuses_1.HttpStatus.Ok_200).json(foundVideo);
})
    .post('/', (req, res) => {
    var _a;
    const errors = (0, videoValidation_1.createVideoInputDtoValidation)(req.body);
    if (errors.length > 0) {
        res.status(http_statuses_1.HttpStatus.BadRequest_400).send((0, error_utils_1.createErrorMessage)(errors));
        return;
    }
    const createdAtDate = new Date();
    const createdAt = createdAtDate.toISOString();
    const publicationDate = new Date(createdAtDate.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const newVideo = {
        id: +(new Date()),
        title: req.body.title.trim(),
        author: req.body.author.trim(),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt,
        publicationDate,
        availableResolutions: (_a = req.body.availableResolutions) !== null && _a !== void 0 ? _a : [],
    };
    in_memory_db_1.db.mockVideos.push(newVideo);
    res.status(http_statuses_1.HttpStatus.Created_201).json(newVideo);
})
    .delete('/:id', (req, res) => {
    const videoIndex = in_memory_db_1.db.mockVideos.findIndex((d) => d.id === +req.params.id);
    if (videoIndex === -1) {
        res.status(404).send({ message: "Video not found" });
        return;
    }
    in_memory_db_1.db.mockVideos = in_memory_db_1.db.mockVideos.filter((d) => d.id !== +req.params.id);
    res.sendStatus(http_statuses_1.HttpStatus.NoContent_204);
})
    .put('/:id', (req, res) => {
    const foundVideo = in_memory_db_1.db.mockVideos.find((d) => d.id === +req.params.id);
    if (!foundVideo) {
        res.sendStatus(http_statuses_1.HttpStatus.NotFound_404);
        return;
    }
    const errors = (0, videoValidation_1.updateVideoInputDtoValidation)(req.body);
    if (errors.length > 0) {
        res.status(http_statuses_1.HttpStatus.BadRequest_400).send((0, error_utils_1.createErrorMessage)(errors));
        return;
    }
    foundVideo.title = req.body.title.trim();
    foundVideo.author = req.body.author.trim();
    foundVideo.availableResolutions = req.body.availableResolutions;
    foundVideo.canBeDownloaded = req.body.canBeDownloaded;
    foundVideo.minAgeRestriction = req.body.minAgeRestriction;
    foundVideo.publicationDate = req.body.publicationDate;
    res.sendStatus(http_statuses_1.HttpStatus.NoContent_204);
});
