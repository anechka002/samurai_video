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
describe('h01 API', () => {
    const app = (0, express_1.default)();
    (0, setup_app_1.setupApp)(app);
    const validVideoData = {
        title: 'Feodor',
        author: 'feodor',
        availableResolutions: [video_1.availableResolutionsType.P144],
    };
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .delete('/testing/all-data')
            .expect(http_statuses_1.HttpStatus.NoContent_204);
    }));
    it('should return empty array; GET videos', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/hometask_01/api/videos')
            .expect(http_statuses_1.HttpStatus.Ok_200);
        expect(res.body).toEqual([]);
    }));
    it('should create video; POST videos', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/hometask_01/api/videos')
            .send(validVideoData)
            .expect(http_statuses_1.HttpStatus.Created_201);
        expect(res.body).toEqual({
            id: expect.any(Number),
            title: 'Feodor',
            author: 'feodor',
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: ['P144'],
        });
        const getRes = yield (0, supertest_1.default)(app)
            .get('/hometask_01/api/videos')
            .expect(http_statuses_1.HttpStatus.Ok_200);
        expect(getRes.body.length).toBe(1);
        expect(getRes.body[0].title).toBe('Feodor');
    }));
    it('should not create video with incorrect input data; POST videos', () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidData = {
            title: '',
            author: '',
            availableResolutions: [],
        };
        const res = yield (0, supertest_1.default)(app)
            .post('/hometask_01/api/videos')
            .send(invalidData)
            .expect(http_statuses_1.HttpStatus.BadRequest_400);
        expect(res.body.errorsMessages).toEqual([
            expect.objectContaining({ field: 'title' }),
            expect.objectContaining({ field: 'author' }),
            expect.objectContaining({ field: 'availableResolutions' }),
        ]);
        const getRes = yield (0, supertest_1.default)(app)
            .get('/hometask_01/api/videos')
            .expect(http_statuses_1.HttpStatus.Ok_200);
        expect(getRes.body).toEqual([]);
    }));
    it('should return created video by id; GET videos/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const createRes = yield (0, supertest_1.default)(app)
            .post('/hometask_01/api/videos')
            .send(validVideoData)
            .expect(http_statuses_1.HttpStatus.Created_201);
        const createdVideoId = createRes.body.id;
        const getRes = yield (0, supertest_1.default)(app)
            .get(`/hometask_01/api/videos/${createdVideoId}`)
            .expect(http_statuses_1.HttpStatus.Ok_200);
        expect(getRes.body).toEqual({
            id: createdVideoId,
            title: 'Feodor',
            author: 'feodor',
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: ['P144'],
        });
    }));
    it('should return 404 for non-existing video; GET videos/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .get('/hometask_01/api/videos/999999')
            .expect(http_statuses_1.HttpStatus.NotFound_404);
    }));
    it('should update existing video; PUT videos/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const createRes = yield (0, supertest_1.default)(app)
            .post('/hometask_01/api/videos')
            .send(validVideoData)
            .expect(http_statuses_1.HttpStatus.Created_201);
        const createdVideoId = createRes.body.id;
        const updateData = {
            title: 'Updated title',
            author: 'Updated author',
            availableResolutions: ['P144', 'P720'],
            canBeDownloaded: true,
            minAgeRestriction: 18,
            publicationDate: '2026-04-13T07:23:36.018Z',
        };
        yield (0, supertest_1.default)(app)
            .put(`/hometask_01/api/videos/${createdVideoId}`)
            .send(updateData)
            .expect(http_statuses_1.HttpStatus.NoContent_204);
        const getRes = yield (0, supertest_1.default)(app)
            .get(`/hometask_01/api/videos/${createdVideoId}`)
            .expect(http_statuses_1.HttpStatus.Ok_200);
        expect(getRes.body).toEqual({
            id: createdVideoId,
            title: 'Updated title',
            author: 'Updated author',
            canBeDownloaded: true,
            minAgeRestriction: 18,
            createdAt: expect.any(String),
            publicationDate: '2026-04-13T07:23:36.018Z',
            availableResolutions: ['P144', 'P720'],
        });
    }));
    it('should return 400 for incorrect update model; PUT videos/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const createRes = yield (0, supertest_1.default)(app)
            .post('/hometask_01/api/videos')
            .send(validVideoData)
            .expect(http_statuses_1.HttpStatus.Created_201);
        const createdVideoId = createRes.body.id;
        const invalidUpdateData = {
            title: '',
            author: '',
            availableResolutions: [],
            canBeDownloaded: 'yes',
            minAgeRestriction: 99,
            publicationDate: '',
        };
        const res = yield (0, supertest_1.default)(app)
            .put(`/hometask_01/api/videos/${createdVideoId}`)
            .send(invalidUpdateData)
            .expect(http_statuses_1.HttpStatus.BadRequest_400);
        expect(res.body.errorsMessages.length).toBeGreaterThan(0);
    }));
    it('should delete existing video; DELETE videos/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const createRes = yield (0, supertest_1.default)(app)
            .post('/hometask_01/api/videos')
            .send(validVideoData)
            .expect(http_statuses_1.HttpStatus.Created_201);
        const createdVideoId = createRes.body.id;
        yield (0, supertest_1.default)(app)
            .delete(`/hometask_01/api/videos/${createdVideoId}`)
            .expect(http_statuses_1.HttpStatus.NoContent_204);
        yield (0, supertest_1.default)(app)
            .get(`/hometask_01/api/videos/${createdVideoId}`)
            .expect(http_statuses_1.HttpStatus.NotFound_404);
    }));
    it('should return 404 when deleting non-existing video; DELETE videos/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .delete('/hometask_01/api/videos/999999')
            .expect(http_statuses_1.HttpStatus.NotFound_404);
    }));
});
