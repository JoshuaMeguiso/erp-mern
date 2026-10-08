const express = require("express");
const connectDB = require("./config/db");

const app = express();
const { PORT } = require("./config/constants");

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
