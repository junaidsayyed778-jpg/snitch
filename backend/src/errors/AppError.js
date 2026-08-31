class AppError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;3

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
