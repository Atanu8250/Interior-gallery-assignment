/**
 * Purpose: Contains image domain business logic independent of Express.
 * How it is used: Called by controllers to execute use cases.
 * Continue here: Pagination rules, tag filtering, related image selection.
 */
import { Types } from "mongoose";
import { AppError } from "../../utils/AppError";
import type { FeedParams, ImageFeedQuery, RelatedImagesQuery } from "./image.types";
import { imageRepository } from "./image.repository";

function normalizeLimit(limit?: number) {
	const parsed = Number(limit ?? 12);
	if (Number.isNaN(parsed)) {
		return 12;
	}
	return Math.max(1, Math.min(parsed, 50));
}

export const imageService = {
	async getImageFeed(query: ImageFeedQuery) {
		const feedParams: FeedParams = {
			limit: normalizeLimit(query.limit),
		};

		if (query.cursor) {
			feedParams.cursor = query.cursor;
		}

		if (query.tag) {
			feedParams.tag = query.tag;
		}

		return imageRepository.findFeed(feedParams);
	},

	async getImageById(id: string) {
		if (!Types.ObjectId.isValid(id)) {
			throw new AppError(400, "Invalid image id");
		}

		const image = await imageRepository.findById(id);

		if (!image) {
			throw new AppError(404, "Image not found");
		}

		return image;
	},

	async getRelatedImages(sourceImageId: string, query: RelatedImagesQuery) {
		if (!Types.ObjectId.isValid(sourceImageId)) {
			throw new AppError(400, "Invalid image id");
		}

		const sourceImage = await imageRepository.findById(sourceImageId);
		if (!sourceImage) {
			throw new AppError(404, "Image not found");
		}

		const sourceTags = Array.isArray(sourceImage.tags) ? sourceImage.tags : [];
		const limit = normalizeLimit(query.limit);

		// Early exit if source image has no tags; no related images can be found
		if (sourceTags.length === 0) {
			return {
				images: [],
				nextCursor: undefined,
				hasMore: false,
			};
		}

		return imageRepository.findRelated({
			sourceImageId,
			tags: sourceTags,
			limit,
			...(query.cursor && { cursor: query.cursor }),
		});
	},
};

