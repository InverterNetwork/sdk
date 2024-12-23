import type { StatusCodes } from './status-code'

export class HTTPError extends Error {
  statusCode: StatusCodes // Add a statusCode property
  constructor(message: string, statusCode: StatusCodes) {
    super(message) // Pass the message to the base Error class
    this.statusCode = statusCode // Assign the statusCode value
  }
}
