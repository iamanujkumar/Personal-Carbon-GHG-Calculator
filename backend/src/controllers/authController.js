import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json(errorResponse('User already exists', 400));
    }
    
    const user = await User.create({
      name,
      email,
      password
    });
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json(errorResponse('Invalid user data', 400));
    }
  } catch (error) {
    res.status(500).json(errorResponse(error.message, 500));
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json(errorResponse('Invalid email or password', 401));
    }
  } catch (error) {
    res.status(500).json(errorResponse(error.message, 500));
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json(errorResponse(error.message, 500));
  }
};

export { registerUser, loginUser, getMe };