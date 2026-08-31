export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  //MongoDB duplicate key error
  if (err.code && err.code === 11000) {
    statusCode = 400;

    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
  }

  //Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found. Invalid: ${err.path}`;
  }

  //JWT expired
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired";
  }

  //JWT invalid
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  //unknown error
  if (statusCode === 500) {
    message = "Internal Server Error";
  }

  const response = {
    success: false,
    message,
    statusCode,
  };
  if (err.errors) {
    response.errors = err.errors;
  }

  res.status(statusCode).json(response);
};
