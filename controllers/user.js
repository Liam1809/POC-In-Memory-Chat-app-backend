import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

//user Model
import User from '../models/user.js';

// API responses
import responses from '../common/responsesAPI.js';

// SIGN IN
export const signin = async (req, res) => {
  try {
    // get userName, password from client side
    const { userName, password } = req.body;

    // check for existing user by userName
    const existingUser = await User.findOne({ userName });

    // if no user found
    if (!existingUser)
      responses._404(res, { message: 'User Name does not exist.' });

    // compare password with brcyptjs
    const checkPassword = await bcrypt.compare(password, existingUser.password);

    // if password unmatched
    if (!checkPassword) responses._401(res, { message: 'Invalid password.' });

    // get existing user's token and send to front end and set up user's expire time
    const token = jwt.sign(
      { name: existingUser.userName, id: existingUser._id },
      process.env.KEY_TOKEN,
      { expiresIn: process.env.TOKEN_EXPIRED_TIME }
    );

    // send userInfo and token
    responses._200(res, { userInfo: existingUser, token });
  } catch (error) {
    responses._500(res, { message: error.message });
  }
};

// REGISTER
export const signup = async (req, res) => {
  try {
    // get userName, password, confirmPassword from client side
    const { userName, password, confirmPassword } = req.body;

    // check for existing user by userName
    const existingUser = await User.findOne({ userName });

    // if user found
    if (existingUser)
      responses._401(res, { message: 'User Name already exists.' });

    // compare password and confirmPassword
    if (password !== confirmPassword)
      responses._401(res, { message: 'Reapeat password not matched.' });

    // hash password
    const hashPassword = await bcrypt.hash(password, 2);

    // create new user
    const newUser = await User.create({ userName, password: hashPassword });

    // create and sign user token
    const token = jwt.sign(
      { userName: newUser.userName, id: newUser._id },
      process.env.KEY_TOKEN,
      { expiresIn: process.env.TOKEN_EXPIRED_TIME }
    );

    // send userInfo and token
    responses._200(res, { userInfo: newUser, token });
  } catch (error) {
    responses._500(res, { message: error.message });
  }
};
