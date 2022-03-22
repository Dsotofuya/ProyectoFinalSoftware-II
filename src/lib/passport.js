const req = require('express/lib/request');
const Passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('../database');

passport.use('local.register', new LocalStrategy({
  usernameField: 'NOMBRE',
  passwordField: 'CONTRASENA',
  passReqToCallback: true
}, async (req, username, password, done) => {

  const { fullname } = req.body;
  let newUser = {
    fullname,
    username,
    password
  };
  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  const result = await pool.query('INSERT INTO users SET ? ', newUser);
  newUser.id = result.insertId;
  return done(null, newUser);
}));

Passport.use('local.login', new LocalStrategy({
  mailField: 'CORREO',
  passwordField: 'CONTRASENA',
  passReqToCallback: true
}, async (req, CORREO, CONTRASENA, done) => {
  const rows = await db.query('SELECT * FROM USUARIOS WHERE CORREO = ?', [CORREO]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(CONTRASENA, user.CONTRASENA)
    if (validPassword) {
      done(null, user, req.flash('success', 'Welcome ' + user.NOMBRE));
    } else {
      done(null, false, req.flash('message', 'Incorrect Password'));
    }
  } else {
    return done(null, false, req.flash('message', 'The Username does not exists.'));
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});