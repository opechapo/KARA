const jwt = require('jsonwebtoken');


const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  console.log('Token:', token);
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user =decoded ; // Map `id` to `_id`
    console.log('req.user:', req.user);
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;