const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  createCategory,
  getCategories,
  getCategoryTree,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect, requireAdmin } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management and retrieval
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", getCategories);

/**
 * @swagger
 * /api/categories/tree:
 *   get:
 *     summary: Get category tree (with subcategories)
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Category tree
 */
router.get("/tree", getCategoryTree);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
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
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: All electronic items
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Category created
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, requireAdmin, upload.array("images"), createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics Updated
 *               description:
 *                 type: string
 *                 example: Updated description
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Category updated
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  protect,
  requireAdmin,
  upload.array("images"),
  updateCategory
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, requireAdmin, deleteCategory);

module.exports = router;
