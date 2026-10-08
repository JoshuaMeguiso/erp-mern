const express = require("express");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const { validate } = require("../../middleware/validate");
const { ACCESS } = require("../../config/constants");
const controller = require("./MenuRouteController");
const { validateMenuRoute } = require("./MenuRouteValidations");

const router = express.Router();
const ROUTE = "/menu-routes";

router.use(authenticate);

router.get("/", authorize(ROUTE, ACCESS.VIEW), controller.list);
router.post(
  "/",
  authorize(ROUTE, ACCESS.ADD),
  validate(validateMenuRoute),
  controller.create,
);
router.put(
  "/:id",
  authorize(ROUTE, ACCESS.UPDATE),
  validate(validateMenuRoute),
  controller.update,
);
router.delete("/:id", authorize(ROUTE, ACCESS.DELETE), controller.remove);

module.exports = router;
