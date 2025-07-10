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
  'https://chatverse-saksham.vercel.app',   // production
  /\.vercel\.app$/                          // all preview builds
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.some((allowed) =>
          typeof allowed === "string" ? origin === allowed : allowed.test(origin)
        )
      ) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Optional preflight
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());
app.use("/upload", express.static(path.join(__dirname, "/uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

server.listen(PORT, async () => {
  await connectToMongo();
  console.log(`✅ Server listening on port ${PORT}`);
});
