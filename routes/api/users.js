const express = require("express");
const User = require("../../models/user.model.js");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = require("../../config/keys").secret;
const passport = require("passport");
const { session } = require("passport");

const router = express.Router();

validateRegisterationInput = require("../../validation/register.validation");
validateLoginInput = require("../../validation/login.validation");

// @route   GET api/users/test
// @desc    Tests users route
// @access   public
router.get("/test", (req, res) => {
  res.json({ msg: "user works" });
});

router.get("/test/image", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

router.post("/test/image", (req, res) => {
  console.log(req.url);
});

// post request for registeration
// @route   GET api/users/register
// @desc    sends form data to db
// @access   public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterationInput(req.body);
  console.log("here" + req.body.email);
  //check if there is error
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        console.log(req.body.email);
        return res.status(400).json({ email: "Email already in use." });
      } else {
        const myAvatar = gravatar.url(req.body.email, {
          s: "200",
          r: "pg",
          d: "mm",
        });
        const newUser = new User({
          name: req.body.name,
          password: req.body.password,
          email: req.body.email,
          avatar: myAvatar,
        });
        //console.log(req.body.email);
        //hash and salt password before sending
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save((err, user) => {
              if (err) {
                console.log("error while saving password -> " + err);
              } else {
                res.json(user);
              }
            });
          });
        });
      }
    })
    .catch((err) => console.log("there is an error finding email:  ->" + err));
});

//post request for login
// @route   GET api/users/login
// @desc    login user / return jwt web token
// @access   public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //check if there is error
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    } else {
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          //create a payload
          const payload = { id: user.id, name: user.name, avatar: user.avatar };
          //generate jwt web token
          jwt.sign(payload, key, (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          });
        } else {
          return res.status(400).json({ password: "Password was incorrect" });
        }
      });
    }
  });
});

//post request for a private test route
// @route   GET api/users/current
// @desc    test private route using passport
// @access   private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const jwt_user = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    };
    res.json(jwt_user);
  }
);

module.exports = router;
