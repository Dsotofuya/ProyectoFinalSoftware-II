const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/", (req, res) => {
    //res.send("Acá irá la pgina de registro de usuario")
    res.render("links/login");
});

router.post("/", async (req, res) => {
    const { CORREO, CONTRASENA } = req.body;


    //db.query("SHOW TABLES", function (err, result, fields) {
    await db.query("SELECT CONTRASENA FROM USUARIOS WHERE CORREO = ?", [CORREO], function (err, result, fields) {
        if (err) throw err;

        if (result.CONTRASENA == CONTRASENA) {
            res.redirect("/mainPage");
        }
        else {
            let error = { error: "mostrar" }
        }
    });
});



module.exports = router;