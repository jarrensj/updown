var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");
var configs = require('./configs.js');

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url = configs.url;

var recaptcha_secret_key = configs.recaptcha_secret_key;
var ObjectId = require('mongodb').ObjectID;


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH, OPTIONS");
  next();
});

app.get("/", function(req, res){
  res.send("hi");
});

// register user
app.post("/register", function(req, res){
  console.log(req.body.captcha);
  if(
   req.body.captcha === undefined ||
   req.body.captcha === '' ||
   req.body.captcha === null
  ) {
    console.log("false");
    res.send(false); // failed captcha
    return;
  }

  const verifyUrl = 'https://google.com/recaptcha/api/siteverify?secret=' + recaptcha_secret_key + '&response=' +req.body.captcha + '&remoteip=' + req.connection.remoteAddress;  var email = req.body.email;

  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);
    if(body.success !== undefined && !body.success) {
      console.log("false");
      res.json({"success": false, "message": "You failed the capatcha. Please refresh page."});
      return;
    }

    // valid captcha
    var username = req.body.username;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;

    console.log("Register");
    if(!username) {
      console.log("tried to register without a username");
      return false;
    }

    MongoClient.connect(url, function(err, database){
      console.log("Connected successfully to mongodb: Register user. ");
      var db = database.db("feelings");
      var query = {"username": username};
      db.collection("users").find(query).toArray(function(err, user){
        if(user.length) {
          // check if username is taken
          console.log("Username is taken!");
          res.json({"success": false, "message": "username is taken"});
        }
        else {
          db.collection("users").insertOne({
            email: email,
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName
          });
          database.close();
          console.log(username + " has been registered!");
          res.send(true);
          console.log("Database connection is closed: Register User. ")
        }
      });
    });
  })
});

// post feeling
app.post("/feelings", verifyToken, function(req, res){
  var username = req.body.username;
  var feelings = req.body.feelings;
  var dateTime = req.body.dateTime;
  var object = {dateTime: dateTime, feelings: feelings};
  var query = {"username": username};
  MongoClient.connect(url, function(err, database){
    var db = database.db("feelings");
    console.log("Connected successfully to mongodb: Post feelings. ");
    // check if allowed to access that user's information
    db.collection("users").find(query).toArray(function(err, user){
      if(req.token == user[0].token) {
        // user has permission to access this user
        console.log("user has permission to access this user");
        record(username, object);
        res.send({username, object})
      }
      else {
        console.log("doesn't have permission");
      }
    });
    database.close();
    console.log("Database connection is closed: Post feelings for " + username);
  });
});

// push to array
function record(username, object) {
  MongoClient.connect(url, function(err, database) {
    var db = database.db("feelings");
    db.collection("users").update(
      {"username":username},
      {$push: {log: object}}
    );
    database.close();
  });
}

// get user by username
app.get('/user/:username', verifyToken, function (req, res) {
  var username = req.params.username;
  var query = {"username": username};
  MongoClient.connect(url, function(err, database){
    var db = database.db("feelings");
    console.log("Connected successfully to mongodb: get user " + username);
    db.collection("users").find(query).toArray(function(err, user){
      // check if allowed to access that user's information
      if(req.token == user[0].token) {
        // user has permission to access this user
        console.log("user has permission to access this user");
        res.send(user);
      }
      else {
        console.log("doesn't have permission");
        res.send("you don't have permission");
      }
    });
    database.close();
    console.log("Database connection is closed: get user " + username)
  });
});

app.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var query = {"username": username};

  MongoClient.connect(url, function(err, database){
    var db = database.db("feelings");
    console.log("Connected successfully to mongodb: Login: " + username);
    db.collection("users").find(query).toArray(function(err, user){
      if(!user.length) {
        console.log("user not found");
        res.send(false);
      }
      else {
        if(user[0].password == password) {
          // correct password
          console.log("correct password");
          // generate random number
          var token = Math.floor(Math.random() * 8192) + 1;
          // save that random number on the user
          db.collection("users").update(query, {$set: {token: token}}, function(err, result) {
            if(err) {
              console.log(err);
              console.log("error updating user token");
            }
            else {
              console.log("updated user token");
            }
          });
          res.send({user, token});
          database.close();
        }
        else {
          // incorrect password
          res.send(false);
          console.log("incorrect password");
        }
      }
    });
    console.log("Database connection is closed: Login: " + username)
  });
});

// current status of the day
app.get('/user/:username/today', function (req, res) {
  var username = req.params.username;
  var query = {"username": username};
  MongoClient.connect(url, function(err, database){
    var db = database.db("feelings");
    console.log("Connected successfully to mongodb: get user " + username);
    db.collection("users").find(query).toArray(function(err, user){
      if(!user.length) {
        console.log("user not found");
        res.send(false);
      }
      else {
        res.send(feelingToday(user));
      }
    });
    database.close();
    console.log("Database connection is closed: get user " + username)
  });
});

function feelingToday(user){
  // if empty log
  if(!user[0].log) {
    return false;
  }
  // get the latest feeling
  var logLength = user[0].log.length;
  var latest = user[0].log[logLength-1];
  // check if that feeling is today
  let today = new Date();
  var test = new Date(latest.dateTime);
  if(test.getMonth() === today.getMonth() && test.getDate() === today.getDate() && test.getFullYear() === today.getFullYear()) {
    return latest;
  } else {
    return false;
  }
}

// update the user's log
app.put('/feelings', verifyToken, function (req, res) {
  var username = req.body.username;
  var feelings = req.body.feelings;
  var dateTime = req.body.dateTime;
  var numToken = Number(req.token);
  var query = {
    "username": username,
    "log.dateTime": req.body.dateTime,
    "token": numToken
  }
  MongoClient.connect(url, function(err, database){
    var db = database.db("feelings");
    console.log("Connected successfully to mongodb: PUT user log:" + username);
    db.collection("users").update(query,{$set:{"log.$.feelings":feelings}}, function(err, user){
      res.send(true);
    });
    database.close();
    console.log("Database connection is closed: PUT user log: " + username)
  });
});

// update password
app.put('/user/:username/settings/change-password', verifyToken, function (req, res) {
  var username = req.params.username;
  var password = req.body.password;
  var newPassword = req.body.newPassword;
  var numToken = Number(req.token);
  var query = {
    "username": username,
    "password": password,
    "token": numToken
  }
  MongoClient.connect(url, function(err, database){
    var db = database.db("feelings");
    console.log("Connected successfully to mongodb: update user password:" + username);
    // updates password of that query
    db.collection("users").update(query,{$set:{password:newPassword}}, function(err, user){
      res.send(true);
    });
    database.close();
    console.log("Database connection is closed: update user password: " + username)
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
