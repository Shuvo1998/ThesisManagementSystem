// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // টোকেন হেডার থেকে নাও
  const token = req.header('x-auth-token');

  // টোকেন না থাকলে চেক করো
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // টোকেন ভেরিফাই করো
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // { id: userId, role: userRole } অবজেক্ট req.user এ যুক্ত করা হলো
    next();
  } catch (err) {
    console.error('Token is not valid:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};