const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema(
  {
    route: { type: String, required: true },
    access: { type: [String], default: [] },
  },
  { _id: false },
);

const RolePermissionSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
      unique: true,
    },
    permissions: { type: [PermissionSchema], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RolePermission", RolePermissionSchema);
