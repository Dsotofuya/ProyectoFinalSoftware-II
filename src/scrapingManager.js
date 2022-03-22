const wsSTeam = require("./webScrapingSteam.js");
const wsEpic = require("./webScrapingEpic.js");
const wsEneba = require("./webScrapingEneba.js");
const db = require("./database");

//Falta exportar la función scrap game para que sea usada por el modulo de la ruta encargada, para no usar la base de datos en este modulo
//Prueba webscraping
async function scrapGame(gameName) {
  const steamResponse = await wsSTeam.getGameInfo(
    await wsSTeam.getGame(processString(gameName))
  );
  const epicResponse = await wsEpic.getGame(splitSpaces(gameName));
  const enebaResponse = await wsEneba.getGame(gameName);
  console.log("Webscraping steam: ", steamResponse);
  console.log("Webscraping epic: ", epicResponse);
  console.log("Webscraping eneba: ", enebaResponse);

  // console.log(steamResponse.genres)
  return {
    ID_VIDEOJUEGO: steamResponse.id,
    NOMBRE_VIDEOJUEGO: steamResponse.name,
    URL_IMAGEN: steamResponse.header_image,
    DESCRIPCION: steamResponse.short_description,
    DESARROLLADORA: steamResponse.developers[0],
    URL_STEAM:
      "https://store.steampowered.com/app/" +
      steamResponse.id +
      "/" +
      splitSpacesUnder(gameName) +
      "/",
    PRECIO_STEAM: steamResponse.final_formatted,
    URL_EPIC:
      "https://www.epicgames.com/store/es-ES/p/" +
      splitSpaces(gameName).toLowerCase(),
    PRECIO_EPIC: epicResponse.price,
    URL_ENEBA: enebaResponse.url,
    PRECIO_ENEBA: enebaResponse.price,
    POPULARIDAD: 5,
  };
}

async function insertGame(game) {
  await db.query(
    "INSERT INTO JUEGOS set ?",
    [game],
    function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    }
  );
}

async function insertGameGenres(gameName) {
  const steamResponse = await wsSTeam.getGameInfo(
    await wsSTeam.getGame(processString(gameName))
  );
  const genreslist = steamResponse.genres;
  for (let genre of genreslist) {
    let tempGenreGame = {
      ID_VIDEOJUEGO: steamResponse.id,
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

async function insertGenres(gameName) {
  const steamResponse = await wsSTeam.getGameInfo(
    await wsSTeam.getGame(processString(gameName))
  );
  await db.query(
    "SELECT ID_GENERO FROM GENEROS",
    function (err, result, fields) {
      if (err) throw err;
      for (let genre of result) {
        for (let genreSR of steamResponse.genres) {
          if (genre.ID_GENERO == genreSR.id) {
            console.log("genero saltado", genreSR);
            steamResponse.genres.shift();
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

async function insertGameHistoric(gameName) {
  const steamResponse = await wsSTeam.getGameInfo(
    await wsSTeam.getGame(processString(gameName))
  );
  let historicGame = { ID_VIDEOJUEGO: steamResponse.id }
  await db.query(
    "SELECT NOMBRE_VIDEOJUEGO, PRECIO_STEAM, CASE WHEN PRECIO_EPIC = -1 THEN 99999 ELSE PRECIO_EPIC END PRECIO_EPIC_FORMATED, CASE WHEN PRECIO_ENEBA = -1 THEN 99999 ELSE PRECIO_ENEBA END PRECIO_ENEBA_FORMATED FROM JUEGOS  WHERE ID_VIDEOJUEGO = ?",
    [steamResponse.id],
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

function splitSpaces(name) {
  return name.replace(" ", "-");
}

function splitSpacesUnder(name) {
  return name.replace(" ", "_");
}

function separeteString(str) {
  return str.split(" ");
}

function toUpperCaseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function processString(gameName) {
  const arrayWords = separeteString(gameName);
  for (let index = 0; index < arrayWords.length; index++) {
    arrayWords[index] = toUpperCaseFirstLetter(arrayWords[index]);
  }
  return arrayWords.join(" ");
}

async function updateGame(gameId) {

}

async function registerGame(gameName) {
  console.log("Juego: " + gameName, " solcitado")
  const game = await scrapGame(gameName);
  console.log(game);
  await insertGenres(gameName);
  await insertGame(game);
  await insertGameGenres(gameName);
  await insertGameHistoric(gameName);
  console.log("Datos del Juego: " + gameName, " insertados")
}

registerGame("Golf It!");

// module.exports.scrapGame = scrapGame;
// module.exports.insertGame = insertGame;

// barra de busqueda por tecla a la base de datos y si no existe retornar busqueda, generar la tarjeta y dentro de la tarjeta si le da en guardar en la lista de deseados ahí si guarde ese juego en la base de datos