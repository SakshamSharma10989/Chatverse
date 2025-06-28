import express from "express";
import { getMessage, sendMessage, markMessageAsRead, uploadMedia } from "../controllers/message.controller.js"; // Add uploadMedia
import protectRoute from "../middleware/protectRoute.js";
import { upload } from "../middleware/upload.js"; // Import upload middleware (create this file if needed)

const router = express.Router();

router.get("/:id", protectRoute, getMessage);
router.post("/send/:id", protectRoute, sendMessage);
router.post("/read", protectRoute, markMessageAsRead);
router.post("/upload/:id", protectRoute, upload.single('media'), uploadMedia); // New route for media upload

export default router;