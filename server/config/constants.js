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
};

module.exports = config;
