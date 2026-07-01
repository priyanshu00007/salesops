const { Server } = require('socket.io');
const { verifyToken } = require('./jwt');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      socket.disconnect();
      return;
    }
    try {
      const decoded = verifyToken(token);
      socket.userId = decoded.userId;
      socket.role = decoded.role;
      socket.join(`user:${decoded.userId}`);
      if (decoded.role === 'admin') socket.join('admins');
      socket.join(`role:${decoded.role}`);
    } catch {
      socket.disconnect();
    }
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

function emitToAdmins(event, data) {
  if (io) io.to('admins').emit(event, data);
}

function emitToUser(userId, event, data) {
  if (io) io.to(`user:${userId}`).emit(event, data);
}

function emitToRole(role, event, data) {
  if (io) io.to(`role:${role}`).emit(event, data);
}

function emitToAll(event, data) {
  if (io) io.emit(event, data);
}

module.exports = { initSocket, getIO, emitToAdmins, emitToUser, emitToRole, emitToAll };
