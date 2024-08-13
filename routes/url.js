const express = require("express");

const router = express.Router();
const {
  handleGenerateShortUrl,
  handleUrlAnalytics,
} = require("../controllers/url");

router.post("/", handleGenerateShortUrl);

router.get("/analytics/:shortId", handleUrlAnalytics);

module.exports = router;
