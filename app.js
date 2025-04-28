const express = require('express');
const app = express();
const path = require('path');
const middleware = require('./middleware');
const bodyParser = require("body-parser");
const mongoose = require("./database");
const session = require("express-session");

// Use PORT from environment or default to 3000
const port = process.env.PORT || 3000;

// Vercel sometimes needs process.cwd() for correct path resolution
const viewsPath = path.join(process.cwd(), "views");
app.set("views", viewsPath);
app.set("view engine", "pug");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "bbq chips",
    resave: true,
    saveUninitialized: false
}));

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logoutRoutes');

// API routes
const postsApiRoute = require('./routes/api/posts');

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);

app.use("/api/posts", postsApiRoute);

// Pages
app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.session.user
    };
    res.status(200).render("home", payload);
});

app.get("/monetised", middleware.requireLogin, (req, res, next) => {
    var payload = {
        pageTitle: "Premium Posts",
        userLoggedIn: req.session.user
    };
    res.status(200).render("monetised", payload);
});

// Only start local server if NOT on Vercel
if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => console.log(`Server listening on port ${port}`));
}

// Export app for Vercel
module.exports = app;
