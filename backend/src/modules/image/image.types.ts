/**
 * Purpose: TypeScript types for the image module.
 * How it is used: Shared between model, repository, service, and controller layers.
 */
import type { Types } from "mongoose";
import type { UploaderSnapshot } from "../user/user.types";

export type ImageId = Types.ObjectId;

export type Image = {
    _id: ImageId;
    title: string;
    description?: string;
    imageUrl: string;
    tags: string[]; // tag slugs or names
    uploaderId: Types.ObjectId;
    uploaderSnapshot: UploaderSnapshot;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateImageInput = {
    title: string;
    description?: string;
    imageUrl: string;
    tags?: string[];
    uploaderId: string | ImageId;
};

export type UpdateImageInput = Partial<CreateImageInput>;

// Query params for feed endpoint
export type ImageFeedQuery = {
    limit?: number;
    cursor?: string; // opaque cursor string
    tag?: string; // filter by tag slug/name
};

export type ImageFeedResult = {
    images: Image[];
    nextCursor?: string;
    hasMore: boolean;
};

export type FeedParams = {
	limit: number;
	cursor?: string;
	tag?: string;
};

export type RelatedParams = {
	sourceImageId: string;
	tags: string[];
	limit: number;
	cursor?: string;
};