const axios = require("axios").default;
const cheerio = require("cheerio");
const { CLIENT_PS_MULTI_RESULTS } = require("mysql/lib/protocol/constants/client");

//Funcion asincrona para obtener los datos de un juego apartir de su nombre en concreto
async function getGame(gameName) {
  try {
    const response = await axios.get(
      // "https://api.steampowered.com/ISteamApps/GetAppList/v1/"
      "https://api.steampowered.com/ISteamApps/GetAppList/v2/"
    );
    const appList = response.data.applist.apps;
    const { appid } = appList.find((app) => app.name === gameName);
    // const { appid } = appList.find((app) => (app.name).includes(gameName));
    return appid;
  } catch (error) {
    console.error(error);
  }
}

//Funcion asincrona para objetener los datos especificos de un juego apartir de su id, además de retornar un objeto con los valores necesitados
async function getGameInfo(gameId) {
  //URL de la segunda api para obtener datos detallados de un juego especifico
  try {
    const gameInfo = "https://store.steampowered.com/api/appdetails?appids=";
    let gameResponse = await axios.get(gameInfo + gameId + "&cc=us");
    let game = gameResponse.data;
    return {
      id: gameId,
      name: game[gameId].data.name,
      short_description: game[gameId].data.short_description,
      genres: game[gameId].data.genres,
      header_image: game[gameId].data.header_image,
      developers: game[gameId].data.developers,
      // initial_formatted: parseFloat((game[gameId].data.price_overview.initial_formatted).substring(1, 5)),
      final_formatted: parseFloat(
        game[gameId].data.price_overview.final_formatted.substring(1, 5)
      ),
    };
  } catch (err) {
    console.error(err);
  }
}

async function getSearchList(gameName) {
  try {
    const gameSearch = "https://store.steampowered.com/search/?term=";
    const response = await axios.get(
      gameSearch + gameName
    );
    const gameList = [];
    const $ = cheerio.load(response.data)

    gameList[0] = { id: $(".search_result_row").first().attr("data-ds-appid"), tittle: $(".search_result_row").first().find(".title").text(), image: $(".search_result_row").first().find("img").attr("src") };
     $(".search_result_row").each(function (i, element) {
       var a = $(this);
       gameList[i] = { id: a.attr("data-ds-appid"), tittle: a.find(".title").text(), image: a.find("img").attr("src") }
     })
    return gameList;
  } catch (err) {
    console.error(err);
  }
}
 getSearchList("golf")

module.exports.getGame = getGame;
module.exports.getGameInfo = getGameInfo;
module.exports.getSearchList = getSearchList;
