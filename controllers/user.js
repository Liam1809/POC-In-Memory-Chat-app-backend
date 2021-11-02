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
    // check for existing user
  } catch (error) {
    console.log(error.message);
  }
};

// REGISTER
export const signup = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
  }
};
