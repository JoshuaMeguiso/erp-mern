const { ACCESS } = require("../../config/constants");

const VALID_ACCESS = Object.values(ACCESS);

const checkEntry = (entry) => {
  if (!entry || typeof entry.route !== "string" || !entry.route.startsWith("/")) {
    return "Each permission needs a route starting with /";
  }
  if (!Array.isArray(entry.access)) {
    return `Access for ${entry.route} must be an array`;
  }
  const invalid = entry.access.filter((a) => !VALID_ACCESS.includes(a));
  if (invalid.length > 0) {
    return `Invalid access for ${entry.route}: ${invalid.join(", ")}`;
  }
  return null;
};

const validatePermissions = (body) => {
  const errors = {};
  if (!Array.isArray(body.permissions)) {
    errors.permissions = "Permissions must be an array";
    return errors;
  }
  for (const entry of body.permissions) {
    const message = checkEntry(entry);
    if (message) {
      errors.permissions = message;
      break;
    }
  }
  return errors;
};

const validateRoutePermission = (body) => {
  const message = checkEntry(body);
  return message ? { permission: message } : {};
};

module.exports = { validatePermissions, validateRoutePermission };
