const ws = require("./webScrapingSteam.js");


//Prueba webscraping steam
async function f1() {
  var x = await ws.getGame("Halo Infinite (Campaign)");
  var y = await ws.getGameInfo(x);
  console.log(y);
}
f1();

// Epic store main url: https://www.epicgames.com/store/es-ES/p/borderlands-3