const jwt = require("jsonwebtoken");
const User = require("../models/User");

// verify token: supports user and admin tokens (different secrets)
exports.protect = async (req, res, next) => {
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token)
    return res.status(401).json({ message: "Not authorized, no token" });

  try {
    let decoded;
    // try user secret first
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
      req.tokenRole = "user";
    } catch (e) {
      // try admin secret
      decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
      req.tokenRole = "admin";
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token invalid" });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
};
