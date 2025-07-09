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

const allowedOrigins = [
  "https://chatverse-w6ra.vercel.app",
  "https://chatverse-781j.vercel.app",
  "https://chatverse-x7z2.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin.includes("vercel.app") ||
        origin === "http://localhost:3000"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.options("*", cors({ origin: allowedOrigins, credentials: true }));

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
