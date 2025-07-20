// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // হেডার থেকে টোকেন পান
    const token = req.header('x-auth-token');

    // যদি টোকেন না থাকে
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // টোকেন ভেরিফাই করুন
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user; // ডিকোড করা ইউজার পেলোড req.user এ যুক্ত করুন
        next(); // পরের মিডলওয়্যার বা রাউট হ্যান্ডলারে যান
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};