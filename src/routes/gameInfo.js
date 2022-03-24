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
      let gameres = await scrapingManager.scrapGameById(gameId)
      await insertGame(gameres)
      await insertGenres(gameId)
      await insertGameGenres(gameId)
      await insertGameHistoric(gameId)
      let gameInfo = await consultGame(gameId)
      res.render("links/gameInfo", { gameInfo });
    } else {
      // res.send("xd")
    }
  })
});

async function insertGame(game) {
  await db.query("INSERT INTO JUEGOS SET ?", [game])
}

async function insertGenres(gameId) {
  let gameRes = await scrapingManager.scrapGameGenresById(gameId)
  await db.query(
    "SELECT ID_GENERO FROM GENEROS",
    function (err, result, fields) {
      if (err) throw err;
      for (let genre of result) {
        for (let genreSR of gameRes) {
          if (genre.ID_GENERO == genreSR.id) {
            gameRes.shift();
            result.shift();
          } else {
            let tempGenre = {
              ID_GENERO: parseInt(genreSR.id),
              NOMBRE_GENERO: genreSR.description,
            };
            db.query("INSERT INTO GENEROS set ?", tempGenre);
          }
        }
      }
    }
  );
}

async function insertGameGenres(gameId) {
  let gameRes = await scrapingManager.scrapGameGenresById(gameId)
  for (let genre of gameRes) {
    let tempGenreGame = {
      ID_VIDEOJUEGO: gameId,
      ID_GENERO: parseInt(genre.id),
    };
    await db.query(
      "INSERT INTO GENEROS_JUEGOS set ?",
      [tempGenreGame],
      function (err, result, fields) {
        if (err) throw err;
        console.log(result);
      }
    );
  }
}

async function insertGameHistoric(gameId) {
  let historicGame = { ID_VIDEOJUEGO: gameId }
  await db.query(
    "SELECT NOMBRE_VIDEOJUEGO, PRECIO_STEAM, CASE WHEN PRECIO_EPIC = -1 THEN 99999 ELSE PRECIO_EPIC END PRECIO_EPIC_FORMATED, CASE WHEN PRECIO_ENEBA = -1 THEN 99999 ELSE PRECIO_ENEBA END PRECIO_ENEBA_FORMATED FROM JUEGOS  WHERE ID_VIDEOJUEGO = ?",
    [gameId],
    async function (err, result, fields) {
      if (err) throw err;
      const minPrice = Math.min(result[0].PRECIO_STEAM, result[0].PRECIO_EPIC_FORMATED, result[0].PRECIO_ENEBA_FORMATED);
      if (result[0].PRECIO_STEAM == minPrice) {
        historicGame.TIENDA = "Steam";
        historicGame.PRECIO = minPrice;
      } else if (result[0].PRECIO_EPIC_FORMATED == minPrice) {
        historicGame.TIENDA = "Epic Store";
        historicGame.PRECIO = minPrice;
      } else if (result[0].PRECIO_ENEBA_FORMATED == minPrice) {
        historicGame.TIENDA = "Eneba";
        historicGame.PRECIO = minPrice;
      }
      await db.query("INSERT INTO HISTORIAL_JUEGOS set ?", [historicGame], function (error, resultQuery, field) {
        if (err) throw err;
        console.log(resultQuery);
      })
    }
  );
}

async function consultGame(gameId) {
  await db.query("SELECT * FROM JUEGOS j, HISTORIAL_JUEGOS hj WHERE j.ID_VIDEOJUEGO = hj.ID_VIDEOJUEGO AND j.ID_VIDEOJUEGO = ?", [gameId],
    async function (error, gameInfo) {
      if (error) throw error;
      console.log(gameInfo[0])
      // return gameInfo
    }
  );
}


//  await updateGame(NOMBRE_VIDEOJUEGO, gameId, res);
// // res.send("XD")

// await updateGame(gameExist[0].NOMBRE_VIDEOJUEGO, gameId, res);

// async function updateGame(gameName, gameId, res) {
//   const updatedGame = await scrapingManager.scrapGame(gameName);
//   await db.query("UPDATE `JUEGOS` SET `PRECIO_STEAM`= ?,`PRECIO_EPIC`= ? ,`PRECIO_ENEBA`= ?,POPULARIDAD=POPULARIDAD+1 WHERE `ID_VIDEOJUEGO` = ?", [updatedGame.PRECIO_STEAM, updatedGame.PRECIO_EPIC, updatedGame.PRECIO_ENEBA, gameId]);
//   await db.query("SELECT PRECIO FROM HISTORIAL_JUEGOS WHERE ID_VIDEOJUEGO  = ?", [gameId], async function (err3, lowerActualPrice) {
//     if (err3) throw err3;
//     await db.query(
//       "SELECT NOMBRE_VIDEOJUEGO, PRECIO_STEAM, CASE WHEN PRECIO_EPIC = -1 THEN 99999 ELSE PRECIO_EPIC END PRECIO_EPIC_FORMATED, CASE WHEN PRECIO_ENEBA = -1 THEN 99999 ELSE PRECIO_ENEBA END PRECIO_ENEBA_FORMATED FROM JUEGOS  WHERE ID_VIDEOJUEGO = ?",
//       [gameId],
//       async function (err2, result) {
//         if (err2)
//           throw err2;
//         const minPrice = Math.min(result[0].PRECIO_STEAM, result[0].PRECIO_EPIC_FORMATED, result[0].PRECIO_ENEBA_FORMATED, lowerActualPrice[0].PRECIO);
//         if (result[0].PRECIO_STEAM == minPrice) {
//           await db.query("UPDATE `HISTORIAL_JUEGOS` SET TIENDA`= ?, `PRECIO`= ? WHERE `ID_VIDEOJUEGO` = ?", ["Steam", minPrice, gameId]);
//         } else if (result[0].PRECIO_EPIC_FORMATED == minPrice) {
//           await db.query("UPDATE `HISTORIAL_JUEGOS` SET TIENDA`= ?, `PRECIO`= ? WHERE `ID_VIDEOJUEGO` = ?", ["Epic Store", minPrice, gameId]);
//         } else if (result[0].PRECIO_ENEBA_FORMATED == minPrice) {
//           await db.query("UPDATE `HISTORIAL_JUEGOS` SET TIENDA`= ?, `PRECIO`= ? WHERE `ID_VIDEOJUEGO` = ?", ["Eneba", minPrice, gameId]);
//         } else if (lowerActualPrice[0].PRECIO == minPrice) {
//           console.log("historico del juego ", gameId, " no ha cambiado");
//         }
//         await db.query("SELECT * FROM JUEGOS j, HISTORIAL_JUEGOS hj WHERE j.ID_VIDEOJUEGO = hj.ID_VIDEOJUEGO AND j.ID_VIDEOJUEGO = ?", [gameId],
//           async function (error, gameInfo) {
//             if (error)
//               throw error;
//             res.render("links/gameInfo", { gameInfo });
//           }
//         );
//       });
//   });
// }

module.exports = router;