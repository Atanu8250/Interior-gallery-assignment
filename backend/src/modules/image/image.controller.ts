/**
 * Purpose: Handles HTTP request and response logic for image endpoints.
 * How it is used: Invoked by route handlers after request matching.
 * Continue here: Query parsing, service calls, response shaping, and errors.
 */
import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { imageService } from "./image.service";

export const getImageFeed = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const limitRaw = req.query.limit;
		const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
		const tag = typeof req.query.tag === "string" ? req.query.tag : undefined;

		// Safely parse and clamp limit between 1 and 50 to prevent abuse or excessive DB load
		const parsedLimit =
			typeof limitRaw === "string" && !Number.isNaN(Number(limitRaw))
				? Number(limitRaw)
				: 12;

		const limit = Math.max(1, Math.min(parsedLimit, 50));

		const result = await imageService.getImageFeed({
			limit,
			...(cursor && { cursor }),
			...(tag && { tag }),
		});

		return sendSuccess(res, {
			success: true,
			message: "Image feed fetched successfully",
			data: result,
			meta: {
				limit,
				cursor: cursor ?? null,
				tag: tag ?? null,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const getImageById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id ?? "");
		if (!id) {
			throw new Error("Image ID is required");
		}

		const image = await imageService.getImageById(id);

		return sendSuccess(res, {
			success: true,
			message: "Image detail fetched successfully",
			data: {
				image,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const getRelatedImages = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id ?? "");
		if (!id) {
			throw new Error("Image ID is required");
		}

		const limitRaw = req.query.limit;
		const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;

		const parsedLimit =
			typeof limitRaw === "string" && !Number.isNaN(Number(limitRaw))
				? Number(limitRaw)
				: 12;
		const limit = Math.max(1, Math.min(parsedLimit, 50));

		const result = await imageService.getRelatedImages(id, {
			limit,
			...(cursor && { cursor }),
		});

		return sendSuccess(res, {
			success: true,
			message: "Related images fetched successfully",
			data: result,
		});
	} catch (err) {
		next(err);
	}
};
