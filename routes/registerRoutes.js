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
  res.status(200).render("register");
});

router.post("/", async (req, res, next) => {
  var username = req.body.username.trim();
  var email = req.body.email.trim();
  var password = req.body.password;

  var payload = req.body;

  if (username && email && password) {
    try {
      var user = await User.findOne({
        $or: [
          { username: username },
          { email: email }
        ]
      });

      if (user == null) {
        // No user found
        var data = req.body;

        data.password = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await User.create(data);
        req.session.user = newUser;
        // console.log('Registration successful - Session user set:', req.session.user);
        // Explicitly save the session before redirecting
        req.session.save((err) => {
          if (err) {
            console.error('Session save error after registration:', err);
            payload.errorMessage = "Session error.";
            return res.status(500).render("register", payload);
          }
          //console.log('Session saved after registration, redirecting to /');
          return res.redirect("/");
        });
        return; // Prevent further execution
      } else {
        
        // User found
        if (email == user.email) {
          payload.errorMessage = "Email already in use.";
        } else {
          payload.errorMessage = "Username already in use.";
        }
        res.status(200).render("register", payload);
      }
    } catch (error) {
      console.log("Error finding user: ", error);
      payload.errorMessage = "Something went wrong.";
      res.status(500).render("register", payload);
    }
  } else {
    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(400).render("register", payload);
  }
});

module.exports = router;