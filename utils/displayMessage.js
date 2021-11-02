import moment from 'moment';

export const displayMessage = (userName, text) => {
  return {
    userName: userName,
    message: text,
    createdAt: moment().format('h:mm a'),
  };
};
