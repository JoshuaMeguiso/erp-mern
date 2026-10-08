const { HttpError } = require("./errorHandler");

// Wraps a module's validation function: (body) => { field: "message" }
const validate = (check) => (req, res, next) => {
  const errors = check(req.body || {});
  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, "Validation failed", errors);
  }
  next();
};

const isBlank = (value) =>
  value === undefined || value === null || String(value).trim() === "";

module.exports = { validate, isBlank };
