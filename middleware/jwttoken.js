const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from Authorization header

  if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

  jwt.verify(token, 'JWTSECRET', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user; // Attach user information to the request
    next();
  });
};

module.exports = authenticateJWT;