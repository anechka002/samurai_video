import {ErrorMessage} from "../types/ValidationError";
import {availableResolutionsType} from "../types/video";

const validateTitle = (title: unknown): ErrorMessage | null => {
  if (
    typeof title !== 'string' ||
    title.trim().length < 2 ||
    title.trim().length > 40
  ) {
    return {field: 'title', message: 'Invalid title'}
  }
  return null
}
const validateAuthor = (author: unknown): ErrorMessage | null => {
  if (
    typeof author !== 'string' ||
    author.trim().length < 1 ||
    author.trim().length > 20
  ) {
    return {field: 'author', message: 'Invalid author'}
  }
  return null
}
const validateAvailableResolutions = (resolutions: unknown): ErrorMessage | null => {
  const allowedResolutions = Object.values(availableResolutionsType)

  if (!Array.isArray(resolutions)) {
    return {field: 'availableResolutions', message: 'Invalid available resolutions'}
  }

  if (resolutions.length > allowedResolutions.length || resolutions.length < 1 ) {
    return {field: 'availableResolutions', message: 'Invalid available resolutions'}
  }

  for (const el of resolutions) {
    if (!allowedResolutions.includes(el)) {
      return {field: 'availableResolutions', message: 'Invalid available ' + el}
    }
  }

  return null
}
const validateCanBeDownloaded = (canBeDownloaded: unknown): ErrorMessage | null => {
  if (typeof canBeDownloaded !== 'boolean') {
    return {field: 'canBeDownloaded', message: 'Invalid canBeDowloaded'}
  }
  return null
}
const validateMinAgeRestriction = (minAgeRestriction: unknown): ErrorMessage | null => {
  if (typeof minAgeRestriction !== 'number' || minAgeRestriction < 1 || minAgeRestriction > 18) {
    return {field: 'minAgeRestriction', message: 'Invalid minAgeRestriction ' + minAgeRestriction}
  }
  return null
}
const validatePublicationDate = (publicationDate: unknown): ErrorMessage | null => {
  if (typeof publicationDate !== 'string' || !publicationDate.trim()) {
    return {field: 'publicationDate', message: 'Invalid publicationDate ' + publicationDate}
  }
  return null
}

// validation для create/post
export const createVideoInputDtoValidation = (data: unknown): ErrorMessage[]  => {
  const errors: ErrorMessage[] = [];

  if(typeof data !== "object" || data === null) {
    return [{field: 'body', message: 'Invalid body'}]
  }

  const body = data as Record<string, unknown>;

  const titleError = validateTitle(body.title);
  if(titleError) {
    errors.push(titleError)
  }

  const authorError = validateAuthor(body.author);
  if (authorError) {
    errors.push(authorError)
  }

  const availableResolutionsError = validateAvailableResolutions(body.availableResolutions);
  if (availableResolutionsError) {
    errors.push(availableResolutionsError)
  }

  return errors
}

// validation для put
export const updateVideoInputDtoValidation = (data: unknown): ErrorMessage[]  => {
  const errors: ErrorMessage[] = [];

  if(typeof data !== "object" || data === null) {
    return [{field: 'body', message: 'Invalid body'}]
  }

  const body = data as Record<string, unknown>;

  const titleError = validateTitle(body.title);
  if(titleError) {
    errors.push(titleError)
  }

  const authorError = validateAuthor(body.author);
  if (authorError) {
    errors.push(authorError)
  }

  const availableResolutionsError = validateAvailableResolutions(body.availableResolutions);
  if (availableResolutionsError) {
    errors.push(availableResolutionsError)
  }

  const canBeDownloadedError = validateCanBeDownloaded(body.canBeDownloaded);
  if (canBeDownloadedError) {
    errors.push(canBeDownloadedError)
  }

  const minAgeRestrictionError = validateMinAgeRestriction(body.minAgeRestriction);
  if (minAgeRestrictionError) {
    errors.push(minAgeRestrictionError)
  }

  const publicationDateError = validatePublicationDate(body.publicationDate);
  if (publicationDateError) {
    errors.push(publicationDateError)
  }

  return errors
}