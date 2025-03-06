const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    // Check if the wallet address matches the token
    if (req.params.walletAddress && 
        user.walletAddress.toLowerCase() !== req.params.walletAddress.toLowerCase()) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };