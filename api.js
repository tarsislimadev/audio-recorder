var express = require("express");
var router = express.Router();

router.get("/", (req, res) => res.json({ api: "audio recorder" }));

module.exports = router;
