// Middlewares/Auth.js
const jwt = require('jsonwebtoken');

const ensureAunthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        // Use 401 for missing token
        return res.status(401).json({ message: 'Unauthorised, JWT token is required' }); 
    }
    try {
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info (should include _id)
        next();
    } catch (err) {
        // Use 401 for invalid/expired token
        return res.status(401).json({ message: 'Unauthorised, JWT token is wrong or expired' }); 
    }
};

module.exports = ensureAunthenticated;