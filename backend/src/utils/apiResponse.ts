/**
 * Purpose: Provides helpers for consistent success response formatting.
 * How it is used: Used by controllers to return standard API structure.
 * Continue here: Success builders, meta helpers, and typed response shape.
 *
 * Usage example:
 *   import { sendSuccess } from '../utils/apiResponse';
 *   sendSuccess(res, { success: true, message: 'OK', data: payload, meta: { hasMore } });
 *
 * Note: Keeping a single helper avoids inconsistent shapes across controllers.
 */
import type { Response } from "express";

type ApiResponseData<T> = {
	success: true;
	message: string;
	data: T;
	meta?: Record<string, unknown>;
};

export function sendSuccess<T>(res: Response, payload: ApiResponseData<T>) {
	return res.status(200).json(payload);
}

