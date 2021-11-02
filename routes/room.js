import express from 'express';

// import action controllers
import {
  getTesting,
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/room.js';

// import authentication
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/getTesting', getTesting);
router.get('/', getAllRooms);
router.post('/', createRoom);
router.patch('/:roomName', updateRoom);
router.delete('/:roomName', deleteRoom);

export default router;
