const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");

//require routes
const users = require(__dirname + "/routes/api/users.js");
const posts = require(__dirname + "/routes/api/posts.js");
const profile = require(__dirname + "/routes/api/profile.js");

//db config
const db = require(__dirname + "/config/keys.js").mongoURI;

//connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("mongoDB connected successfully"))
  .catch((err) =>
    console.log("there is an error connecting to database -> " + err)
  );

//initalize passport
app.use(passport.initialize());

//passport config
//pass (passport) as parameter into passport.js file
require("./config/passport.js")(passport);

//test route
app.get("/", (req, res) => {
  res.send("Hello test");
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//use imported routes modules as
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profile", profile);

const port = process.env.PORT || 3000;

app.listen(port, (req, res) => console.log(`Server started at port ${port}`));
