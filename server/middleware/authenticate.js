const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/constants");
const User = require("../modules/user/UserModel");
const { HttpError } = require("./errorHandler");

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new HttpError(401, "Authentication required");
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }

  const user = await User.findOne({
    _id: payload.id,
    deletedAt: null,
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }],
  }).populate("role");

  if (!user || !user.role) {
    throw new HttpError(401, "Account is not available");
  }

  req.user = user;
  next();
};

module.exports = authenticate;
