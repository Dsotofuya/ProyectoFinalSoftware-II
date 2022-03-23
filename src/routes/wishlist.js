const express = require('express');
const router = express.Router();
const db = require('../database');


router.get("/", async (req, res) => {
  const userid = req.user.ID_USUARIO;
  await db.query(
    "SELECT j.ID_VIDEOJUEGO, j.NOMBRE_VIDEOJUEGO, j.URL_IMAGEN, ld.NOTIFICACION FROM JUEGOS j, LISTAS_DESEOS ld WHERE j.ID_VIDEOJUEGO = ld.ID_VIDEOJUEGO AND `ID_USUARIO` = ?", [userid],
    function (err, gameInfo, fields) {
      if (err) throw err;
      res.render("links/wishList", { gameInfo });
    }
  );
});

router.get("/delete/:gameId", async (req, res) => {
  let idTemp = req.params
  const userid = req.user.ID_USUARIO;
  console.log("borrando el juego de la lista de deseos : ", idTemp);
  await db.query(
    "DELETE FROM LISTAS_DESEOS WHERE ID_VIDEOJUEGO = ? AND ID_USUARIO = ?", [idTemp.gameId, userid],
    function (err, gameInfo, fields) {
      if (err) throw err;
      res.redirect("/wishList");
    }
  );
});

router.get("/notify/:gameId-:notify", async (req, res) => {
  let idTemp = req.params.gameId
  let notify = req.params.notify
  const userid = req.user.ID_USUARIO;
  if (notify == 0) {
    notify = true
  } else if (notify == 1) {
    notify = false
  }
  await db.query(
    "UPDATE `LISTAS_DESEOS` SET `NOTIFICACION`= ? WHERE `ID_USUARIO` = ? AND `ID_VIDEOJUEGO` = ?", [notify, userid, idTemp],
    function (err, fields) {
      if (err) throw err;
      res.redirect("/wishList");
    }
  );
});


router.post("/:gameId", async (req, res) => {
  const idgame = req.params.gameId
  const user = { ID_USUARIO: req.user.ID_USUARIO, ID_VIDEOJUEGO: parseInt(idgame), NOTIFICACION: false }
  await db.query(
    "INSERT INTO LISTAS_DESEOS set ?", [user], (err, result) => {
      if (err) throw err;
      console.log("juego ", idgame, " del usuario: ", req.user.ID_USUARIO, " agregado")
      res.redirect("/wishList")
    })
});

module.exports = router;