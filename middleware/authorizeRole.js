const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
      const { role } = req.user; // Extract role from JWT token
  
      if (role !== requiredRole) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      next();
    };
  };
  
  module.exports = authorizeRole;
  