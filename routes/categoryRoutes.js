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

router.get("/", getCategories);
router.get("/tree", getCategoryTree);

// Admin only
router.post("/", protect, requireAdmin, upload.array("images"), createCategory);
router.put(
  "/:id",
  protect,
  requireAdmin,
  upload.array("images"),
  updateCategory
);
router.delete("/:id", protect, requireAdmin, deleteCategory);

module.exports = router;
