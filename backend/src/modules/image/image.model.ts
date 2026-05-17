/**
 * Purpose: Defines the Mongoose schema and model for images collection.
 * How it is used: Imported by repositories for CRUD operations.
 * Continue here: Schema fields, validators, indexes, and model export.
 */
import mongoose from "mongoose";

const uploaderSnapshotSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true, trim: true },
        avatar: { type: String, trim: true, default: "" },
    },
    { _id: false }
);

const imageSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 200 },
        description: { type: String, trim: true, default: "", maxlength: 2000 },
        imageUrl: { type: String, required: [true, "imageUrl is required"], trim: true },
        tags: { type: [String], default: [] },
        uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        uploaderSnapshot: { type: uploaderSnapshotSchema, required: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Indexes
imageSchema.index({ createdAt: -1 });
imageSchema.index({ tags: 1 });
imageSchema.index({ uploaderId: 1 });

export const ImageModel = mongoose.model("Image", imageSchema);

export default ImageModel;