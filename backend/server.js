// backend/index.js
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import { app, server } from "./socket/socket.js";
import connectToMongo from "./db/connecToMongo.js";

dotenv.config();
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://chatverse-22ox.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/upload", express.static(path.join(__dirname, "/uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);

server.listen(PORT, async () => {
  await connectToMongo();
  console.log(`🚀 Server running on port ${PORT}`);
});
