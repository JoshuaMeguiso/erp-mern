const service = require("./RolePermissionService");

const getByRole = async (req, res) =>
  res.json(await service.getByRole(req.params.roleId));

const setPermissions = async (req, res) =>
  res.json(
    await service.setPermissions(req.params.roleId, req.body.permissions),
  );

const setRoutePermission = async (req, res) =>
  res.json(await service.setRoutePermission(req.params.roleId, req.body));

module.exports = { getByRole, setPermissions, setRoutePermission };
