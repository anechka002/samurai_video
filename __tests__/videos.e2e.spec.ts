import request from 'supertest';
import express from "express";
import {setupApp} from "../src/setup-app";
import {HttpStatus} from "../src/core/types/http-statuses";
import {VideoInputDto} from "../src/videos/dto/video.input-dto";
import {availableResolutionsType} from "../src/videos/types/video";

describe('h01 API', () => {
  const app = express();
  setupApp(app);

  const validVideoData: VideoInputDto = {
    title: 'Feodor',
    author: 'feodor',
    availableResolutions: [availableResolutionsType.P144],
  };

  beforeEach(async () => {
    await request(app)
      .delete('/testing/all-data')
      .expect(HttpStatus.NoContent_204);
  });

  it('should return empty array; GET videos', async () => {
    const res = await request(app)
      .get('/hometask_01/api/videos')
      .expect(HttpStatus.Ok_200);

    expect(res.body).toEqual([]);
  });

  it('should create video; POST videos', async () => {
    const res = await request(app)
      .post('/hometask_01/api/videos')
      .send(validVideoData)
      .expect(HttpStatus.Created_201);

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

    const getRes = await request(app)
      .get('/hometask_01/api/videos')
      .expect(HttpStatus.Ok_200);

    expect(getRes.body.length).toBe(1);
    expect(getRes.body[0].title).toBe('Feodor');
  });

  it('should not create video with incorrect input data; POST videos', async () => {
    const invalidData = {
      title: '',
      author: '',
      availableResolutions: [],
    };

    const res = await request(app)
      .post('/hometask_01/api/videos')
      .send(invalidData)
      .expect(HttpStatus.BadRequest_400);

    expect(res.body.errorsMessages).toEqual([
      expect.objectContaining({ field: 'title' }),
      expect.objectContaining({ field: 'author' }),
      expect.objectContaining({ field: 'availableResolutions' }),
    ]);

    const getRes = await request(app)
      .get('/hometask_01/api/videos')
      .expect(HttpStatus.Ok_200);

    expect(getRes.body).toEqual([]);
  });

  it('should return created video by id; GET videos/:id', async () => {
    const createRes = await request(app)
      .post('/hometask_01/api/videos')
      .send(validVideoData)
      .expect(HttpStatus.Created_201);

    const createdVideoId = createRes.body.id;

    const getRes = await request(app)
      .get(`/hometask_01/api/videos/${createdVideoId}`)
      .expect(HttpStatus.Ok_200);

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
  });

  it('should return 404 for non-existing video; GET videos/:id', async () => {
    await request(app)
      .get('/hometask_01/api/videos/999999')
      .expect(HttpStatus.NotFound_404);
  });

  it('should update existing video; PUT videos/:id', async () => {
    const createRes = await request(app)
      .post('/hometask_01/api/videos')
      .send(validVideoData)
      .expect(HttpStatus.Created_201);

    const createdVideoId = createRes.body.id;

    const updateData = {
      title: 'Updated title',
      author: 'Updated author',
      availableResolutions: ['P144', 'P720'],
      canBeDownloaded: true,
      minAgeRestriction: 18,
      publicationDate: '2026-04-13T07:23:36.018Z',
    };

    await request(app)
      .put(`/hometask_01/api/videos/${createdVideoId}`)
      .send(updateData)
      .expect(HttpStatus.NoContent_204);

    const getRes = await request(app)
      .get(`/hometask_01/api/videos/${createdVideoId}`)
      .expect(HttpStatus.Ok_200);

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
  });

  it('should return 400 for incorrect update model; PUT videos/:id', async () => {
    const createRes = await request(app)
      .post('/hometask_01/api/videos')
      .send(validVideoData)
      .expect(HttpStatus.Created_201);

    const createdVideoId = createRes.body.id;

    const invalidUpdateData = {
      title: '',
      author: '',
      availableResolutions: [],
      canBeDownloaded: 'yes',
      minAgeRestriction: 99,
      publicationDate: '',
    };

    const res = await request(app)
      .put(`/hometask_01/api/videos/${createdVideoId}`)
      .send(invalidUpdateData)
      .expect(HttpStatus.BadRequest_400);

    expect(res.body.errorsMessages.length).toBeGreaterThan(0);
  });

  it('should delete existing video; DELETE videos/:id', async () => {
    const createRes = await request(app)
      .post('/hometask_01/api/videos')
      .send(validVideoData)
      .expect(HttpStatus.Created_201);

    const createdVideoId = createRes.body.id;

    await request(app)
      .delete(`/hometask_01/api/videos/${createdVideoId}`)
      .expect(HttpStatus.NoContent_204);

    await request(app)
      .get(`/hometask_01/api/videos/${createdVideoId}`)
      .expect(HttpStatus.NotFound_404);
  });

  it('should return 404 when deleting non-existing video; DELETE videos/:id', async () => {
    await request(app)
      .delete('/hometask_01/api/videos/999999')
      .expect(HttpStatus.NotFound_404);
  });
});