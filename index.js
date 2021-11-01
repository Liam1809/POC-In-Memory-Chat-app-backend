import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import { createServer } from 'http';

//import routes
import roomRouter from './routes/room.js';
import chatRouter from './routes/chat.js';
dotenv.config();
const app = express();
const server = createServer(app);

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// room router
app.use('/room', roomRouter);
// chat router
app.use('/chat', chatRouter);

app.get('/', (req, res) => {
  res.send('Hello to In-Memory Chat Room Server');
});

//socket.io
// const io = new Server(server, {
//   cors: {
//     cors: {
//       origin: ["https://localhost:3000"],
//       methods: ["GET", "POST"],
//     },
//   },
// });

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is listerning on port: ${PORT}`);
});
