const fs = require("fs");
const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const { PORT } = require("./config/constants");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// modules/<camelCase>/<Name>Routes.js  ->  /api/<kebab-case>s
const toKebab = (name) => name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

const modulesDir = path.join(__dirname, "modules");
for (const dir of fs.readdirSync(modulesDir)) {
  const routesFile = fs
    .readdirSync(path.join(modulesDir, dir))
    .find((file) => file.endsWith("Routes.js"));
  if (!routesFile) continue;

  app.use(`/api/${toKebab(dir)}s`, require(path.join(modulesDir, dir, routesFile)));
}

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
