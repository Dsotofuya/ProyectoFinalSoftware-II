const express = require("express");

var server = express();
server.listen(4445);
server.use(express.json());
server.use((req, res, next) => {
  console.log("Pasa");
  next();
});

// server.all("/registro", (req, res, next) => {
//   console.log("para todas las rutas /registro muestra en consola esto xd.");
//   next();
// });

server.get("/registro/:user", (req, res) => {
  res.send("Testeo inicial del server y pagina inicial");
});

server.post("/registro/:user", (req, res) => {
  console.log(req.params);
  //console.log(req.body);
  res.send("peticion post, acá se cargará el registro de la pagina");
});

// server.delete("/registro/:user", (req, res) => {
//   //console.log(`User ${req.params.user} borrado`);
//   //console.log(req.body);
//   res.send(`User ${req.params.user} borrado`);
//   //res.send('peticion post, acá se cargará el registro de la pagina');
// });

server.put("/registro/:user", (req, res) => {
  res.send("peticion de actualizar, acá se cargará el registro de la pagina");
});

server.delete("/registro/:user", (req, res) => {
  res.send("petición de borrar, acá se cargará el registro de la pagina");
});

server.use(express.static('webapp'));