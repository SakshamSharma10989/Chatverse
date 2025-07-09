import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "../backend/routes/auth.route.js";
import messageRoutes from "../backend/routes/message.route.js";
import userRoutes from "../backend/routes/user.route.js";
import { app, server } from "../backend/socket/socket.js";
import connectToMongo from "./db/connecToMongo.js";

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

const FRONTEND_URL = "https://chatverse-saksham.vercel.app"; 
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// Optional preflight config
app.options("*", cors({ origin: FRONTEND_URL, credentials: true }));

app.use(express.json());
app.use(cookieParser());
app.use("/upload", express.static(path.join(__dirname, "/uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);

server.listen(PORT, async () => {
  await connectToMongo();
  console.log(`Server listening on port ${PORT}`);
});
