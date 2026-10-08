const express = require("express");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");
const { validate } = require("../../middleware/validate");
const { ACCESS } = require("../../config/constants");
const controller = require("./UserController");
const {
  validateLogin,
  validateCreateUser,
  validateUpdateUser,
} = require("./UserValidations");

const router = express.Router();
const ROUTE = "/users";

router.post("/login", validate(validateLogin), controller.login);

router.use(authenticate);

router.get("/me", controller.me);
router.get("/", authorize(ROUTE, ACCESS.VIEW), controller.list);
router.get("/:id", authorize(ROUTE, ACCESS.VIEW), controller.get);
router.post(
  "/",
  authorize(ROUTE, ACCESS.ADD),
  validate(validateCreateUser),
  controller.create,
);
router.put(
  "/:id",
  authorize(ROUTE, ACCESS.UPDATE),
  validate(validateUpdateUser),
  controller.update,
);
router.delete("/:id", authorize(ROUTE, ACCESS.DELETE), controller.remove);

module.exports = router;
