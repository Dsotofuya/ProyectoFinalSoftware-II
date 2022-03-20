const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/", (req, res) => {
  //res.send("Acá irá la pgina de registro de usuario")
  res.render("links/register");
});

router.post("/", async (req, res) => {
    const { NOMBRE, CORREO, PAIS, FECHA_NACIMIENTO, CONTRASENA } = req.body;
    const newUser = {
      NOMBRE,
      CORREO,
      PAIS,
      FECHA_NACIMIENTO,
      CONTRASENA
    };
    console.log(newUser);
   //db.query("SHOW TABLES", function (err, result, fields) {
    await db.query("INSERT INTO USUARIOS set ?", [newUser], function (err, result, fields) {
    if (err) throw err;
    console.log(result);
   });
  res.redirect("/mainPage");
});

module.exports = router;
