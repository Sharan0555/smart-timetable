import http from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { setRealtimeServer } from './services/realtimeService.js';

const start = async () => {
  await connectDatabase();
  const app = createApp();
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: {
      origin: env.frontendUrl,
      credentials: true
    }
  });
  setRealtimeServer(io);

  io.on('connection', (socket) => {
    socket.on('join:college', (collegeId: string) => {
      socket.join(`college:${collegeId}`);
    });
  });

  server.listen(env.port, () => {
    console.log(`Backend listening on port ${env.port}`);
  });
};

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
