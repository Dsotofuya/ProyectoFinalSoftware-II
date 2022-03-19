const axios = require("axios").default;
const cheerio = require("cheerio");

async function getGame(gameName) {
  try {
    const response = await axios.get(
      "https://www.eneba.com/latam/store?text=" + gameName
    );
    let gameDetails = { name: "", url: "", price: "" };
    const $ = cheerio.load(response.data);
    gameDetails.name = $("div .uy1qit").find("div .lirayz").first().text();
    gameDetails.url = ("https://www.eneba.com" + $("div .uy1qit").find("div .oSVLlh").attr("href"));
    gameDetails.price = parseFloat(
      $("div .uy1qit")
        .find("span .L5ErLT")
        .first()
        .text()
        .substring(0, 5)
        .replace(",", ".")
    );
    return gameDetails;
  } catch (error) {
    console.error(error);
  }
}

module.exports.getGame = getGame;
