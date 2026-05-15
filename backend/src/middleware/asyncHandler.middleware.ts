/**
 * Purpose: Wraps async handlers to pass rejected promises to next().
 * How it is used: Applied around async controllers in route definitions.
 * Continue here: Generic wrapper typing for RequestHandler compatibility.
 *
 * Usage example:
 *   router.get('/', asyncHandler(async (req, res) => {
 *     const items = await service.list();
 *     res.json(items);
 *   }));
 *
 * Benefit: avoids repetitive try/catch in every async controller.
 */
import type { RequestHandler } from "express";

export const asyncHandler = (handler: RequestHandler): RequestHandler => {
	return (req, res, next) => {
		Promise.resolve(handler(req, res, next)).catch(next);
	};
};

