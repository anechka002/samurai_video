import {WithId} from "mongodb";
import {Video} from "../../types/video";
import {VideoViewDto} from "../../dto/videoViewDto";

export const mapToVideoViewModel = (video: WithId<Video>): VideoViewDto => {
  return {
    id: video._id.toString(),
    title: video.title,
    author: video.author.trim(),
    availableResolutions: video.availableResolutions,
    canBeDownloaded: video.canBeDownloaded,
    minAgeRestriction: video.minAgeRestriction,
    publicationDate: video.publicationDate,
    createdAt: video.createdAt,
  }
}