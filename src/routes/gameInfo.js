const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/:gameId", async (req, res) => {
  const gameId = req.params.gameId;
  console.log(`The gameId: ${gameId} has been requested`);
  await db.query(
    "SELECT * FROM JUEGOS j, HISTORIAL_JUEGOS hj WHERE j.ID_VIDEOJUEGO = hj.ID_VIDEOJUEGO AND j.ID_VIDEOJUEGO = ?",
    [gameId],
    function (err, gameInfo, fields) {
      if (err) throw err;
      console.log(gameInfo)
      res.render("links/gameInfo", { gameInfo });
    }
  );
});
module.exports = router;
