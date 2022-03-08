//Importación de modulo de webscraping
import fetch from "node-fetch";
const scraping = {};

// Se saca los datos en formato JSON del api de steam
async function getGame(gameName) {
  const response = await fetch(
    "https://api.steampowered.com/ISteamApps/GetAppList/v2/"
  );
  const data = await response.json();
  // Se filtran los datos apartir del JSON recibido
  const appList = data.applist.apps;
  //Funcion asincrona para obtener los datos de un juego apartir de su nombre en concreto
  const { appid } = appList.find((app) => app.name === gameName);
  return appid;
}

//Funcion asincrona para objetener los datos especificos de un juego apartir de su id, además de retornar un objeto con los valores necesitados
 async function getGameInfo (gameId) {
  //URL de la segunda api para obtener datos detallados de un juego especifico
  const gameInfo = "https://store.steampowered.com/api/appdetails?appids=";
  let gameResponse = await fetch(gameInfo + gameId);
  let game = await gameResponse.json();
  return {
    name: game[gameId].data.name,
    genres: game[gameId].data.genres,
    header_image: game[gameId].data.header_image,
    developers: game[gameId].data.developers,
    initial_formatted: game[gameId].data.price_overview.initial_formatted,
    final_formatted: game[gameId].data.price_overview.final_formatted,
  };
}

console.log(await getGameInfo(await getGame("Halo Infinite (Campaign)")));