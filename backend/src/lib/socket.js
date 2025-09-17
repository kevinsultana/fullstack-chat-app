import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const serverIdentifier = http.createServer(app);
const io = new Server(serverIdentifier, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, serverIdentifier as Server };
