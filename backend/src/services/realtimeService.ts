import type { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export const setRealtimeServer = (server: SocketIOServer) => {
  io = server;
};

export const emitRealtime = (event: string, payload: unknown, collegeId?: string) => {
  if (!io) return;
  if (collegeId) {
    io.to(`college:${collegeId}`).emit(event, payload);
    return;
  }
  io.emit(event, payload);
};
