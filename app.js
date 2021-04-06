//jshint esversion:6
//use express, body, ejs, mongoose
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
//const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

//console.log(process.env.API_KEY);
//setup local database
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

//create mongoose Schema for user credentials
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


//const secret = "Thisisourlittlesecret.";



//use schema for new model
const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

//take user credentials from register page and post it to your database
app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash
    });


    //if the user is successfully saved and there is no error, than the "secrets" page will be rendered
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });



});

//check if user credentials are already in database
app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          // result == true
          if (result === true) {
            res.render("secrets");
          }
        });
      }
    }

  });


});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
