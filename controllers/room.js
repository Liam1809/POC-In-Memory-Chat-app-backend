// import redis client
import { set, setex, get, scanAll } from '../common/redisClient.js';
// import API responses
import responses from '../common/responsesAPI.js';

const data = {
  firstName: 'Liam',
  lastName: 'Ha',
  age: 22,
};

export const getTesting = async (req, res) => {
  try {
    // TESTING
    await set('fullName:user1', JSON.stringify(data));
    await set('fullName:user2', JSON.stringify(data));
    await set('fullName:user3', JSON.stringify(data));
    await set('fullName:user4', JSON.stringify(data));
    await set('fullName:user5', JSON.stringify(data));
    await set('fullName:user6', JSON.stringify(data));
    await set('fullName:user7', JSON.stringify(data));
    await set('fullName:user8', JSON.stringify(data));
    await set('fullName:user9', JSON.stringify(data));
    await set('fullName:user10', JSON.stringify(data));
    await set('fullName:user11', JSON.stringify(data));
    await set('fullName:user12', JSON.stringify(data));
    // await setex('fullName:user2', 50, JSON.stringify(data));

    const data1 = await get('fullName:user1');
    console.log(JSON.parse(data1));

    const scannedData = await scanAll('fullName:*');
    console.log('this is scanned data', scannedData, scannedData.length);
    res.json(data);
  } catch (error) {
    console.log(error.message);
  }
};
// GET ALL ROOMS
export const getAllRooms = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
  }
};

// CREATE NEW ROOM
export const createRoom = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
  }
};

// UPDATE CURRENT ROOM
export const updateRoom = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
  }
};

// DELETE CURRENT ROOM
export const deleteRoom = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
  }
};
