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
    console.log(userResult[0].CONTRASENA)
    if (Object.keys(userResult).length !== 0) {
      const validPassword = await helpers.matchPassword(CONTRASENA, userResult[0].CONTRASENA)
      if (validPassword) {
        done(null, user, req.flash('success', 'Welcome ' + userResult[0].NOMBRE));
      } else {
        done(null, false, req.flash('message', 'Incorrect Password'));
      }
    } else {
      return done(null, false, req.flash('message', 'The Username does not exists.'));
    }
  })
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});