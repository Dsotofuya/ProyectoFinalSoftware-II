const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/", async (req, res) => {
  await db.query(
    "SELECT ID_VIDEOJUEGO, NOMBRE_VIDEOJUEGO, URL_IMAGEN FROM JUEGOS ORDER BY `POPULARIDAD` DESC LIMIT 5",
    function (err, gameInfo, fields) {
      if (err) throw err;
      res.render("links/mainPage", { gameInfo });
    }
  );
});

module.exports = router;