const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const path = require("path");
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const { database } = require('./keys')
const passport = require('passport');

//Inicializaciones
const server = express();
require('/lib/passport');

//Settings
server.set("port", process.env.PORT || 4445);


// Se guarda la direccion de la carpeta 'views' en el atributo del servidor "views"
server.set("views", path.join(__dirname, "views"));
//Se define la configuración para handlebars
server.engine(".hbs", engine({
  //se escoje el nombre de la pagina default que estará en la carpeta views y subcarpeta layouts
  defaultlayout: "main",
  //Se concatena la ruta de la carpeta views con la carpeta layouts
  layoutsDir: path.join(server.get("views"), "layouts"),
  partialDir: path.join(server.get("views"), "partials"),
  //Se define que la extención de los archivos no será ".handlebars", si no hbs
  extname: ".hbs",
  //Como handlebars requiere hacer procesos por aparte se referirá a que hará todo en el archivo handlebars en la carpeta lib
  helpers: require("./lib/handlebars"),
})
);
//Se le dice al servidor que usará el view engine de handlebars que se configuró arriba (linea16-27)
server.set("view engine", ".hbs");


//Middlewares
// Administrador de sesiones
server.use(session({
  secret: 'appMySqlNodeSession',
  resave: false,
  saveUninitialized: false,
  store: new mysqlStore(database)
}
))
server.use(morgan("short"));
//Este metodo es para indiciar que solo se recibiran datos en formatos string, nada de imagenes
server.use(express.urlencoded({ extended: false }));
//Este midleware sirve para enviar y consumir jsons
server.use(express.json());

server.use(passport.initialize());
server.use(passport.session());

//Global Variables
server.use((req, res, next) => {
  // app.locals.user = req.user;
  next();
});

//Routes
server.use(module.require("./routes/authentication"));
server.use("/login", module.require("./routes/login"));
server.use("/register", module.require("./routes/register"));
server.use("/gameInfo", module.require("./routes/gameInfo"));
server.use("/wishList", module.require("./routes/wishlist"));
server.use("/mainPage", module.require("./routes/mainPage"));
// server.use("/login", module.require("./routes/login"));
server.use("/search", module.require("./routes/search"));

//Public
server.use(express.static(path.join(__dirname, "public")));

//Start server
server.listen(server.get("port"), () => {
  console.log("Server init on port", server.get("port"));
});
