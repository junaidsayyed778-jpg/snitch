import dotenv from "dotenv";
import http from "http";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "./src/config/config.js";
import { initiallzeSocket } from "./src/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true,
      },
    });

    initiallzeSocket(io)
    io.use((socket, next) => {
      try {
        console.log(
          "Socket cookie received:",
          !!socket.handshake.headers.cookie,
        );

        const cookieHeader = socket.handshake.headers.cookie;

        if (!cookieHeader) {
          return next(new Error("Unauthorized"));
        }

        const cookies = Object.fromEntries(
          cookieHeader.split("; ").map((cookie) => cookie.split("=")),
        );

        const token = cookies.token;

        if (!token) {
          return next(new Error("Unauthorized"));
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        socket.user = {
          id: decoded.id,
        };

        next();
      } catch (err) {
        console.log("Socket auth error:", err.message);
        next(new Error("Unauthorized"));
      }
    });
    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      socket.join(`user:${socket.user.id}`);

      console.log("User joined room:", socket.user.id);
      io.to(`user:${socket.user.id}`).emit("test-message", {
        message: "Socket room is working!",
      });
    });
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.log("failed to start server: ", err.message);
    process.exit(1);
  }
};

startServer();
