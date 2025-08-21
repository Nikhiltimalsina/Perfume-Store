const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function authenticateToken(req, res, next) {
  if (req.path === "/login" || req.path === "/register") {
    return next();
  }

  const token = req.header("Authorization") && req.header("Authorization").split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
    req.user = decoded;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
}

module.exports = { authenticateToken, requireAdmin };