const express = require("express");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const { validate } = require("../../middleware/validate");
const { ACCESS } = require("../../config/constants");
const controller = require("./RoleController");
const { validateRole, validateDuplicate } = require("./RoleValidations");

const router = express.Router();
const ROUTE = "/roles";

router.use(authenticate);

router.get("/", authorize(ROUTE, ACCESS.VIEW), controller.list);
router.get("/:id", authorize(ROUTE, ACCESS.VIEW), controller.get);
router.post(
  "/",
  authorize(ROUTE, ACCESS.ADD),
  validate(validateRole),
  controller.create,
);
router.post(
  "/:id/duplicate",
  authorize(ROUTE, ACCESS.ADD),
  validate(validateDuplicate),
  controller.duplicate,
);
router.put(
  "/:id",
  authorize(ROUTE, ACCESS.UPDATE),
  validate(validateRole),
  controller.update,
);
router.delete("/:id", authorize(ROUTE, ACCESS.DELETE), controller.remove);

module.exports = router;
