import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // 🆕

import authRoutes from "../backend/routes/auth.route.js";
import messageRoutes from "../backend/routes/message.route.js";
import userRoutes from "../backend/routes/user.route.js";
import { app, server } from "../backend/socket/socket.js";
import connectToMongo from "./db/connecToMongo.js";

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

// 🛡️ Add this CORS middleware
app.use(
  cors({
    origin: "https://chatverse-w6ra.vercel.app",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);

// Serve uploaded media
app.use("/upload", express.static(path.join(__dirname, "/uploads")));

// Start server
server.listen(PORT, async () => {
  await connectToMongo();
  console.log(`Server listening on port ${PORT}`);
});
