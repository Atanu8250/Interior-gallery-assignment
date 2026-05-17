import { Router } from "express";
import { getTags } from "./tag.controller";

const tagRouter = Router();

// GET /api/v1/tags
tagRouter.get("/", getTags);

export { tagRouter };
