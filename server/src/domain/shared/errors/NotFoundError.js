// src/domain/shared/errors/NotFoundError.js
export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
    this.code = "NOT_FOUND";
  }
}