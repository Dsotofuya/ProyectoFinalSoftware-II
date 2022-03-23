const express = require("express");
const { send } = require("express/lib/response");
const router = express.Router();
const db = require("../database");
const scrapingManager = require("../scrapingManager")


router.get("/:gameId", async (req, res) => {
  const gameId = req.params.gameId;
  console.log(`The gameId: ${gameId} has been requested`);
  await db.query("SELECT * FROM `JUEGOS` WHERE `ID_VIDEOJUEGO` = ?", [gameId], async function (err, gameExist, fields) {
    const isEmpty = Object.keys(gameExist).length === 0;
    if (isEmpty) {
      res.send("xDDDDdd")
    } else {
      const updatedGame = await scrapingManager.scrapGame(gameExist[0].NOMBRE_VIDEOJUEGO)
      await db.query("UPDATE `JUEGOS` SET `PRECIO_STEAM`= ?,`PRECIO_EPIC`= ? ,`PRECIO_ENEBA`= ?,POPULARIDAD=POPULARIDAD+1 WHERE `ID_VIDEOJUEGO` = ?", [updatedGame.PRECIO_STEAM, updatedGame.PRECIO_EPIC, updatedGame.PRECIO_ENEBA, gameId])
      await db.query(
        "SELECT * FROM JUEGOS j, HISTORIAL_JUEGOS hj WHERE j.ID_VIDEOJUEGO = hj.ID_VIDEOJUEGO AND j.ID_VIDEOJUEGO = ?",
        [gameId],
        function (error, gameInfo) {
          if (error)
            throw err;
          console.log(gameInfo);
          res.render("links/gameInfo", { gameInfo });
        }
      );
    }
  })
});
module.exports = router;