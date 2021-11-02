// import redis client
import { set, setex, get, del, mget, scanAll } from '../common/redisClient.js';

// import API responses
import responses from '../common/responsesAPI.js';

// GET ALL ROOMS
export const getAllRooms = async (req, res) => {
  try {
    // retrieve all keys room array
    const allRoomKeys = await scanAll('room:*');

    // if no keys length
    if (allRoomKeys.length <= 0)
      responses._404(res, { message: 'No Rooms Found.' });

    // get multiple rooms' values by their keys
    const existingRooms = await mget(allRoomKeys);

    // JSON PARSE
    const parsedRooms = existingRooms.map(room => JSON.parse(room));

    // send rooms
    responses._200(res, parsedRooms);
  } catch (error) {
    responses._500(res, { message: error.message });
  }
};

// CREATE NEW ROOM
export const createRoom = async (req, res) => {
  try {
    const { roomName, roomExpiredIn } = req.body;

    // if no roomName
    if (!roomName) responses._404(res, { message: 'roomName is required.' });

    // check if keys with roomName exists
    const existingKey = await scanAll(`room:${roomName}:${req.userName}`);

    // if keys exists
    if (existingKey.length > 0) responses._401(res, { message: 'room exists' });

    // create new room
    const newRoom = {
      roomName: roomName,
      creator: req.userName,
      createdAt: new Date().toDateString(),
    };

    // set Expire Time
    await setExpireTime(newRoom, req.userName, roomExpiredIn);

    // send newRoom
    responses._201(res, newRoom);
  } catch (error) {
    responses._500(res, { message: error.message });
  }
};

// UPDATE CURRENT ROOM
export const updateRoom = async (req, res) => {
  try {
    const { name } = req.params;
    const { roomName, roomExpiredIn } = req.body;

    // if no name param
    if (!name) responses._400(res, { message: 'No room name param' });
    // if no roomName req.body
    if (!roomName) responses._404(res, { message: 'roomName is required.' });

    // check if keys with name exists
    const existingKey1 = await scanAll(`room:${name}:${req.userName}`);
    // check if keys with roomName exists
    const existingKey2 = await scanAll(`room:${roomName}:${req.userName}`);

    // if keys not exists
    if (existingKey1.length <= 0)
      responses._401(res, { message: 'room does not exist' });
    // if keys exists
    if (existingKey2.length > 0)
      responses._401(res, { message: 'roomName already taken' });

    //get room's value
    const roomData = JSON.parse(await get(existingKey1[0]));

    // create update room
    const updatedRoom = { ...roomData, roomName: roomName };

    // delete old key
    await del(`room:${name}:${req.userName}`);

    // set Expire Time
    await setExpireTime(updatedRoom, req.userName, isExpired, roomExpiredIn);

    // send updatedRoom
    responses._200(res, updatedRoom);
  } catch (error) {
    responses._500(res, { message: error.message });
  }
};

// DELETE CURRENT ROOM
export const deleteRoom = async (req, res) => {
  try {
    const { name } = req.params;

    // if no param
    if (!name) responses._400(res, { message: 'No room name param' });

    // check if keys with name exists
    const existingKey = await scanAll(`room:${name}:${req.userName}`);

    // if keys not exists
    if (existingKey.length < 0)
      responses._401(res, { message: 'room does not exist' });

    // delete
    await del(`room:${name}:${req.userName}`);

    // send no-content body request
    responses._204(res, { message: 'succesfully deleted' });
  } catch (error) {
    responses._500(res, { message: error.message });
  }
};

// set Expire Time func
const setExpireTime = async (room, userName, roomExpiredIn) => {
  // if activated expired time
  if (roomExpiredIn) {
    // set DB with expire time
    await setex(
      `room:${room.roomName}:${userName}`,
      parseInt(roomExpiredIn),
      JSON.stringify(room)
    );

    // if no activatted
  } else {
    // set DB without expire time
    await set(`room:${room.roomName}:${userName}`, JSON.stringify(room));
  }
};
