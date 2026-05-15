/**
 * Purpose: Encapsulates database queries for image data access.
 * How it is used: Used by services to read or write image documents.
 * Continue here: Mongoose queries, projections, indexes, and cursor filters.
 */
import { Types } from "mongoose";
import { ImageModel } from "./image.model";
import { FeedParams, RelatedParams } from "./image.types";


export const imageRepository = {
	async findFeed(params: FeedParams) {
		const { limit, cursor, tag } = params;
		const filter: Record<string, unknown> = {};

		if (tag) {
			filter.tags = tag;
		}

		// Cursor pagination: fetch documents with _id less than cursor for infinite scroll
		if (cursor && Types.ObjectId.isValid(cursor)) {
			filter._id = { $lt: new Types.ObjectId(cursor) };
		}

		const docs = await ImageModel.find(filter)
			.sort({ _id: -1 })
			.limit(limit + 1)
			.lean();

		const hasMore = docs.length > limit;
		const images = hasMore ? docs.slice(0, limit) : docs;
		const nextCursor = hasMore ? String(images[images.length - 1]?._id) : undefined;

		return { images, nextCursor, hasMore };
	},

	async findById(id: string) {
		return ImageModel.findById(id).lean();
	},

	async findRelated(params: RelatedParams) {
		const { sourceImageId, tags, limit, cursor } = params;
		const filter: Record<string, unknown> = {
			_id: { $ne: new Types.ObjectId(sourceImageId) },
			tags: { $in: tags },
		};

		// Merge pagination $lt with existing $ne filter to exclude source image AND fetch older records
		if (cursor && Types.ObjectId.isValid(cursor)) {
			// Merge pagination $lt with existing $ne filter to exclude source image AND fetch older records
			filter._id = {
				...((filter._id as Record<string, unknown>) ?? {}),
				$lt: new Types.ObjectId(cursor),
			};
		}

		const docs = await ImageModel.find(filter)
			.sort({ _id: -1 })
			.limit(limit + 1)
			.lean();

		const hasMore = docs.length > limit;
		const images = hasMore ? docs.slice(0, limit) : docs;
		const nextCursor = hasMore ? String(images[images.length - 1]?._id) : undefined;

		return { images, nextCursor, hasMore };
	},
};

