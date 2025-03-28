// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDb = require("./utils/db");
// const clientRouter = require("./router/client-router");
// const landlordRouter = require("./router/landlord-router");
// const { errorMiddleware } = require("./middlewares/landlord-middleware");

// const Port = process.env.PORT || 8000;
// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(express.json());

// app.use("/api/clients", clientRouter);
// app.use("/api/landlords", landlordRouter);

// app.use(errorMiddleware);

// connectDb()
//   .then(() => {
//     app.listen(Port, () => {
//       console.log(`Server is running on port ${Port}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Failed to connect to database:", error);
//   });

// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDb = require("./utils/db");
const clientRouter = require("./router/client-router");
const landlordRouter = require("./router/landlord-router");
const { errorMiddleware } = require("./middlewares/landlord-middleware");
const http = require('http');
const { Server } = require('socket.io');

const Port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }
});

// Socket.IO connection handler
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Join room based on userId
//   socket.on('join-user-room', (userId) => {
//     socket.join(userId);
//     console.log(`User ${userId} joined their room`);
//   });

//   // Handle sending messages
//   socket.on('send-message', async ({ senderId, receiverId, content }) => {
//     try {
//       const message = {
//         sender: senderId,
//         receiver: receiverId,
//         content,
//         timestamp: new Date()
//       };

//       // Save message to database (you'll need to implement this)
//       const savedMessage = await saveMessageToDatabase(message);

//       // Emit to sender and receiver
//       io.to(senderId).emit('receive-message', savedMessage);
//       io.to(receiverId).emit('receive-message', savedMessage);
      
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   });
// 

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// server.js (socket.io part)
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
  
    socket.on('join-conversation', ({ userId, roommateId }) => {
      socket.join(`conversation_${userId}_${roommateId}`);
      console.log(`User ${userId} joined conversation with ${roommateId}`);
    });
  
    socket.on('send-message', async (message) => {
      try {
        // Save to database
        const savedMessage = await Message.create(message);
        
        // Emit to both participants
        io.to(`conversation_${message.sender}_${message.receiver}`)
          .emit('new-message', savedMessage);
        io.to(`conversation_${message.receiver}_${message.sender}`)
          .emit('new-message', savedMessage);
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/clients", clientRouter);
app.use("/api/landlords", landlordRouter);

app.use(errorMiddleware);

connectDb()
  .then(() => {
    server.listen(Port, () => {
      console.log(`Server is running on port ${Port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
  });