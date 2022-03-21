const express = require("express");
const { render } = require("express/lib/response");
const res = require("express/lib/response");
const router = express.Router();
const db = require("../database");

// function verificarPasswords() {
//   pass1 = res.getElementById(CONTRASENA);
//   pass2 = res.getElementById(CONFIRMATION);

//   // Verificamos si las constraseñas no coinciden
//   if (pass1.value != pass2.value) {
//     // Si las constraseñas no coinciden mostramos un mensaje
//     res.getElementById("error").classList.add("mostrar");
//     res.render("links/register");
//   }
//   else {

//     // Si las contraseñas coinciden ocultamos el mensaje de error
//     document.getElementById("error").classList.remove("mostrar");

//     // Mostramos un mensaje mencionando que las Contraseñas coinciden
//     document.getElementById("ok").classList.remove("ocultar");

//     // Desabilitamos el botón de login
//     document.getElementById("login").disabled = true;
//     return true;
//   }
// }

router.get("/", (req, res) => {
  //res.send("Acá irá la pgina de registro de usuario")
  res.render("links/register");
});



router.post("/", async (req, res) => {

  const { NOMBRE, CORREO, PAIS, FECHA_NACIMIENTO, CONTRASENA, CONFIRMATION } = req.body;
  if(CONTRASENA!=CONFIRMATION){
    // render,
    let error = {error:"mostrar"}
    res.render("links/register", {error})

  }else{

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
    }
});

module.exports = router;
