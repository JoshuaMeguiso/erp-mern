const mongoose = require("mongoose");

const MenuRouteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    route: { type: String, required: true, unique: true, trim: true },
    parentMenu: { type: String, trim: true, default: "" },
    sequence: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MenuRoute", MenuRouteSchema);
