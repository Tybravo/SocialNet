const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const User = require('../schemas/UserSchema');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
  res.status(200).render("login");
});

router.post("/", async (req, res, next) => {
  var payload = req.body;

  if (req.body.logUsername && req.body.logPassword) {
    var user = await User.findOne({
      $or: [
        { username: req.body.logUsername },
        { email: req.body.logUsername }
      ]
    })
    .catch((error) => {
      console.log('Login error:', error);
      payload.errorMessage = "Something went wrong.";
      res.status(200).render("login", payload);
    });

    if (user != null) {
      var result = await bcrypt.compare(req.body.logPassword, user.password);

      if (result === true) {
        req.session.user = user;
        console.log('Login successful - Session user set:', req.session.user);
        // Explicitly save the session before redirecting
        req.session.save((err) => {
          if (err) {
            console.error('Session save error after login:', err);
            payload.errorMessage = "Session error.";
            return res.status(500).render("login", payload);
          }
          console.log('Session saved after login, redirecting to /');
          return res.redirect("/");
        });
        return; // Prevent further execution
      }
    }

    payload.errorMessage = "Login credentials incorrect.";
    return res.status(200).render("login", payload);
  }

  payload.errorMessage = "Make sure each field has a valid value.";
  res.status(200).render("login");
});

module.exports = router;