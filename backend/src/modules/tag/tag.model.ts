/**
 * Purpose: Defines the Mongoose schema and model for tags collection.
 * How it is used: Used for tag lookups and image-tag relationships.
 * Continue here: Tag schema, slug uniqueness, and indexing strategy.
 */
import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Tag name is required"],
			trim: true,
			maxlength: 100,
		},
		slug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			maxlength: 120,
			unique: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

// Indexes for fast lookups
tagSchema.index({ name: 1 });

export const TagModel = mongoose.model("Tag",tagSchema);
