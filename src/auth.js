const session = require('express-session');
const passport = require('passport');
const uuid = require('uuid');
const { addUser, getUserByID, getUsers } = require('./mockData/users');
const LocalStrategy = require('passport-local').Strategy;

function authenticateUser(req, res, next) {
  passport.authenticate('local', (_, user) => {
    req.login(user, err => err ? res.status(401).send() : res.send(user));
  })(req, res, next);
}

function configureAuth(app) {
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
      const user = getUsers().find(x => x.email === email && x.password === password);
      return done(null, user || false);
    }
  ));

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((userID, done) => {
    const user = getUserByID(userID);
    done(null, user || false);
  });

  const sessionMiddleware = session({ secret: 'secret' });

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  app.post('/login', authenticateUser);

  app.post('/logout', (req, res) => {
    req.logout();
    res.status(200).send();
  });

  app.post('/register', (req, res, next) => {
    const { email, password } = req.headers;
    if (!email || !password) {
      res.status(400).send(`No user or password is set in headers: ${JSON.stringify(req.headers)}`);
      return;
    }
    if (getUsers().find(x => x.email === email)) {
      res.status(400).send('User with this email already exists.');
    } else {
      const newUser = { id: uuid(), email, password };
      addUser(newUser);
      authenticateUser(req, res, next)
    }
  });

  return sessionMiddleware;
}

module.exports = configureAuth;
