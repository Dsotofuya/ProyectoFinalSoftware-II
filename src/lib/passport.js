const req = require('express/lib/request');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.login', new LocalStrategy({
  usernameField: 'CORREO',
  passwordField: 'CONTRASENA',
  passReqToCallback: true
}, async (req, CORREO, CONTRASENA, done) => {
  await db.query('SELECT * FROM USUARIOS WHERE CORREO = ?', [CORREO], async function (error, userResult) {
    const user = userResult[0];
    if (Object.keys(userResult).length !== 0) {
      // const validPassword = await helpers.matchPassword(CONTRASENA, userResult[0].CONTRASENA);
      const validPassword = true;
      if (validPassword) {
        console.log("sisi");
        done(null, user, req.flash('success', 'Welcome ' + userResult[0].NOMBRE));
      } else {
        console.log("sino");
        done(null, false, req.flash('message', 'Incorrect Password'));
      }
    } else {
      return done(null, false, req.flash('message', 'The Username does not exists.'));
    }
  })
}));

passport.serializeUser((user, done) => {
  done(null, user.ID_USUARIO);
});

passport.deserializeUser(async (ID_USUARIO, done) => {
  await db.query('SELECT * FROM USUARIOS WHERE ID_USUARIO = ?', [ID_USUARIO], async function (error, resultado){
    done(null, resultado[0]);
  })
});