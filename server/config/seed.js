const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("./db");
const Role = require("../modules/role/RoleModel");
const MenuRoute = require("../modules/menuRoute/MenuRouteModel");
const User = require("../modules/user/UserModel");

const MENU_ROUTES = [
  { name: "Users", route: "/users", parentMenu: "Administration", sequence: 1 },
  { name: "Roles", route: "/roles", parentMenu: "Administration", sequence: 2 },
  {
    name: "Role Permissions",
    route: "/role-permissions",
    parentMenu: "Administration",
    sequence: 3,
  },
  {
    name: "Menu Routes",
    route: "/menu-routes",
    parentMenu: "Administration",
    sequence: 4,
  },
];

const run = async () => {
  await connectDB();

  for (const item of MENU_ROUTES) {
    await MenuRoute.updateOne(
      { route: item.route },
      { $setOnInsert: item },
      { upsert: true },
    );
  }

  const role = await Role.findOneAndUpdate(
    { name: "Super Admin" },
    {
      $setOnInsert: { description: "Full access" },
      $set: { isSuperAdmin: true },
    },
    { upsert: true, returnDocument: "after" },
  );

  const username = (process.env.SEED_ADMIN_USERNAME || "admin").toLowerCase();
  if (await User.exists({ username })) {
    console.log(`User "${username}" already exists, skipping.`);
  } else {
    const password =
      process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(9).toString("base64url");
    await User.create({
      name: "Administrator",
      username,
      password: await bcrypt.hash(password, 10),
      role: role._id,
    });
    console.log(`Created super admin "${username}" with password: ${password}`);
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
