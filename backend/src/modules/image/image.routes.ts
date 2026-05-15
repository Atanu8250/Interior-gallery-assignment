/**
 * Purpose: Declares image module REST endpoints and maps them to controllers.
 * How it is used: Mounted by the root router under versioned API paths.
 * Continue here: Feed, detail, related-image routes, and request middleware.
 */
import { Router } from "express";
import { getImageById, getImageFeed, getRelatedImages } from "./image.controller";

const imageRouter = Router();

// GET /api/v1/images?limit=12&cursor=<cursor>&tag=kitchen
imageRouter.get("/", getImageFeed);

// GET /api/v1/images/:id
imageRouter.get("/:id", getImageById);

// GET /api/v1/images/:id/related
imageRouter.get("/:id/related", getRelatedImages);

export { imageRouter };
