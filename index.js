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

dotenv.config();
const app = express();
const server = createServer(app);

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// room router
app.use('/room', roomRouter);
// chat router
app.use('/user', userRouter);

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

/* 

flow: 
user register acc, login de vo phong

room
- get all room
- get room
- create rooom - expiry time
- update room 
- delete room

}

user: {

}

chat: {
    
}
*/
