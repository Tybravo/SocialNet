const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");

const User = require('../schemas/UserSchema');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {

    res.status(200).render("register");
})

router.post("/", async (req, res, next) => {
    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;

    var payload = req.body;

    if (firstName && lastName && username && email && password) {
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

                // Create the user and send a response
                User.create(data)
                    .then((user) => {
                        req.session.user = user;
                        return res.redirect("/");
                    })
                    .catch((error) => {
                        console.log("Error creating user: ", error);
                        payload.errorMessage = "Error occurred while creating the user.";
                        res.status(500).render("register", payload);
                    });
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