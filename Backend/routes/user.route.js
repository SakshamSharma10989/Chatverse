import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getuserForSidebar, updateUser } from "../controllers/user.controller.js"; // MODIFIED: Add updateUser

const route = express.Router();

route.get("/", protectRoute, getuserForSidebar);
route.patch("/update", protectRoute, updateUser); // NEW

export default route;