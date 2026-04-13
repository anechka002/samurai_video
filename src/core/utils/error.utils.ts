import {ErrorMessage} from "../../videos/types/ValidationError";

export const createErrorMessage = (errors: ErrorMessage[]): {errorsMessages: ErrorMessage[]} => {
  return {errorsMessages: errors};
}