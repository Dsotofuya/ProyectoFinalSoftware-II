const express = require('express');
const router = express.Router();
const db = require('../database');
const wsSTeam = require('../webScrapingSteam');

// router.get("/:gameName", async (req, res) => {
    router.get("/", async (req, res) => {
    let {gameName} = req.query;
    const list = await wsSTeam.getSearchList(gameName);
    res.render("links/search", { list: list });
});

module.exports = router;