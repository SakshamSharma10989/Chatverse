import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getuserForSidebar } from "../controllers/user.controller.js";


const route= express.Router()

route.get("/",protectRoute,getuserForSidebar)

export default route;