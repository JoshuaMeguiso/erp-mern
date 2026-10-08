const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./UserModel");
const Role = require("../role/RoleModel");
const RolePermission = require("../rolePermission/RolePermissionModel");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../../config/constants");
const { HttpError } = require("../../middleware/errorHandler");

const SALT_ROUNDS = 10;
// Compared against when the username is unknown so response time does not reveal it.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", SALT_ROUNDS);

const notDeleted = { deletedAt: null };

const getPermissions = async (role) => {
  const record = await RolePermission.findOne({ role: role._id }).lean();
  return record?.permissions || [];
};

const login = async ({ username, password }) => {
  const user = await User.findOne({
    username: String(username).trim().toLowerCase(),
    ...notDeleted,
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }],
  })
    .select("+password")
    .populate("role");

  const isMatch = await bcrypt.compare(
    String(password),
    user ? user.password : DUMMY_HASH,
  );
  if (!user || !isMatch) {
    throw new HttpError(401, "Invalid username or password");
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: user.toJSON(),
    permissions: await getPermissions(user.role),
  };
};

const me = async (user) => ({
  user: user.toJSON(),
  permissions: await getPermissions(user.role),
});

const list = async ({ page = 1, limit = 10, search = "" }) => {
  const pageNo = Math.max(parseInt(page, 10) || 1, 1);
  const size = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const filter = { ...notDeleted };
  if (String(search).trim()) {
    const regex = new RegExp(
      String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );
    filter.$or = [{ name: regex }, { username: regex }];
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .populate("role")
      .sort({ name: 1 })
      .skip((pageNo - 1) * size)
      .limit(size),
    User.countDocuments(filter),
  ]);

  return { items, total, page: pageNo, limit: size };
};

const findOrFail = async (id) => {
  const user = await User.findOne({ _id: id, ...notDeleted }).populate("role");
  if (!user) throw new HttpError(404, "User not found");
  return user;
};

const get = (id) => findOrFail(id);

// Only a super admin may hand out the super admin role.
const resolveRole = async (roleId, actor) => {
  const role = await Role.findById(roleId);
  if (!role) throw new HttpError(400, "Role not found");
  if (role.isSuperAdmin && !actor.role.isSuperAdmin) {
    throw new HttpError(403, "Only a super admin can assign this role");
  }
  return role;
};

const create = async (body, actor) => {
  const role = await resolveRole(body.role, actor);
  const user = await User.create({
    name: body.name,
    username: body.username,
    password: await bcrypt.hash(String(body.password), SALT_ROUNDS),
    role: role._id,
    isActive: body.isActive,
    expiresAt: body.expiresAt || null,
  });
  return findOrFail(user._id);
};

const update = async (id, body, actor) => {
  const user = await findOrFail(id);

  if (user.role.isSuperAdmin && !actor.role.isSuperAdmin) {
    throw new HttpError(403, "Only a super admin can modify this user");
  }
  const role = await resolveRole(body.role, actor);

  user.name = body.name;
  user.username = body.username;
  user.role = role._id;
  if (body.isActive !== undefined) user.isActive = body.isActive;
  if (body.expiresAt !== undefined) user.expiresAt = body.expiresAt || null;
  if (body.password) {
    user.password = await bcrypt.hash(String(body.password), SALT_ROUNDS);
  }
  await user.save();
  return findOrFail(id);
};

const remove = async (id, actor) => {
  if (String(actor._id) === String(id)) {
    throw new HttpError(400, "You cannot delete your own account");
  }
  const user = await findOrFail(id);
  if (user.role.isSuperAdmin && !actor.role.isSuperAdmin) {
    throw new HttpError(403, "Only a super admin can delete this user");
  }
  user.deletedAt = new Date();
  user.isActive = false;
  await user.save();
};

module.exports = { login, me, list, get, create, update, remove };
