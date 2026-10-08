class HttpError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

const notFound = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

// Express 5 forwards rejected promises from async handlers here.
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof HttpError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path}` });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "value";
    return res.status(409).json({ message: `${field} already exists` });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON body" });
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};

module.exports = { HttpError, notFound, errorHandler };
