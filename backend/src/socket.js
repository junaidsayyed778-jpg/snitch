let io;

export const initiallzeSocket = (socketServer) => {
  io = socketServer;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initiallized");
  }

  return io;
};
