const express = require('express');
const router = express.Router();
const db = require('../database');

router.get("/", (req, res) => {
    res.render("links/mainPage");
  });

module.exports = router;