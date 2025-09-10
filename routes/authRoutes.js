const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  register,
  login,
  adminLogin,
  googleCallback,
} = require("../controllers/authController");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User and admin authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword
 *               name:
 *                 type: string
 *                 example: John Doe
 *               adminSecret:
 *                 type: string
 *                 example: admin12345
 *                 description: Only for admin registration
 *               phone:
 *                 type: string
 *                 example: 998901234567
 *                 description: Required if registering as admin
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login as a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     summary: Login as admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *               - adminSecret
 *             properties:
 *               phone:
 *                 type: string
 *                 example: 998901234567
 *               password:
 *                 type: string
 *                 example: adminpassword
 *               adminSecret:
 *                 type: string
 *                 example: admin12345
 *     responses:
 *       200:
 *         description: Admin login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/admin/login", adminLogin);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Login with Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google authentication
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged in via Google
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

module.exports = router;
