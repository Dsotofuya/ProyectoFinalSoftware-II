const axios = require("axios").default;

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

module.exports.getGame = getGame;
module.exports.getGameInfo = getGameInfo;
