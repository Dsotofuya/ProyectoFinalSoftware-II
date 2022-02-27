const mysql = require("mysql");
const { database } = require("./keys");
const { promisify } = require("util");

//se crea la conexion con la base de datos en base al objeto creado en el archivo keys
const pool = mysql.createPool(database);

//Se manejan errores en caso que la base de datos rechaze la conexión o si conecta
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("DATABASE CONNECTION WAS CLOSED");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("DATABASE HAS TO MANY CONNECTIONS");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("DATABASE CONNECTION HAS REFUSED");
    }
  }

  if (connection) {
    connection.release();
    console.log("DataBase is connected");
  }
});

// Promisify Pool Querys
pool.queery = promisify(pool.query);

module.exports = pool;
