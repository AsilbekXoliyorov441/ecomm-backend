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

router.get("/", getProducts);
router.get("/:id", getProduct);

// create / delete product (admin)
router.post("/", protect, requireAdmin, upload.array("images"), createProduct);
router.delete("/:id", protect, requireAdmin, deleteProduct);

// user actions
router.post("/:id/like", protect, toggleLike);
router.post("/:id/cart", protect, toggleCart);
router.post("/:id/rate", protect, rateProduct);

// admin action to toggle returned
router.post("/:id/returned", protect, requireAdmin, toggleReturned);

module.exports = router;
