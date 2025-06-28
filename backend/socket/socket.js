import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: [
      "https://chatverse-w6ra.vercel.app", // your production Vercel URL
      "https://chatverse-781j.vercel.app", // any preview deployment
      "http://localhost:3000",             // for local dev
    ],
    methods: ["GET", "POST"],
    credentials: true, // 🔥 this is crucial
  },
});


const userSocketMap = {}; 

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, server };