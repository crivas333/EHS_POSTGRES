// src/domain/shared/errors/ValidationError.js
export class ValidationError extends Error {
  constructor(message = "Validation failed") {
    super(message);
    this.name = "ValidationError";
    this.code = "VALIDATION_ERROR";
  }
}