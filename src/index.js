const express = require("express");
const morgan = require("morgan");
const {engine} = require('express-handlebars');
const path = require("path");

//Inicializaciones
const server = express();

//Settings
server.set("port", process.env.PORT || 4445);
// Se guarda la direccion de la carpeta 'views' en el atributo del servidor "views"
server.set("views", path.join(__dirname, "views"));
//Se define la configuración para handlebars
server.engine(
  ".hbs",
  engine({ 
    //se escoje el nombre de la pagina default que estará en la carpeta views y subcarpeta layouts
    defaultlayout: "main",
    //Se concatena la ruta de la carpeta views con la carpeta layouts
    layoutsDir: path.join(server.get("views"), "layout"),
    partialDir: path.join(server.get("views"), "partials"),
    //Se define que la extención de los archivos no será ".handlebars", si no hbs
    extname: ".hbs",
    //Como handlebars requiere hacer procesos por aparte se referirá a que hará todo en el archivo handlebars en la carpeta lib
    helpers: require("./lib/handlebars")
  })
);
//Se le dice al servidor que usará el view engine de handlebars que se configuró arriba (linea16-27)
server.set("view engine", ".hbs");

//Middlewares
server.use(morgan("short"));
//Este metodo es para indiciar que solo se recibiran datos en formatos string, nada de imagenes
server.use(express.urlencoded({ extended: false }));
//Este midleware sirve para enviar y consumir jsons
server.use(express.json());

//Global Variables
server.use((req, res, next) => {
  next();
});

//Routes
server.use(module.require("./routes"));
server.use(module.require("./routes/login"));
server.use(module.require("./routes/register"));
server.use(module.require("./routes/gameInfo"));
server.use(module.require("./routes/wishlist"));

//Public
server.use(express.static(path.join(__dirname, 'public')));

//Start server
server.listen(server.get("port"), () => {
  console.log("Server init on port", server.get("port"));
});
