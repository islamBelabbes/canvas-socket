import express from "express";
import { Server } from "socket.io";

type TPoint = { x: number; y: number };

const app = express();

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on(
    "draw",
    ({
      currentPoint,
      previousPoint,
      color,
    }: {
      currentPoint: TPoint;
      previousPoint: TPoint;
      color: string;
    }) => {
      socket.broadcast.emit("draw", currentPoint, previousPoint, color);
    }
  );

  socket.on("eraser", ({ points }: { points: TPoint }) => {
    socket.broadcast.emit("eraser", points);
  });

  socket.on("joined", () => {
    socket.broadcast.emit("joined");
  });

  socket.on("sync", (state) => {
    socket.broadcast.emit("sync", state);
  });

  socket.on("board-cleared", () => {
    socket.broadcast.emit("board-cleared");
  });
});
