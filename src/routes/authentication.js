const express = require('express');
const res = require('express/lib/response');
const { Passport } = require('passport/lib');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

router.get('/login', (req, res) => {
    res.render('links/login')

});

router.post('/login', (req, res, next) => {
    passport.authenticate('local.login', {
        successRedirect: '/mainPage',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});


router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

// router.get('/wishList', isLoggedIn, (req, res) => {
//     res.render('./links/wishList');
// });




module.exports = router;