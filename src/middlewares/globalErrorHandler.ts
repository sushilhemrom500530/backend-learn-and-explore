import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";
import { IErrorResponse } from "./../interface/index";
import { logger } from "../logger/logger";


const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let errorResponse: IErrorResponse = {
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
    errorMessages: [
      {
        path: "",
        message: "Something went wrong",
      },
    ],
  };

  // ===============================
  //        ZOD VALIDATION ERROR
  // ===============================
  if (err instanceof ZodError) {
    errorResponse = handleZodError(err);
  }

  // ===============================
  //     MONGOOSE VALIDATION ERROR
  // ===============================
  else if (err instanceof mongoose.Error.ValidationError) {
    errorResponse = handleValidationError(err);
  }

  // ===============================
  //        MONGOOSE CAST ERROR
  // ===============================
  else if (err instanceof mongoose.Error.CastError) {
    errorResponse = handleCastError(err);
  }

  // ===============================
  //      DUPLICATE KEY ERROR
  // ===============================
  else if (err?.code === 11000) {
    errorResponse = handleDuplicateError(err);
  }

  // ===============================
  //         CUSTOM APP ERROR
  // ===============================
  else if (err instanceof AppError) {
    errorResponse = {
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errorMessages: [
        {
          path: "",
          message: err.message,
        },
      ],
    };
  }

  // ===============================
  //       GENERIC JS ERROR
  // ===============================
  else if (err instanceof Error) {
    errorResponse = {
      success: false,
      statusCode: 500,
      message: err.message,
      errorMessages: [
        {
          path: "",
          message: err.message,
        },
      ],
    };
  }

  // ===============================
  //           LOGGING
  // ===============================
  logger.error({
    name: err?.name,
    message: err?.message,
    statusCode: errorResponse.statusCode,
    path: req.originalUrl,
    method: req.method,
    stack: err?.stack,
  }, "❌ Global Error Handler");

  return res.status(errorResponse.statusCode).json(errorResponse);
};

export default globalErrorHandler;

