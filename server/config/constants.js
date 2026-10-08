const config = {
  PORT:
    process.env.production?.PORT ||
    process.env.uat?.PORT ||
    process.env.local?.PORT ||
    3000,
  NODE_ENV:
    process.env.production?.NODE_ENV ||
    process.env.uat?.NODE_ENV ||
    process.env.local?.NODE_ENV ||
    "development",
  MONGO_URI:
    process.env.production?.MONGO_URI ||
    process.env.uat?.MONGO_URI ||
    process.env.local?.MONGO_URI ||
    "mongodb://127.0.0.1:27017/erp-mern",
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
};

if (!config.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set (see server/.env.local)");
}

const ACCESS = Object.freeze({
  VIEW: "View",
  ADD: "Add",
  UPDATE: "Update",
  DELETE: "Delete",
  PRINT: "Print",
  APPROVE: "Approve",
  CANCEL: "Cancel",
  OPEN: "Open",
  VERIFY: "Verify",
  AUDIT: "Audit",
});

module.exports = config;
module.exports.ACCESS = ACCESS;
