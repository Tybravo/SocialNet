const express = require('express');
const app = express();
const middleware = require('./middleware');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./database');
const session = require('express-session');

// Set view engine and views directory
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Log views directory for debugging
console.log('Views directory:', app.get('views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'bbq chips',
    resave: true,
    saveUninitialized: false,
  })
);

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logoutRoutes');
const postsApiRoute = require('./routes/api/posts');

app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/logout', logoutRoute);
app.use('/api/posts', postsApiRoute);

// Home route
app.get('/', middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: 'Home',
    userLoggedIn: req.session.user,
  };
  res.status(200).render('home', payload);
});

// Monetised route
app.get('/monetised', middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: 'Premium Posts',
    userLoggedIn: req.session.user,
  };
  res.status(200).render('monetised', payload);
});

// Debug route to list files in views directory
const fs = require('fs');
app.get('/debug-views', (req, res) => {
  const viewsDir = path.join(__dirname, 'views');
  fs.readdir(viewsDir, (err, files) => {
    if (err) {
      return res.status(500).send(`Error reading views directory: ${err.message}`);
    }
    res.status(200).send(`Files in views directory: ${files.join(', ')}`);
  });
});

// Vercel serverless export
module.exports = app;

// Server for local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}