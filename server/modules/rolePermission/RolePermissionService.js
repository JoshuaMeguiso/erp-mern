const RolePermission = require("./RolePermissionModel");
const Role = require("../role/RoleModel");
const MenuRoute = require("../menuRoute/MenuRouteModel");
const { HttpError } = require("../../middleware/errorHandler");

const assertRoleExists = async (roleId) => {
  if (!(await Role.exists({ _id: roleId }))) {
    throw new HttpError(404, "Role not found");
  }
};

const assertRoutesExist = async (routes) => {
  const known = await MenuRoute.find({ route: { $in: routes } }).distinct(
    "route",
  );
  const unknown = routes.filter((r) => !known.includes(r));
  if (unknown.length > 0) {
    throw new HttpError(400, `Unknown routes: ${unknown.join(", ")}`);
  }
};

const normalize = (entries) => {
  const byRoute = new Map();
  for (const { route, access } of entries) {
    byRoute.set(route, [...new Set(access)]);
  }
  return [...byRoute].map(([route, access]) => ({ route, access }));
};

const getByRole = async (roleId) => {
  await assertRoleExists(roleId);
  const record = await RolePermission.findOne({ role: roleId }).lean();
  return record || { role: roleId, permissions: [] };
};

const setPermissions = async (roleId, permissions) => {
  await assertRoleExists(roleId);
  const entries = normalize(permissions);
  await assertRoutesExist(entries.map((e) => e.route));
  return RolePermission.findOneAndUpdate(
    { role: roleId },
    { $set: { permissions: entries } },
    { upsert: true, returnDocument: "after", runValidators: true },
  );
};

// Sets the access list of a single route, keeping the rest of the role's permissions.
const setRoutePermission = async (roleId, { route, access }) => {
  const current = await getByRole(roleId);
  const others = current.permissions.filter((p) => p.route !== route);
  return setPermissions(roleId, [...others, { route, access }]);
};

module.exports = { getByRole, setPermissions, setRoutePermission };
