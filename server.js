const fs = require('fs');
const https = require('https');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const allowedUsers = require('./config/allowedUsers.json');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  const email = profile.emails && profile.emails[0].value;
  if (email && allowedUsers.includes(email)) {
    return done(null, { id: profile.id, displayName: profile.displayName, email });
  }
  return done(null, false, { message: 'Unauthorized' });
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const app = express();
app.use(session({ secret: 'change-me', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/');
});
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  res.json(req.user);
});

const port = process.env.PORT || 3000;

try {
  const key = fs.readFileSync('cert/server.key');
  const cert = fs.readFileSync('cert/server.cert');
  https.createServer({ key, cert }, app).listen(port, () => {
    console.log(`HTTPS server running on port ${port}`);
  });
} catch (err) {
  console.warn('HTTPS certificates not found, falling back to HTTP. For secure deployment, place cert/server.key and cert/server.cert.');
  app.listen(port, () => {
    console.log(`HTTP server running on port ${port}`);
  });
}
