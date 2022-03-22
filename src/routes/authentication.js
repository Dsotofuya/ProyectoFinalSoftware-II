const express = require('express');
const res = require('express/lib/response');
const { Passport } = require('passport/lib');
const router = express.Router();

const passport = require('passport');

router.get('/login', (req, res) =>{
    res.render('links/login')
    console.log("aca pasa");
});

router.post('/login', (req, res) =>{
    passport.authenticate('local.login',{
        successRedirect: '/mainPage',
        failureRedirect: '/login',
        failureFlash:true
    })
    res.send('received');
});


module.exports=router;