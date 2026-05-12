import { Response } from 'express';
import {RepositoryNotFoundError} from "./repositiry-not-found.error";
import {HttpStatus} from "../types/http-statuses";
import {DomainError} from "./domain.error";
import {createErrorMessage} from "./create-error-message";

export const errorsHandler = (error: unknown, res: Response) => {
  console.log('ERROR: ', error)

  if (error instanceof RepositoryNotFoundError) {
    res.sendStatus(HttpStatus.NotFound_404)
    return
  }

  if (error instanceof DomainError) {
    res.status(HttpStatus.BadRequest_400).send(
      createErrorMessage([
        {
          message: error.message,
          field: error.source ?? ''
        }
      ])
    )
    return
  }

  res.sendStatus(HttpStatus.InternalServerError_500)
  return
}