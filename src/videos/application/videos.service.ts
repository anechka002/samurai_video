import {VideoViewDto} from "../dto/videoViewDto";
import {PaginationOutput} from "../../core/types/pagination.output";
import {videoRepository} from "../repositories/video.repository";
import {mapToVideoViewModel} from "../routers/mappers/map-to-video-view-model.utils";
import {VideoQueryInput} from "../routers/input/video-query.input";

export const videoService = {
  async findMany(queryDto: VideoQueryInput): Promise<PaginationOutput<VideoViewDto>> {
    const result = await videoRepository.findMany(queryDto);

    return {
      pagesCount: Math.ceil(result.totalCount / queryDto.pageSize),
      pageSize: queryDto.pageSize,
      page: queryDto.pageNumber,
      totalCount: result.totalCount,
      items: result.items.map(mapToVideoViewModel)
    }
  }
}