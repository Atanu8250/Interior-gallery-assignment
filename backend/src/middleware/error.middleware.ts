/**
 * Purpose: Centralized error middleware for consistent API error responses.
 * How it is used: Registered last in the Express middleware chain.
 * Continue here: Error normalization, status mapping, and safe output format.
 *
 * Integration:
 *   // after all routes
 *   app.use(notFoundMiddleware);
 *   app.use(errorMiddleware);
 *
 * Behavior:
 *   - Maps `AppError` instances to their `statusCode` and message.
 *   - Returns a stable shape: { success, message, data, meta }.
 */
import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError";

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
	const statusCode = err instanceof AppError ? err.statusCode : 500;
	const message = err instanceof AppError ? err.message : "Internal server error";

	res.status(statusCode).json({
		success: false,
		message,
		data: null,
		meta: null,
	});
};

