const axios = require("axios").default;
const cheerio = require("cheerio");

async function getGame(gameName) {
  try {
    const response = await axios.get(
      "https://epicgames-db.info/en-US/p/" + gameName
    );
    const $ = cheerio.load(response.data);
    for (let i = 1; i < 27; i++) {
      if (
        $(`tbody  > tr:nth-child(${i})`)
          .text()
          .includes("United States of America")
      ) {
        return converScrapToObjetct($(`tbody  > tr:nth-child(${i})`).text());
      }
    }
  } catch (error) {
    console.error(error, "Este juego no existe en esta pagina");
  }
}

async function converScrapToObjetct(text) {
  var y = text
    .replace(/\r?\n|\r/g, " ")
    .split(" ")
    .join("");
  var x = {
    price: parseFloat(y.substring(22, 27)),
    lowerPrice: parseFloat(y.substring(34, 39)),
  };
  console.log(x);
}

getGame("borderlands-3")

getGame("darkest-dungeon")