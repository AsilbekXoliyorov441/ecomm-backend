const Product = require("../models/Product");
const Category = require("../models/Category"); // qo‘shib qo‘yish kerak

// Create
exports.createProduct = async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;

    // category mavjudligini tekshirish
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const product = new Product({
      name,
      price,
      category: categoryId, // ID bo‘yicha saqlaymiz
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read all
exports.getProducts = async (req, res) => {
  const products = await Product.find().populate("category");
  res.json(products);
};

// Update
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;

    // category mavjudligini tekshirish
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category: categoryId },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
