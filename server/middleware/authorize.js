const RolePermission = require("../modules/rolePermission/RolePermissionModel");
const { HttpError } = require("./errorHandler");

// Use after `authenticate`: authorize("/users", ACCESS.VIEW)
const authorize = (route, access) => async (req, res, next) => {
  const role = req.user?.role;
  if (!role) throw new HttpError(401, "Authentication required");

  if (role.isSuperAdmin) return next();

  const record = await RolePermission.findOne({ role: role._id }).lean();
  const entry = record?.permissions.find((p) => p.route === route);

  if (!entry || !entry.access.includes(access)) {
    throw new HttpError(403, "You do not have permission to do this");
  }
  next();
};

module.exports = authorize;
