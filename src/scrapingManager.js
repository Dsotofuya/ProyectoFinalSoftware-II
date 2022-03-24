const wsSTeam = require("./webScrapingSteam.js");
const wsEpic = require("./webScrapingEpic.js");
const wsEneba = require("./webScrapingEneba.js");

async function scrapGameById(gameId) {
  let gameSteam = await wsSTeam.getGameInfo(gameId)
  if (gameSteam.id !== 99999) {
    const enebaResponse = await wsEneba.getGame((processName(gameSteam.name.split(/[^\w\s]/).join(""))).split(" ").join("%20"));
    const epicResponse = await wsEpic.getGame((processName(gameSteam.name.split(/[^\w\s]/).join(""))).split(" ").join("-"));
    return {
      ID_VIDEOJUEGO: parseInt(gameSteam.id),
      NOMBRE_VIDEOJUEGO: gameSteam.name,
      URL_IMAGEN: gameSteam.header_image,
      DESCRIPCION: gameSteam.short_description,
      DESARROLLADORA: gameSteam.developers[0],
      URL_STEAM: gameSteam.steam_url,
      PRECIO_STEAM: gameSteam.final_formatted,
      URL_EPIC: "https://www.epicgames.com/store/es-ES/p/" +
        ((processName(gameSteam.name.split(/[^\w\s]/).join(""))).split(" ").join("-")),
      PRECIO_EPIC: epicResponse.price,
      URL_ENEBA: enebaResponse.url,
      PRECIO_ENEBA: enebaResponse.price,
      POPULARIDAD: 5,
    };
  }
}


async function scrapGameGenresById(gameId) {
  let gameSteam = await wsSTeam.getGameInfo(gameId)
  if (gameSteam.id !== 99999) {
    return gameSteam.genres
  }
}

//  async function f() {
//    console.log(await scrapGameGenresById(401920))
//   //  console.log(await scrapGameById(262060))
//   //  console.log(await scrapGameById(214490))
//  }
//  f()

function processName(name) {
  return name.toLowerCase();
}

module.exports.scrapGameById = scrapGameById;
module.exports.scrapGameGenresById = scrapGameGenresById;