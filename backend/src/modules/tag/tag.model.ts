/**
 * Purpose: Defines the Mongoose schema and model for tags collection.
 * How it is used: Used for tag lookups and image-tag relationships.
 * Continue here: Tag schema, slug uniqueness, and indexing strategy.
 */
import mongoose, { InferSchemaType, HydratedDocument, Model } from "mongoose";

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
		toJSON: {
			virtuals: true,
			transform: (_doc, ret) => {
				const normalized = ret as Record<string, unknown>;
				normalized.id = String(normalized._id);
				delete normalized._id;
			},
		},
	}
);

// Indexes for fast lookups
tagSchema.index({ slug: 1 });
tagSchema.index({ name: 1 });

// export type TagDoc = HydratedDocument<InferSchemaType<typeof tagSchema>>;
// type TagModelType = Model<InferSchemaType<typeof tagSchema>>;

// export const TagModel = mongoose.model<InferSchemaType<typeof tagSchema>, TagModelType>(
// 	"Tag",
// 	tagSchema
// );

export const TagModel = mongoose.model("Tag",tagSchema);
