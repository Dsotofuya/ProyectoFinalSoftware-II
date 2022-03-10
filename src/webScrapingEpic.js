const axios = require("axios").default;
const cheerio = require("cheerio");

async function getGame(gameName) {
  try {
    const response = await axios.get(
      "https://epicgames-db.info/en-US/p/" + gameName
    );
    const $ = cheerio.load(response.data);
    
    const a = $("tbody  > tr:nth-child(20) ").text();
    console.log( a);
    // console.log($("td [class=p-1]").text());
    //   $("div .border-b").each((i, element) => {
    //      if ($("td .p-1").text() == "United States of America") {
    //         console.log('Precio actual: ',$("td .p-1"), ':')
    //      }
    //   }); 
} catch (error) {
    console.error(error, " Este juego no existe en esta pagina");
  }
}



getGame("borderlands-3");