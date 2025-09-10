const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  createProduct,
  getProducts,
  getProduct,
  toggleLike,
  toggleCart,
  toggleReturned,
  rateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, requireAdmin } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and actions
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 */
router.get("/:id", getProduct);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15
 *               description:
 *                 type: string
 *                 example: Latest Apple iPhone
 *               price:
 *                 type: number
 *                 example: 1200
 *               categoryId:
 *                 type: string
 *                 example: 64f1a1234567abcd1234efgh
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["S", "M", "L"]
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["red", "blue"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               material:
 *                 type: string
 *                 example: Aluminum
 *               discountId:
 *                 type: string
 *                 example: 64f1b4567890abcd1234efgh
 *               minSellQty:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Product created
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, requireAdmin, upload.array("images"), createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, requireAdmin, deleteProduct);

/**
 * @swagger
 * /api/products/{id}/like:
 *   post:
 *     summary: Toggle like for a product (User only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Like toggled
 */
router.post("/:id/like", protect, toggleLike);

/**
 * @swagger
 * /api/products/{id}/cart:
 *   post:
 *     summary: Toggle product in user's cart
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product added or removed from cart
 */
router.post("/:id/cart", protect, toggleCart);

/**
 * @swagger
 * /api/products/{id}/rate:
 *   post:
 *     summary: Rate a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 5
 *               review:
 *                 type: string
 *                 example: Excellent product!
 *     responses:
 *       200:
 *         description: Product rated
 */
router.post("/:id/rate", protect, rateProduct);

/**
 * @swagger
 * /api/products/{id}/returned:
 *   post:
 *     summary: Toggle returned status (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product return status toggled
 */
router.post("/:id/returned", protect, requireAdmin, toggleReturned);

module.exports = router;
