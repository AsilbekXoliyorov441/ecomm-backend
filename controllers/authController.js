const User = require("../models/User");
const jwt = require("jsonwebtoken");

// helper to sign token with appropriate secret
const signToken = (userId, role) => {
  const secret =
    role === "admin"
      ? process.env.JWT_SECRET_ADMIN
      : process.env.JWT_SECRET_USER;
  return jwt.sign({ id: userId, role }, secret, { expiresIn: "30d" });
};

// Register (email/password) — always creates user role unless adminSecret provided correctly
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, adminSecret } = req.body;

    if (!email || !password || !name)
      return res
        .status(400)
        .json({ message: "Name, email, password required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    let role = "user";
    if (adminSecret) {
      // if client tries to create admin — require server-side ADMIN_SECRET and phone match
      if (adminSecret !== process.env.ADMIN_SECRET)
        return res.status(400).json({ message: "Invalid admin secret" });
      if (!phone || phone !== process.env.ALLOWED_ADMIN_PHONE)
        return res.status(400).json({ message: "Admin phone mismatch" });
      role = "admin";
    }

    const user = new User({ name, email, password, phone, role });
    await user.save();

    const token = signToken(user._id, role);
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login (email/password) — returns token signed with role-based secret
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user._id, user.role);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin login by phone + admin secret + password
exports.adminLogin = async (req, res) => {
  try {
    const { phone, password, adminSecret } = req.body;
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET)
      return res.status(400).json({ message: "Admin secret invalid" });

    const user = await User.findOne({ phone, role: "admin" });
    if (!user) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user._id, "admin");
    res.json({
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Google OAuth callback handled via passport: returns user + user-token (always role user)
exports.googleCallback = async (req, res) => {
  try {
    // passport attaches user to req.user
    const user = req.user;
    if (!user) return res.status(400).json({ message: "Google auth failed" });

    // always sign with user secret (role user)
    const token = signToken(user._id, "user");
    // respond JSON (or redirect to frontend with token)
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
