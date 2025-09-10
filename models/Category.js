const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    }, // null => root category
    level: { type: Number, default: 0 }, // 0 main, 1 inner, 2 extra-inner
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
