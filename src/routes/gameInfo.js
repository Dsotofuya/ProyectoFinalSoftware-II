const express = require("express");
const { send } = require("express/lib/response");
const router = express.Router();
const db = require("../database");
const scrapingManager = require("../scrapingManager")


router.get("/:gameId", async (req, res) => {
  const gameId = req.params.gameId;
  console.log(`The gameId: ${gameId} has been requested`);
  db.query("SELECT * FROM `JUEGOS` WHERE `ID_VIDEOJUEGO` = ?", [gameId], async function (err, gameExist, fields) {
    if (err) throw err;
    const isEmpty = Object.keys(gameExist).length === 0;
    if (isEmpty) {
      await scrapingManager.registerGame(gameId);
      await db.query("SELECT * FROM JUEGOS j, HISTORIAL_JUEGOS hj WHERE j.ID_VIDEOJUEGO = hj.ID_VIDEOJUEGO AND j.ID_VIDEOJUEGO = ?", [gameId],
        async function (error, gameInfo) {
          if (error)
            throw error;
          console.log(gameInfo[0]);
          res.render("links/gameInfo", { gameInfo });
        }
      );
    } else {
      console.log(gameExist[0].NOMBRE_VIDEOJUEGO);
      const updatedGame = await scrapingManager.scrapGame(gameExist[0].NOMBRE_VIDEOJUEGO);
      await db.query("UPDATE `JUEGOS` SET `PRECIO_STEAM`= ?,`PRECIO_EPIC`= ? ,`PRECIO_ENEBA`= ?,POPULARIDAD=POPULARIDAD+1 WHERE `ID_VIDEOJUEGO` = ?", [updatedGame.PRECIO_STEAM, updatedGame.PRECIO_EPIC, updatedGame.PRECIO_ENEBA, gameId]);
      await db.query("SELECT PRECIO FROM HISTORIAL_JUEGOS WHERE ID_VIDEOJUEGO  = ?", [gameId], async function (err3, lowerActualPrice) {
        if (err3) throw err3;
        await db.query(
          "SELECT NOMBRE_VIDEOJUEGO, PRECIO_STEAM, CASE WHEN PRECIO_EPIC = -1 THEN 99999 ELSE PRECIO_EPIC END PRECIO_EPIC_FORMATED, CASE WHEN PRECIO_ENEBA = -1 THEN 99999 ELSE PRECIO_ENEBA END PRECIO_ENEBA_FORMATED FROM JUEGOS  WHERE ID_VIDEOJUEGO = ?",
          [gameId],
          async function (err2, result) {
            if (err2)
              throw err2;
            const minPrice = Math.min(result[0].PRECIO_STEAM, result[0].PRECIO_EPIC_FORMATED, result[0].PRECIO_ENEBA_FORMATED, lowerActualPrice[0].PRECIO);
            if (result[0].PRECIO_STEAM == minPrice) {
              await db.query("UPDATE `HISTORIAL_JUEGOS` SET TIENDA`= ?, `PRECIO`= ? WHERE `ID_VIDEOJUEGO` = ?", ["Steam", minPrice, gameId]);
            } else if (result[0].PRECIO_EPIC_FORMATED == minPrice) {
              await db.query("UPDATE `HISTORIAL_JUEGOS` SET TIENDA`= ?, `PRECIO`= ? WHERE `ID_VIDEOJUEGO` = ?", ["Epic Store", minPrice, gameId]);
            } else if (result[0].PRECIO_ENEBA_FORMATED == minPrice) {
              await db.query("UPDATE `HISTORIAL_JUEGOS` SET TIENDA`= ?, `PRECIO`= ? WHERE `ID_VIDEOJUEGO` = ?", ["Eneba", minPrice, gameId]);
            } else if (lowerActualPrice[0].PRECIO == minPrice) {
              console.log("historico del juego ", gameId, " no ha cambiado");
            }
            await db.query("SELECT * FROM JUEGOS j, HISTORIAL_JUEGOS hj WHERE j.ID_VIDEOJUEGO = hj.ID_VIDEOJUEGO AND j.ID_VIDEOJUEGO = ?", [gameId],
              async function (error, gameInfo) {
                if (error)
                  throw error;
                res.render("links/gameInfo", { gameInfo });
              }
            );
          });
      });
    }
  })
});

module.exports = router;