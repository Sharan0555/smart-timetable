import { io, type Socket } from 'socket.io-client';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(socketUrl, { autoConnect: false, transports: ['websocket'] });
  }
  return socket;
};
