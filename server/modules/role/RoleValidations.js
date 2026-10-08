const { isBlank } = require("../../middleware/validate");

// isSuperAdmin is intentionally not accepted from the API; it is set by the seed only.
const validateRole = (body) => {
  const errors = {};
  if (isBlank(body.name)) errors.name = "Name is required";
  return errors;
};

const validateDuplicate = (body) => {
  const errors = {};
  if (isBlank(body.name)) errors.name = "New role name is required";
  return errors;
};

module.exports = { validateRole, validateDuplicate };
