const express = require("express");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const { validate } = require("../../middleware/validate");
const { ACCESS } = require("../../config/constants");
const controller = require("./RolePermissionController");
const {
  validatePermissions,
  validateRoutePermission,
} = require("./RolePermissionValidations");

const router = express.Router();
const ROUTE = "/role-permissions";

router.use(authenticate);

router.get("/:roleId", authorize(ROUTE, ACCESS.VIEW), controller.getByRole);
router.put(
  "/:roleId",
  authorize(ROUTE, ACCESS.UPDATE),
  validate(validatePermissions),
  controller.setPermissions,
);
router.put(
  "/:roleId/route",
  authorize(ROUTE, ACCESS.UPDATE),
  validate(validateRoutePermission),
  controller.setRoutePermission,
);

module.exports = router;
