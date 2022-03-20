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
  return {
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
      "https://www.epicgames.com/store/es-ES/p/" + (splitSpaces(gameName).toLowerCase()),
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

module.exports.scrapGame = scrapGame;
module.exports.insertGame = insertGame;

// // scrapGame("borderlands 3");
// async function f1() {
//   const a = await scrapGame("Darkest dungeon");
//   console.log(a);
//   await insertGame(a);
// }
// f1();

// barra de busqueda por tecla a la base de datos y si no existe retornar busqueda, generar la tarjeta y dentro de la tarjeta si le da en guardar en la lista de deseados ahí si guarde ese juego en la base de datos