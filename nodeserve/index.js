const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Create an HTTP server
const server = http.createServer();

// Initialize Socket.IO with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins (replace with your frontend URL in production)
    methods: ['GET', 'POST'], // Allowed HTTP methods
  },
});

// Store connected users
const users = {};

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a new user joins
  socket.on('new-user-joined', (name) => {
    if (!name) {
      console.log('Invalid name provided');
      return;
    }

    console.log('New user joined:', name);
    users[socket.id] = name;

    // Broadcast to all other users that a new user has joined
    socket.broadcast.emit('user-joined', name);
  });

  // When a user sends a message
  socket.on('send', (message) => {
    const senderName = users[socket.id];
    if (!senderName) {
      console.log('Unknown user tried to send a message');
      return;
    }

    // Broadcast the message to all other users
    socket.broadcast.emit('receive', { message, name: senderName });
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    const userName = users[socket.id];
    if (userName) {
      console.log('User left:', userName);

      // Broadcast to all other users that this user has left
      socket.broadcast.emit('left', userName);

      // Remove the user from the `users` object
      delete users[socket.id];
    }
  });
});

// Start the server
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});