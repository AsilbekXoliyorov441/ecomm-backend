const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  register,
  login,
  adminLogin,
  googleCallback,
} = require("../controllers/authController");

// register / login
router.post("/register", register); // if wants admin role, send adminSecret + phone in body
router.post("/login", login);

// admin login (phone + password + adminSecret)
router.post("/admin/login", adminLogin);

// Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

module.exports = router;
