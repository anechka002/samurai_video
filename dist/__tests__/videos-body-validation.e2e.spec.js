"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const setup_app_1 = require("../src/setup-app");
const http_statuses_1 = require("../src/core/types/http-statuses");
const video_1 = require("../src/videos/types/video");
describe('Video API body validation check', () => {
    const app = (0, express_1.default)();
    (0, setup_app_1.setupApp)(app);
    const correctCreateVideoData = {
        title: 'Feodor',
        author: 'feodor',
        availableResolutions: [video_1.availableResolutionsType.P240],
    };
    const correctUpdateVideoData = {
        title: 'Updated title',
        author: 'Updated author',
        availableResolutions: [
            video_1.availableResolutionsType.P144,
            video_1.availableResolutionsType.P720,
        ],
        canBeDownloaded: true,
        minAgeRestriction: 18,
        publicationDate: '2026-04-13T07:23:36.018Z',
    };
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .delete('/testing/all-data')
            .expect(http_statuses_1.HttpStatus.NoContent_204);
    }));
    it('should not create video when incorrect body passed; POST /videos', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidDataSet1 = yield (0, supertest_1.default)(app)
            .post('/hometask_01/api/videos')
            .send(Object.assign(Object.assign({}, correctCreateVideoData), { title: ' ', author: ' ', availableResolutions: [] }))
            .expect(http_statuses_1.HttpStatus.BadRequest_400);
        expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);
        const invalidDataSet2 = yield (0, supertest_1.default)(app)
            .post('/hometask_01/api/videos')
            .send(Object.assign(Object.assign({}, correctCreateVideoData), { title: 'A' }))
            .expect(http_statuses_1.HttpStatus.BadRequest_400);
        expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);
        const invalidDataSet3 = yield (0, supertest_1.default)(app)
            .post('/hometask_01/api/videos')
            .send(Object.assign(Object.assign({}, correctCreateVideoData), { author: 'A'.repeat(21) }))
            .expect(http_statuses_1.HttpStatus.BadRequest_400);
        expect(invalidDataSet3.body.errorsMessages).toHaveLength(1);
        const invalidDataSet4 = yield (0, supertest_1.default)(app)
            .post('/hometask_01/api/videos')
            .send(Object.assign(Object.assign({}, correctCreateVideoData), { availableResolutions: ['INVALID_RESOLUTION'] }))
            .expect(http_statuses_1.HttpStatus.BadRequest_400);
        expect(invalidDataSet4.body.errorsMessages).toHaveLength(1);
        const videosListResponse = yield (0, supertest_1.default)(app)
            .get('/hometask_01/api/videos')
            .expect(http_statuses_1.HttpStatus.Ok_200);
        expect(videosListResponse.body).toHaveLength(0);
    }));
    it('should not update video when incorrect body passed; PUT /videos/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body: { id: createdVideoId }, } = yield (0, supertest_1.default)(app)
            .post('/hometask_01/api/videos')
            .send(correctCreateVideoData)
            .expect(http_statuses_1.HttpStatus.Created_201);
        const invalidDataSet1 = yield (0, supertest_1.default)(app)
            .put(`/hometask_01/api/videos/${createdVideoId}`)
            .send(Object.assign(Object.assign({}, correctUpdateVideoData), { title: ' ', author: ' ', availableResolutions: [] }))
            .expect(http_statuses_1.HttpStatus.BadRequest_400);
        expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);
        const invalidDataSet2 = yield (0, supertest_1.default)(app)
            .put(`/hometask_01/api/videos/${createdVideoId}`)
            .send(Object.assign(Object.assign({}, correctUpdateVideoData), { canBeDownloaded: 'true', minAgeRestriction: 99, publicationDate: '' }))
            .expect(http_statuses_1.HttpStatus.BadRequest_400);
        expect(invalidDataSet2.body.errorsMessages).toHaveLength(3);
        const invalidDataSet3 = yield (0, supertest_1.default)(app)
            .put(`/hometask_01/api/videos/${createdVideoId}`)
            .send(Object.assign(Object.assign({}, correctUpdateVideoData), { availableResolutions: ['WRONG'] }))
            .expect(http_statuses_1.HttpStatus.BadRequest_400);
        expect(invalidDataSet3.body.errorsMessages).toHaveLength(1);
        const videoResponse = yield (0, supertest_1.default)(app)
            .get(`/hometask_01/api/videos/${createdVideoId}`)
            .expect(http_statuses_1.HttpStatus.Ok_200);
        expect(videoResponse.body).toEqual({
            id: createdVideoId,
            title: correctCreateVideoData.title,
            author: correctCreateVideoData.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: correctCreateVideoData.availableResolutions,
        });
    }));
    it('should not update video when id does not exist; PUT /videos/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .put('/hometask_01/api/videos/999999')
            .send(correctUpdateVideoData)
            .expect(http_statuses_1.HttpStatus.NotFound_404);
    }));
    it('should not create video when empty body passed; POST /videos', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/hometask_01/api/videos')
            .send({})
            .expect(http_statuses_1.HttpStatus.BadRequest_400);
        expect(response.body.errorsMessages).toHaveLength(3);
        expect(response.body.errorsMessages).toEqual(expect.arrayContaining([
            expect.objectContaining({ field: 'title' }),
            expect.objectContaining({ field: 'author' }),
            expect.objectContaining({ field: 'availableResolutions' }),
        ]));
    }));
    it('should not update video when empty body passed; PUT /videos/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body: { id: createdVideoId }, } = yield (0, supertest_1.default)(app)
            .post('/hometask_01/api/videos')
            .send(correctCreateVideoData)
            .expect(http_statuses_1.HttpStatus.Created_201);
        const response = yield (0, supertest_1.default)(app)
            .put(`/hometask_01/api/videos/${createdVideoId}`)
            .send({})
            .expect(http_statuses_1.HttpStatus.BadRequest_400);
        expect(response.body.errorsMessages).toHaveLength(6);
        expect(response.body.errorsMessages).toEqual(expect.arrayContaining([
            expect.objectContaining({ field: 'title' }),
            expect.objectContaining({ field: 'author' }),
            expect.objectContaining({ field: 'availableResolutions' }),
            expect.objectContaining({ field: 'canBeDownloaded' }),
            expect.objectContaining({ field: 'minAgeRestriction' }),
            expect.objectContaining({ field: 'publicationDate' }),
        ]));
    }));
});
