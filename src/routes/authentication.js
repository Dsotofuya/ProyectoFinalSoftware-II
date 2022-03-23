const express = require('express');
const res = require('express/lib/response');
const { Passport } = require('passport/lib');
const router = express.Router();
const passport = require('passport');

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


// router.get('/logout', (req, res) => {
//     req.logOut();
//     res.redirect('/');
// });

// router.get('/profile', isLoggedIn, (req, res) => {
//     res.render('profile');
// });


module.exports = router;