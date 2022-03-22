const req = require('express/lib/request');
const Passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

Passport.use('local.sigup', new LocalStrategy({
    usernameField :'CORREO',
    passwordField: 'CONTRASENA',
    passReqToCallback : true
}, async(req, CORREO, CONTRASENA, done) =>{
    console.log(req.body);
}));