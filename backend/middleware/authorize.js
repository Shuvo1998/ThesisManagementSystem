// backend/middleware/authorize.js
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // req.user.role is set by the auth middleware
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: You do not have the required role.' });
    }
    next();
  };
};

module.exports = authorize;