const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const middleware = require('./middleware');
const bodyParser = require("body-parser");
const mongoose = require("./database");
const session = require("express-session");

// Log app startup
console.log("App starting...");

// Use PORT from environment or default to 3000
const port = process.env.PORT || 3000;

// Vercel sometimes needs process.cwd() for correct path resolution
const viewsPath = path.join(process.cwd(), "views");
app.set("views", viewsPath);
app.set("view engine", "pug");
console.log("Views directory set to:", viewsPath); // Debug views path

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

// Debug route to list views directory contents
app.get('/debug-views', (req, res) => {
    console.log("Accessed /debug-views route"); // Log route access
    const viewsDir = app.get('views');
    fs.readdir(viewsDir, (err, files) => {
        if (err) {
            console.error("Error reading views directory:", err);
            return res.status(500).send(`Error reading views directory: ${err.message}`);
        }
        res.status(200).json({ viewsDir, files });
    });
});

// Only start local server if NOT on Vercel
if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => console.log(`Server listening on port ${port}`));
}

// Log app initialization complete
console.log("App initialized successfully");

// Export app for Vercel
module.exports = app;