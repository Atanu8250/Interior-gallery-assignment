/**
 * Purpose: Defines the Mongoose schema and model for users collection.
 * How it is used: Referenced by repositories and image uploader relations.
 * Continue here: User fields, constraints, and reusable indexes.
 */
import mongoose, { InferSchemaType, HydratedDocument, Model } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "User name is required"],
            trim: true,
            minlength: 2,
            maxlength: 80,
        },
        avatar: {
            type: String,
            trim: true,
            default: "",
            maxlength: 500,
        },
        bio: {
            type: String,
            trim: true,
            default: "",
            maxlength: 500,
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

userSchema.index({ createdAt: -1 });

// export type UserDoc = HydratedDocument<InferSchemaType<typeof userSchema>>;
// type UserModelType = Model<InferSchemaType<typeof userSchema>>;

// export const UserModel = mongoose.model<InferSchemaType<typeof userSchema>, UserModelType>("User", userSchema);
export const UserModel = mongoose.model("User", userSchema);
