/**
 * Purpose: Composes and exports the root API router.
 * How it is used: Mounted by app setup under a versioned base path.
 * Continue here: Module router registration and health check endpoint.
 */
import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
	res.status(200).json({
		success: true,
		message: "API is healthy",
		data: null,
		meta: null,
	});
});

export { router };

