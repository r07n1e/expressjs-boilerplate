const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from API V1");
});

module.exports = router;
