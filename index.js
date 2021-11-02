import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import { createServer } from 'http';

//import routes
import roomRouter from './routes/room.js';
import userRouter from './routes/user.js';

//import socket utils
import {
  addUser,
  removeUser,
  getCurrentUser,
  getUsersRoom,
} from './utils/user.js';
import { displayMessage } from './utils/displayMessage.js';

dotenv.config();
const app = express();
const server = createServer(app);

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// room router
app.use('/room', roomRouter);
// user router
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.send('Hello to In-Memory Chat Room Server');
});

// socket.io
const io = new Server(server, {
  cors: {
    cors: {
      origin: ['https://localhost:3000'],
      methods: ['GET', 'POST'],
    },
  },
});

io.on('connection', socket => {
  // join room
  socket.on('join room', ({ room, userName }, callback) => {
    try {
      const user = addUser({
        userID: socket.id,
        userName,
        room,
      });

      // socket join room
      socket.join(user.room);

      // welcome user to the room
      socket.emit(
        'message',
        displayMessage(
          'admin',
          `Welcome ${user.userName} to the chatting room ${user.room}`
        )
      );

      //boardcast new user to other users
      socket.broadcast
        .to(user.room)
        .emit(
          'message',
          displayMessage('admin', `${user.userName} has joined the room`)
        );

      //send users and room info
      io.to(user.room).emit('all users in room', {
        room: user.room,
        users: getUsersRoom(user.room),
      });
      callback({
        status: 'Succeeded',
      });
    } catch (error) {
      callback({
        status: error.message,
      });
    }
  });

  //listen for chat message
  socket.on('send message', (message, callback) => {
    try {
      const user = getCurrentUser(socket.id);

      io.to(user.room).emit('message', displayMessage(user.userName, message));
      callback({
        status: 'Succeeded',
      });
    } catch (error) {
      callback({
        status: error.message,
      });
    }
  });

  //disconect-room
  socket.on('disconnect', () => {
    try {
      const user = removeUser(socket.id);

      if (user) {
        io.to(user.room).emit(
          'message',
          displayMessage('admin', `${user.userName} has left the room!`)
        );
        //send users and room info
        io.to(user.room).emit('users in room', {
          room: user.room,
          users: getUsersRoom(user.room),
        });
      }
      socket.leave(user.room);
    } catch (error) {
      console.log(error.message);
    }
  });
});

const PORT = process.env.PORT || 5000;

// connect to mongoDB
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    server.listen(PORT, () =>
      console.log(`Server is listening on PORT: ${PORT}`)
    )
  )
  .catch(error => console.log(error.message));
