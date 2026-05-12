import {
  ValidationErrorListOutput,
  ValidationErrorType
} from "../types/validation-errors.ts";

export const createErrorMessage = (errors: ValidationErrorType[]): ValidationErrorListOutput => {
  return {
    errorsMessages: errors
  }
}