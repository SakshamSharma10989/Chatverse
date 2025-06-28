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

const allowedOrigins = [
  "https://chatverse-w6ra.vercel.app", // your production frontend
  "https://chatverse-781j.vercel.app", // preview #1
  "https://chatverse-x7z2.vercel.app", // preview #2 (your error)
];

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Add this to handle preflight OPTIONS requests
app.options("*", cors({ origin: allowedOrigins, credentials: true }));

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
