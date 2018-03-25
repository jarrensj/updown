var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var configs = require('./configs.js');

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url = configs.url;

var ObjectId = require('mongodb').ObjectID;

const jwt = require('jsonwebtoken');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set("view engine", "ejs");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH, OPTIONS");
  next();
});

app.get("/", function(req, res){
  res.send("landing");
});

// get all users
app.get("/users", function(req,res){
  res.header('Access-Control-Allow-Origin','*');
  MongoClient.connect(url, function(err, db){
    console.log("Connected successfully to mongodb: Get all users. ");
    db.collection("users").find({}).toArray(function(err, allUsers){
      res.send(allUsers);
    });
    db.close();
    console.log("Database connection is closed: Get all users. ")
  });
});

// register user
app.post("/register", function(req, res){
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  // check if username is already taken


  MongoClient.connect(url, function(err, db){
    console.log("Connected successfully to mongodb: Register user. ");
    db.collection("users").insertOne({
      email: email,
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName
    });
    db.close();
    console.log("Database connection is closed: Register User. ")
    res.send(username + "has been registered!")
  });
});

// post feeling
app.post("/feeling", verifyToken, function(req, res){
  var username = req.body.username;
  var feeling = req.body.feeling;
  var dateTime = req.body.dateTime;
  var object = {dateTime: dateTime, feeling: feeling};
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      MongoClient.connect(url, function(err, db){
        console.log("Connected successfully to mongodb: Post feeling. ");
        db.collection("users").update(
          {"username": username},
          {$push: {log: object}}
        );
        db.close();
        console.log("Database connection is closed: Post feeling for " + username)
        res.send("Posted feeling for " + username);
      });
    }
  });
});

// get user by email
app.get('/user/:username', verifyToken, function (req, res) {
  var username = req.params.username;
  var query = {"username": username};
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      // valid token
      MongoClient.connect(url, function(err, db){
        console.log("Connected successfully to mongodb: get user " + username);
        db.collection("users").find(query).toArray(function(err, user){
          // check if allowed to access that user's information
          res.send(user);
        });
        db.close();
        console.log("Database connection is closed: get user " + username)
      });
    }
  })
});

app.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var query = {"username": username};

  MongoClient.connect(url, function(err, db){
    console.log("Connected successfully to mongodb: Login: " + username);
    db.collection("users").find(query).toArray(function(err, user){
      if(!user.length) {
        console.log("user not found");
        res.send("user not found");
      }
      else if (user) {
        console.log("found user");
          if(user[0].password == password) {
            console.log("correct password");
            jwt.sign({user:user}, 'secretkey', (err, token) => {
              res.send({user, token});
            });
          }
          else {
            console.log("incorrect password");
          }
      }
    });
    db.close();

    console.log("Database connection is closed: Login: " + username)
  });
});

// format of token
// Authorization: Bearer <access_token>
function verifyToken(req, res, next) {
  // get auth header value
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
    // split at the space
    const bearer = bearerHeader.split(' ');
    // get token from array
    const bearerToken = bearer[1];
    // set the token
    req.token = bearerToken;
    // next
    next();

  } else {
    res.sendStatus(403);
  }
}


app.listen(3000,function(){
  console.log("Listening on port 3000");
});
