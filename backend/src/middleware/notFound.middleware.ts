/**
 * Purpose: Handles unmatched routes and forwards a 404-style error.
 * How it is used: Placed after all API route registrations.
 * Continue here: Route miss handler and standardized not-found payload.
 *
 * Example behavior:
 *   Will forward an `AppError(404, ...)` to the centralized error handler.
 */
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const notFoundMiddleware = (req: Request, _res: Response, next: NextFunction) => {
	next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

