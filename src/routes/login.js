const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/", (req, res) => {
    //res.send("Acá irá la pgina de registro de usuario")
    res.render("links/login");
});

router.post("/", (req, res) => {
    const { CORREO, CONTRASENA } = req.body;
    const newUser = {
        CORREO,
        CONTRASENA
    };
    // console.log(newUser);
    //    //db.query("SHOW TABLES", function (err, result, fields) {
    //     await db.query("INSERT INTO USUARIOS set ?", [newUser], function (err, result, fields) {
    //     if (err) throw err;
    //     console.log(result);
    //    });
    res.redirect("/mainPage");
});

module.exports = router;