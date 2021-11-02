const users = [];

// user join the room
export const addUser = ({ userID, userName, room }) => {
  try {
    // trimming space and lowercase
    userName = userName.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const User = { userID, userName, room };

    users.push(User);

    return { user: User };
  } catch (error) {
    console.log(error.message);
  }
};

// remove current user
export const removeUser = userID => {
  try {
    const index = users.findIndex(user => user.userID === userID);

    if (index !== -1) return users.splice(index, 1)[0];
  } catch (error) {
    console.log(error.message);
  }
};

// get current user
export const getCurrentUser = userID => {
  try {
    return users.find(user => user.userID === userID);
  } catch (error) {
    console.log(error.message);
  }
};

// get all users in one given room
export const getUsersRoom = room => {
  try {
    return users.filter(user => user.room === room);
  } catch (error) {
    console.log(error.message);
  }
};
