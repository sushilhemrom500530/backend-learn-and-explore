import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "./../middlewares/socket";
// import { SOCKET_EVENTS } from "./../modules/chat/chat.constant";
import { registerChatHandlers } from "./socket.controller";

// let io: Server;

// export function initSocket(httpServer: HttpServer): Server {
//   io = new Server(httpServer, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//     maxHttpBufferSize: 1e7,
//   });

//   io.use(socketAuthMiddleware);

//   io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
//     console.log(
//       `[Socket] Connected | id: ${socket.id} | user: ${socket.data.userId}`,
//     );
//     registerChatHandlers(io, socket);
//   });

//   return io;
// }

// export function getIO(): Server {
//   if (!io) {
//     throw new Error("Socket.io not initialized. Call initSocket() first.");
//   }
//   return io;
// }

// export { io };
