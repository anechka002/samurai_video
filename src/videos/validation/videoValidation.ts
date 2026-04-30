import { body } from 'express-validator';
import {availableResolutionsType} from "../types/video";

const titleValidation = body('title')
  .isString()
  .withMessage('Title must be a string')
  .trim()
  .isLength({ min: 1, max: 40 })
  .withMessage('Length of title is not correct');

const authorValidation = body('author')
  .isString()
  .withMessage('Author must be a string')
  .trim()
  .isLength({ min: 1, max: 20 })
  .withMessage('Length of author is not correct');

const availableResolutionsValidation = body('availableResolutions')
  .optional()
  .isArray()
  .withMessage('AvailableResolutions must be an array')
  .custom((resolutions: Array<availableResolutionsType>) => {
    if (resolutions.length) {
      const validResolutions = Object.values(availableResolutionsType)

      resolutions.forEach((resolution) => {
        if (!validResolutions.includes(resolution)) {
          throw new Error(
            'availableResolutions should contain values of availableResolutionsType'
          )
        }
      })
    }
    return true
  })
  .withMessage('AvailableResolutions is not correct');

export const videoInputDtoValidation = [
  titleValidation,
  authorValidation,
  availableResolutionsValidation,
];