const express = require("express");
const { render } = require("express/lib/response");
const res = require("express/lib/response");
const router = express.Router();
const db = require("../database");

router.get("/", (req, res) => {
  res.render("links/register");
});

router.post("/", async (req, res) => {
  const { NOMBRE, CORREO, PAIS, FECHA_NACIMIENTO, CONTRASENA, CONFIRMATION } =
    req.body;

  await db.query("SELECT CORREO FROM USUARIOS", function (err, mails, fields) {
    if (err) throw err;
    let error2 = { error: "mostrar" };
    if (validate(mails, CORREO)) {
      res.render("links/register", { error2 });
    } else {
      if (CONTRASENA != CONFIRMATION) {
        // render,
        let error = { error: "mostrar" }
        res.render("links/register", { error })
    
      }
      else {
          const newUser = {
          NOMBRE,
          CORREO,
          PAIS,
          FECHA_NACIMIENTO,
          CONTRASENA
        };
        console.log(newUser);
        await db.query("INSERT INTO USUARIOS set ?", [newUser], function (err, result, fields) {
    
          if (err) throw err;
          console.log(result);
        });
        res.redirect("/mainPage");
      }
    }
  });
});

function validate(mails, newMail) {
  for (const mail of mails) {
    if (mail.CORREO == newMail) {
      return true;
    }
  }
  return false;
}

module.exports = router;
