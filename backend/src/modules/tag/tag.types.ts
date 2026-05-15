/**
 * Purpose: Declares tag module TypeScript interfaces and aliases.
 * How it is used: Shared by model logic and service/repository contracts.
 * Continue here: Tag entity shape, ID aliases, and API DTO definitions.
 */
import type { Types } from "mongoose";

export type TagId = Types.ObjectId;

export type Tag = {
	_id: TagId;
	name: string;
	slug: string;
	createdAt: Date;
	updatedAt: Date;
};

export type CreateTagInput = {
	name: string;
	slug?: string; // optional: can be generated from name by service
};

export type UpdateTagInput = Partial<CreateTagInput>;

