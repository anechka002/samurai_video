import {availableResolutionsType} from "../types/video";

export type VideoViewDto = {
  id: string
  title: string
  author: string
  availableResolutions: availableResolutionsType[]
  canBeDownloaded: boolean
  minAgeRestriction: number | null
  publicationDate: string
  createdAt: string
}