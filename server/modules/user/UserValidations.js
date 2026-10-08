const { isBlank } = require("../../middleware/validate");

const MIN_PASSWORD_LENGTH = 8;

const validateLogin = (body) => {
  const errors = {};
  if (isBlank(body.username)) errors.username = "Username is required";
  if (isBlank(body.password)) errors.password = "Password is required";
  return errors;
};

const validateCommon = (body, errors) => {
  if (isBlank(body.name)) errors.name = "Name is required";
  if (isBlank(body.username)) errors.username = "Username is required";
  if (isBlank(body.role)) errors.role = "Role is required";
  if (body.expiresAt && Number.isNaN(Date.parse(body.expiresAt))) {
    errors.expiresAt = "Expiry must be a valid date";
  }
};

const validateCreateUser = (body) => {
  const errors = {};
  validateCommon(body, errors);
  if (isBlank(body.password)) errors.password = "Password is required";
  else if (String(body.password).length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return errors;
};

// Password is optional on update; only validated when provided.
const validateUpdateUser = (body) => {
  const errors = {};
  validateCommon(body, errors);
  if (
    !isBlank(body.password) &&
    String(body.password).length < MIN_PASSWORD_LENGTH
  ) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return errors;
};

module.exports = { validateLogin, validateCreateUser, validateUpdateUser };
