const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/", (req, res) => {
  res.render("links/login");
});

router.post("/", async (req, res) => {
  const { CORREO, CONTRASENA } = req.body;
  await db.query(
    "SELECT CONTRASENA FROM USUARIOS WHERE CORREO = ?",
    [CORREO],
    function (err, result, fields) {
      if (err) throw err;
      console.log();
      if (result[0].CONTRASENA == CONTRASENA) {
        console.log("logeado");
        res.redirect("/mainPage");
      } else {
        let error = { error: "mostrar" };
        res.render("links/login", { error });
      }
    }
  );
});

module.exports = router;
