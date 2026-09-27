const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  try {
    // 1. Get the token from the cookie (we set it as 'token' during login/register)
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // 2. Verify the token is valid and not expired/tampered
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Fetch the user from DB using the id stored inside the token
    //    We exclude the password field from what gets attached to req.user
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // 4. Attach user to the request object so later route handlers can use it
    req.user = user;

    next(); // pass control to the actual route handler
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Extra layer: only allow admins through
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect, admin };