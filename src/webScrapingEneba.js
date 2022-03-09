const axios = require("axios").default;
const cheerio = require("cheerio");

async function getGame(gameName) {
  try {
    const response = await axios.get(
      "https://www.eneba.com/latam/store?text=" + gameName
    );
    const $ = cheerio.load(response.data);
     var gameDetails = {}
      // gameList = {};
    $("div .uy1qit").each((i, element) => {
      gameDetails.name = $(element).find("div .lirayz").text();
      gameDetails.price = $(element).find("span .L5ErLT").text();
      // gameList.gameDetails = gameDetails;
      console.log(gameDetails);
    });
  } catch (error) {
    console.error(error);
  }
}

getGame("borderlands");
// barra de busqueda por tecla a la base de datos y si no existe retornar busqueda, generar la tarjeta y dentro de la tarjeta si le da en guardar en la lista de deseados ahí si guarde ese juego en la base de datos
