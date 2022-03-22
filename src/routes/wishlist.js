const express = require('express');
const router = express.Router();
const db = require('../database');

router.get("/", async (req, res) => {
  await db.query(
    "SELECT j.ID_VIDEOJUEGO, j.NOMBRE_VIDEOJUEGO, j.URL_IMAGEN, ld.NOTIFICACION FROM JUEGOS j, LISTAS_DESEOS ld WHERE j.ID_VIDEOJUEGO =  ld.ID_VIDEOJUEGO",
    function (err, gameInfo, fields) {
      if (err) throw err;
      res.render("links/wishList", { gameInfo });
    }
  );
});

router.get("/delete/:gameId", async (req, res) => {
  let idTemp = req.params
  console.log("borrando el juego de la lista de deseos : ", idTemp);
  await db.query(
    "DELETE FROM LISTAS_DESEOS WHERE ID_VIDEOJUEGO = ?", [idTemp.gameId],
    function (err, gameInfo, fields) {
      if (err) throw err;
      res.redirect("/wishList");
    }
  );
});

router.get("/notify/:gameId", async (req, res) => {
  let idTemp = req.params
  console.log(idTemp);
  await db.query(
    "UPDATE `LISTAS_DESEOS` SET `NOTIFICACION`= false WHERE `ID_USUARIO` = 1 AND `ID_VIDEOJUEGO` = ?", [idTemp.gameId],
    function (err, fields) {
      if (err) throw err;
      res.redirect("/wishList");
    }
  );
});

module.exports = router;