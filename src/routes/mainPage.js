const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/", async (req, res) => {
  const user = req.user
  if (user == undefined) {
    await db.query(
      "SELECT ID_VIDEOJUEGO, NOMBRE_VIDEOJUEGO, URL_IMAGEN FROM `JUEGOS` ORDER BY `JUEGOS`.`POPULARIDAD` DESC LIMIT 0,5",
      function (err, gameInfo, fields) {
        if (err) throw err;
        res.render("links/mainPage", { gameInfo });
      }
    );
  } else {
    let dataUser = {}
    await db.query(
      "SELECT ID_VIDEOJUEGO, NOMBRE_VIDEOJUEGO, URL_IMAGEN FROM `JUEGOS` ORDER BY `JUEGOS`.`POPULARIDAD` DESC LIMIT 0,5",
      function (err, gamepopular) {
        if (err) throw err;
        console.log("Juegos populares", gamepopular);
        res.render("links/mainPage", { gamepopular })
      })
    await db.query("SELECT gj.ID_GENERO, g.NOMBRE_GENERO , gj.FRECUENCIA FROM `GENEROS_USUARIOS` gj, GENEROS g WHERE gj.ID_GENERO = g.ID_GENERO AND `ID_USUARIO` = ?",
      [user.ID_USUARIO], async function (err, genreExist) {
        if (err) throw err;
        const isEmpty = Object.keys(genreExist).length === 0;
        if (isEmpty) {
          // res.render("links/mainPage", { dataUser });
        } else {
          for (const genre of genreExist) {
            // dataUser.genres = genre;
            await db.query(
              "SELECT j.ID_VIDEOJUEGO, j.NOMBRE_VIDEOJUEGO, j.URL_IMAGEN FROM JUEGOS j , GENEROS_JUEGOS gj WHERE j.ID_VIDEOJUEGO = gj.ID_VIDEOJUEGO AND gj.ID_GENERO = ? LIMIT 0, 5;", [genre.ID_GENERO], function (errr, gameInfo) {
                if (errr) throw err;
                // dataUser.genre = genre;
                console.log(genre)
                for (const game of gameInfo) {
                  console.log(game)
                }
                // res.render("links/mainPage", { gameInfo });
              }
            )
          }
        }
      })
  }
});

module.exports = router;
