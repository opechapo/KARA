const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  console.log('Request cookies:', req.cookies); // Debug
  console.log('Request headers:', req.headers);
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { _id: "...", iat: ..., exp: ... }
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;