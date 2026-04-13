import request from 'supertest';
import express from 'express';
import { setupApp } from '../src/setup-app';
import { HttpStatus } from '../src/core/types/http-statuses';
import { VideoInputDto } from '../src/videos/dto/video.input-dto';
import { availableResolutionsType } from '../src/videos/types/video';

describe('Video API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctCreateVideoData: VideoInputDto = {
    title: 'Feodor',
    author: 'feodor',
    availableResolutions: [availableResolutionsType.P240],
  };

  const correctUpdateVideoData = {
    title: 'Updated title',
    author: 'Updated author',
    availableResolutions: [
      availableResolutionsType.P144,
      availableResolutionsType.P720,
    ],
    canBeDownloaded: true,
    minAgeRestriction: 18,
    publicationDate: '2026-04-13T07:23:36.018Z',
  };

  beforeEach(async () => {
    await request(app)
      .delete('/testing/all-data')
      .expect(HttpStatus.NoContent_204);
  });

  it('should not create video when incorrect body passed; POST /videos', async () => {
    const invalidDataSet1 = await request(app)
      .post('/hometask_01/api/videos')
      .send({
        ...correctCreateVideoData,
        title: ' ',
        author: ' ',
        availableResolutions: [],
      })
      .expect(HttpStatus.BadRequest_400);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

    const invalidDataSet2 = await request(app)
      .post('/hometask_01/api/videos')
      .send({
        ...correctCreateVideoData,
        title: 'A', // too short
      })
      .expect(HttpStatus.BadRequest_400);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);

    const invalidDataSet3 = await request(app)
      .post('/hometask_01/api/videos')
      .send({
        ...correctCreateVideoData,
        author: 'A'.repeat(21), // too long
      })
      .expect(HttpStatus.BadRequest_400);

    expect(invalidDataSet3.body.errorsMessages).toHaveLength(1);

    const invalidDataSet4 = await request(app)
      .post('/hometask_01/api/videos')
      .send({
        ...correctCreateVideoData,
        availableResolutions: ['INVALID_RESOLUTION'],
      })
      .expect(HttpStatus.BadRequest_400);

    expect(invalidDataSet4.body.errorsMessages).toHaveLength(1);

    const videosListResponse = await request(app)
      .get('/hometask_01/api/videos')
      .expect(HttpStatus.Ok_200);

    expect(videosListResponse.body).toHaveLength(0);
  });

  it('should not update video when incorrect body passed; PUT /videos/:id', async () => {
    const {
      body: { id: createdVideoId },
    } = await request(app)
      .post('/hometask_01/api/videos')
      .send(correctCreateVideoData)
      .expect(HttpStatus.Created_201);

    const invalidDataSet1 = await request(app)
      .put(`/hometask_01/api/videos/${createdVideoId}`)
      .send({
        ...correctUpdateVideoData,
        title: ' ',
        author: ' ',
        availableResolutions: [],
      })
      .expect(HttpStatus.BadRequest_400);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

    const invalidDataSet2 = await request(app)
      .put(`/hometask_01/api/videos/${createdVideoId}`)
      .send({
        ...correctUpdateVideoData,
        canBeDownloaded: 'true',
        minAgeRestriction: 99,
        publicationDate: '',
      })
      .expect(HttpStatus.BadRequest_400);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(3);

    const invalidDataSet3 = await request(app)
      .put(`/hometask_01/api/videos/${createdVideoId}`)
      .send({
        ...correctUpdateVideoData,
        availableResolutions: ['WRONG'],
      })
      .expect(HttpStatus.BadRequest_400);

    expect(invalidDataSet3.body.errorsMessages).toHaveLength(1);

    const videoResponse = await request(app)
      .get(`/hometask_01/api/videos/${createdVideoId}`)
      .expect(HttpStatus.Ok_200);

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
  });

  it('should not update video when id does not exist; PUT /videos/:id', async () => {
    await request(app)
      .put('/hometask_01/api/videos/999999')
      .send(correctUpdateVideoData)
      .expect(HttpStatus.NotFound_404);
  });

  it('should not create video when empty body passed; POST /videos', async () => {
    const response = await request(app)
      .post('/hometask_01/api/videos')
      .send({})
      .expect(HttpStatus.BadRequest_400);

    expect(response.body.errorsMessages).toHaveLength(3);
    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'title' }),
        expect.objectContaining({ field: 'author' }),
        expect.objectContaining({ field: 'availableResolutions' }),
      ])
    );
  });

  it('should not update video when empty body passed; PUT /videos/:id', async () => {
    const {
      body: { id: createdVideoId },
    } = await request(app)
      .post('/hometask_01/api/videos')
      .send(correctCreateVideoData)
      .expect(HttpStatus.Created_201);

    const response = await request(app)
      .put(`/hometask_01/api/videos/${createdVideoId}`)
      .send({})
      .expect(HttpStatus.BadRequest_400);

    expect(response.body.errorsMessages).toHaveLength(6);
    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'title' }),
        expect.objectContaining({ field: 'author' }),
        expect.objectContaining({ field: 'availableResolutions' }),
        expect.objectContaining({ field: 'canBeDownloaded' }),
        expect.objectContaining({ field: 'minAgeRestriction' }),
        expect.objectContaining({ field: 'publicationDate' }),
      ])
    );
  });
});