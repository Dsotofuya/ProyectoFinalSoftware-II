const express = require('express');
const router = express.Router();
const db = require('../database');

// router.get("/:gameName", async (req, res) => {
    router.get("/", async (req, res) => {
    let {gameName} = req.query;
    console.log(gameName);
    res.send("Hola")
    // await db.query(
    //   "UPDATE `LISTAS_DESEOS` SET `NOTIFICACION`= false WHERE `ID_USUARIO` = 1 AND `ID_VIDEOJUEGO` = ?", [idTemp.gameId],
    //   function (err, fields) {
    //     if (err) throw err;
    //     res.redirect("/wishList");
    //   }
    // );
});

module.exports = router;