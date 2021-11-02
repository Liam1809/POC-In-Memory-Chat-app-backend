// import redis client
import { set, setex, get, mget, scanAll } from '../common/redisClient.js';
// import API responses
import responses from '../common/responsesAPI.js';

// const data = {
//   firstName: 'Liam',
//   lastName: 'Ha',
//   age: 22,
// };

// export const getTesting = async (req, res) => {
//   try {
//     // TESTING
//     await set('fullName:hello:user1', JSON.stringify(data));
//     await set('fullName:hello1:user1', JSON.stringify(data));
//     await set('fullName:hello2:user1', JSON.stringify(data));
//     await set('fullName:hello:user2', JSON.stringify(data));
//     await set('fullName:hello1:user2', JSON.stringify(data));
//     await set('fullName:hello2:user2', JSON.stringify(data));

//     // const data1 = await get('fullName:user1');
//     // console.log(JSON.parse(data1));
//     const scannedData = await scanAll('fullName:*:user1');
//     console.log('this is scanned data', scannedData, scannedData.length);

//     // const datalol = await mget(scannedData);s

//     // console.log(datalol.map(element => JSON.parse(element)));

//     responses._201(res, data);
//   } catch (error) {
//     responses._500(res, { message: error.message });
//   }
// };
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
    const { roomName, isExpired, roomExpiredIn } = req.body;

    // if no roomName and no userName
    if (!roomName & !userName)
      responses._404(res, { message: 'roomName and userName required.' });

    // check if roomName exists
    const existingKey = await scanAll(`room:${roomName}:${req.userName}`);

    // if keys existed
    if (existingKey.length > 0)
      responses._401(res, { message: 'roomName exists' });

    // create new room
    const newRoom = {
      roomName: roomName,
      creator: req.userName,
      createdAt: new Date().toDateString(),
    };

    // if expired activated and roomExpiredIn is set as number > 0
    if (isExpired) {
      // check roomExpiredIn time
      if (!roomExpiredIn && parseInt(roomExpiredIn) < 0)
        responses._404(res, { message: 'Invalid expire time.' });

      // set DB with expire time
      await setex(
        `room:${newRoom.roomName}:${newRoom.creator}`,
        parseInt(roomExpiredIn),
        JSON.stringify(newRoom)
      );

      // if no activatted expired time
    } else {
      // set DB without expire time
      await set(
        `room:${newRoom.roomName}:${newRoom.creator}`,
        JSON.stringify(newRoom)
      );
    }

    // send newRoom
    responses._201(res, newRoom);
  } catch (error) {
    responses._500(res, { message: error.message });
  }
};

// UPDATE CURRENT ROOM
export const updateRoom = async (req, res) => {
  try {
  } catch (error) {
    responses._500(res, { message: error.message });
  }
};

// DELETE CURRENT ROOM
export const deleteRoom = async (req, res) => {
  try {
  } catch (error) {
    responses._500(res, { message: error.message });
  }
};
