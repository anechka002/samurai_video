export type ValidationErrorType = {
  field: string;
  message: string;
}

export type ValidationErrorListOutput = { errorsMessages: ValidationErrorType[] }
