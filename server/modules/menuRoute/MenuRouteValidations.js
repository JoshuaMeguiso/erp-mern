const { isBlank } = require("../../middleware/validate");

const validateMenuRoute = (body) => {
  const errors = {};
  if (isBlank(body.name)) errors.name = "Name is required";
  if (isBlank(body.route)) errors.route = "Route is required";
  else if (!String(body.route).startsWith("/")) {
    errors.route = "Route must start with /";
  }
  if (
    body.sequence !== undefined &&
    !Number.isFinite(Number(body.sequence))
  ) {
    errors.sequence = "Sequence must be a number";
  }
  return errors;
};

module.exports = { validateMenuRoute };
