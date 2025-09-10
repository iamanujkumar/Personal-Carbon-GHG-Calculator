import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/response.js';

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json(errorResponse('Not authorized, token failed', 401));
    }
  }
  
  if (!token) {
    return res.status(401).json(errorResponse('Not authorized, no token', 401));
  }
};

export { protect };