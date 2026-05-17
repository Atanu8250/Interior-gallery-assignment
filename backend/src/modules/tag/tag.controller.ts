/**
 * Purpose: HTTP handlers for tag endpoints.
 * How it is used: Lightweight controller that directly queries TagModel and returns results.
 */
import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { TagModel } from "./tag.model";

export const getTags = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const tags = await TagModel.find().sort({ name: 1 }).lean();

        return sendSuccess(res, {
            success: true,
            message: "Tags fetched successfully",
            data: { tags },
            meta: { count: tags.length },
        });
    } catch (err) {
        next(err);
    }
};