import express from 'express';

// import action controllers
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/room.js';

// import authentication
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/', auth, getAllRooms);
router.post('/', auth, createRoom);
router.patch('/:roomName', auth, updateRoom);
router.delete('/:roomName', auth, deleteRoom);

export default router;
