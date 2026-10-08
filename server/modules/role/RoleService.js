const Role = require("./RoleModel");
const User = require("../user/UserModel");
const RolePermission = require("../rolePermission/RolePermissionModel");
const { HttpError } = require("../../middleware/errorHandler");

const findOrFail = async (id) => {
  const role = await Role.findById(id);
  if (!role) throw new HttpError(404, "Role not found");
  return role;
};

const list = () => Role.find().sort({ name: 1 });

const get = (id) => findOrFail(id);

const create = ({ name, description }) => Role.create({ name, description });

const update = async (id, { name, description }) => {
  const role = await findOrFail(id);
  if (name !== undefined) role.name = name;
  if (description !== undefined) role.description = description;
  return role.save();
};

const remove = async (id) => {
  const role = await findOrFail(id);
  if (role.isSuperAdmin) {
    throw new HttpError(400, "The super admin role cannot be deleted");
  }
  if (await User.exists({ role: role._id, deletedAt: null })) {
    throw new HttpError(409, "Role is still assigned to users");
  }
  await RolePermission.deleteOne({ role: role._id });
  await role.deleteOne();
};

const duplicate = async (id, { name }) => {
  const source = await findOrFail(id);
  const copy = await Role.create({
    name,
    description: source.description,
  });
  const permission = await RolePermission.findOne({ role: source._id }).lean();
  if (permission) {
    await RolePermission.create({
      role: copy._id,
      permissions: permission.permissions.map(({ route, access }) => ({
        route,
        access,
      })),
    });
  }
  return copy;
};

module.exports = { list, get, create, update, remove, duplicate };
