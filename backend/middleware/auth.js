// middleware/auth.js
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Full auth header:', authHeader);
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  console.log('Token received:', token);
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  }  catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ 
      message: 'Invalid or expired token',
      code: 'TOKEN_EXPIRED'
    });
  }
});

module.exports = authMiddleware;