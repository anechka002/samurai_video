import {availableResolutionsType} from "../types/video";

export type CreateVideoDto = {
  title: string;
  author: string;
  availableResolutions: availableResolutionsType[];
};
