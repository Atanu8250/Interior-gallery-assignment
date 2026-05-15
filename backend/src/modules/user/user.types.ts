/**
 * Purpose: Holds TypeScript user-related types and data contracts.
 * How it is used: Shared between user model and dependent modules.
 * Continue here: User entity, snapshot type, and API-facing DTOs.
 */
import type { Types } from "mongoose";

export type UserId = Types.ObjectId;

export type User = {
	_id: UserId;
	name: string;
	avatar: string;
	bio: string;
	createdAt: Date;
	updatedAt: Date;
};

// Denormalized shape embedded into image documents for fast feed reads.
export type UploaderSnapshot = {
	_id: UserId;
	name: string;
	avatar: string;
};

export type CreateUserInput = {
	name: string;
	avatar?: string;
	bio?: string;
};

export type UpdateUserInput = Partial<CreateUserInput>;
