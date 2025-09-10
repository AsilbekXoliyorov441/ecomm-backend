const Product = require("../models/Product");

// Create product (admin)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      categoryId,
      innerCategoryId,
      extraInnerCategoryId,
      discount,
    } = req.body;

    const product = new Product({
      name,
      price,
      description,
      images: req.files ? req.files.map((f) => f.path) : [],
      category: categoryId || null,
      innerCategory: innerCategoryId || null,
      extraInnerCategory: extraInnerCategoryId || null,
      discount: discount || 0,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get products (populate category refs)
exports.getProducts = async (req, res) => {
  try {
    const prods = await Product.find()
      .populate("category")
      .populate("innerCategory")
      .populate("extraInnerCategory")
      .lean();
    res.json(prods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id)
      .populate("category")
      .populate("innerCategory")
      .populate("extraInnerCategory");
    if (!prod) return res.status(404).json({ message: "Not found" });
    res.json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle like for currently authenticated user
exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user._id;
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });

    const exists = prod.likes.find((id) => id.toString() === userId.toString());
    if (exists) {
      prod.likes = prod.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      prod.likes.push(userId);
    }
    await prod.save();
    res.json({ likesCount: prod.likes.length, liked: !exists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle cart
exports.toggleCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });

    const exists = prod.carts.find((id) => id.toString() === userId.toString());
    if (exists) {
      prod.carts = prod.carts.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      prod.carts.push(userId);
    }
    await prod.save();
    res.json({ cartCount: prod.carts.length, inCart: !exists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle returned flag (admin)
exports.toggleReturned = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });
    prod.returned = !prod.returned;
    await prod.save();
    res.json({ returned: prod.returned });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Rate product (user)
exports.rateProduct = async (req, res) => {
  try {
    const { rating } = req.body; // number 1..5
    if (!rating) return res.status(400).json({ message: "Rating required" });
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });

    prod.rating =
      (prod.rating * prod.ratingCount + Number(rating)) /
      (prod.ratingCount + 1);
    prod.ratingCount = prod.ratingCount + 1;
    await prod.save();
    res.json({ rating: prod.rating, ratingCount: prod.ratingCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete product (admin)
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
