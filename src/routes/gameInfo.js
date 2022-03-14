const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/:gameId", async (req, res) => {
  const gameId = req.params.gameId;
  console.log(`The gameId: ${gameId} has been requested`);
  await db.query(
    "SELECT * FROM JUEGOS WHERE ID_VIDEOJUEGO = ?",
    [gameId],
    function (err, gameInfo, fields) {
      if (err) throw err;
      res.render("links/gameInfo", { gameInfo });
    }
  );
});
module.exports = router;
