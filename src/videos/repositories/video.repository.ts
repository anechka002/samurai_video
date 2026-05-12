import {Video} from "../types/video";
import {ObjectId, WithId} from "mongodb";
import {videoCollection} from "../../db/mongo.db";
import {CreateVideoDto} from "../dto/create-video-dto";
import {VideoQueryInput} from "../routers/input/video-query.input";

export const videoRepository = {
  async findAll(title: string | null | undefined): Promise<WithId<Video>[]> {
    if (title) {
      return videoCollection.find({title: {$regex: title, $options: 'i'}}).toArray();
    } else {
      return videoCollection.find({}).toArray();
    }
  },

  async findMany(queryDto: VideoQueryInput): Promise<{items: WithId<Video>[], totalCount: number}> {
    const { pageSize, pageNumber, sortBy, sortDirection} = queryDto;

    const filter = {}
    const skip = (pageNumber - 1) * pageSize;
    const sort = {
      [sortBy]: sortDirection,
      ...(sortBy !== 'createdAt' ? { createdAt: sortDirection } : {}),
    }

    const items = await videoCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await videoCollection.countDocuments(filter)

    return {items, totalCount}
  },

  async findOne(id: string): Promise<WithId<Video> | null> {
    return videoCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(video: Video): Promise<WithId<Video> | null> {
    const insertResult = await videoCollection.insertOne(video);
    return await videoCollection.findOne({ _id: insertResult.insertedId });
  },

  async update(id: string, video: CreateVideoDto): Promise<boolean> {
    const updateResult = await videoCollection.updateOne(
      {
        _id: new ObjectId(id)
      },
      {
        $set: {
          title: video.title.trim(),
          author: video.author.trim(),
          availableResolutions: video.availableResolutions,
        }
      }
    )

    return updateResult.matchedCount === 1
  },

  async delete(id: string): Promise<boolean> {
    const deleteResult = await videoCollection.deleteOne({ _id: new ObjectId(id) });
    return deleteResult.deletedCount === 1
  }
}