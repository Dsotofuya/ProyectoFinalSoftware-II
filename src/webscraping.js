const axios = require("axios").default;

async function getGame(gameName) {
  try {
    const response = await axios.get(
      "https://api.steampowered.com/ISteamApps/GetAppList/v2/"
    );
    const appList = response.data.applist.apps;
    const { appid } = appList.find((app) => app.name === gameName);
    console.log(appid);
    return appid;
  } catch (error) {
    console.error(error);
  }
}

async function getGameInfo(gameId) {
  //URL de la segunda api para obtener datos detallados de un juego especifico
  try {
    const gameInfo = "https://store.steampowered.com/api/appdetails?appids=";
    let gameResponse = await axios.get(gameInfo + gameId);
    let game = gameResponse.data;
    /*return*/ const gameObject = {
      name: game[gameId].data.name,
      genres: game[gameId].data.genres,
      header_image: game[gameId].data.header_image,
      developers: game[gameId].data.developers,
      initial_formatted: game[gameId].data.price_overview.initial_formatted,
      final_formatted: game[gameId].data.price_overview.final_formatted,
    };
    console.log(gameObject);
    return gameObject;
  } catch (err) {
    console.error(err);
  }
}
// getGame("Halo Infinite (Campaign)");
console.log(await getGame("Halo Infinite (Campaign)"));
// console.log(getGameInfo(a));

console.log(await getGameInfo(1351060));
// const test = await
// console.log(test);

// console.log(getGame("Halo Infinite (Campaign)"));
// console.log(getGameInfo("1351060"));
