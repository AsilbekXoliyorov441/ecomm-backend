const Category = require("../models/Category");

// Create Category (parentId optional)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, parentId } = req.body;
    let level = 0;
    if (parentId) {
      const parent = await Category.findById(parentId);
      if (!parent)
        return res.status(400).json({ message: "Parent category not found" });
      level = parent.level + 1;
    }
    const cat = new Category({
      name,
      description,
      parent: parentId || null,
      level,
      images: req.files ? req.files.map((f) => f.path) : [],
    });
    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all categories (flat)
exports.getCategories = async (req, res) => {
  try {
    const cats = await Category.find().lean();
    res.json(cats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get category tree (nested)
exports.getCategoryTree = async (req, res) => {
  try {
    const cats = await Category.find().lean();
    const map = {};
    cats.forEach((c) => (map[c._id] = { ...c, children: [] }));
    const roots = [];
    cats.forEach((c) => {
      if (c.parent) {
        if (map[c.parent]) map[c.parent].children.push(map[c._id]);
      } else roots.push(map[c._id]);
    });
    res.json(roots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parentId } = req.body;
    let level = 0;
    if (parentId) {
      const parent = await Category.findById(parentId);
      if (!parent) return res.status(400).json({ message: "Parent not found" });
      level = parent.level + 1;
    }
    const updated = await Category.findByIdAndUpdate(
      id,
      {
        name,
        description,
        parent: parentId || null,
        level,
        images: req.files ? req.files.map((f) => f.path) : undefined,
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // Optionally: remove children or set parent=null — here we delete and also set children parent null
    await Category.findByIdAndDelete(id);
    await Category.updateMany(
      { parent: id },
      { $set: { parent: null, level: 0 } }
    );
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
