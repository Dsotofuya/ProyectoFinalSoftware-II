const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
    //res.send("Acá irá la pgina de registro de usuario")
    res.render('links/register')
});

module.exports = router; 