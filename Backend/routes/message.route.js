import express from "express";
import { getMessage, sendMessage, markMessageAsRead } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const route = express.Router();

route.get("/:id", protectRoute, getMessage);
route.post("/send/:id", protectRoute, sendMessage);
route.post("/read", protectRoute, markMessageAsRead); // NEW

export default route;