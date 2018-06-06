var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var configs = require('./configs.js');

var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url = configs.url;

var ObjectId = require('mongodb').ObjectID;

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var myBucket = 'whiteshoeswednesday';

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

// get all users
/*
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
*/

// register user
app.post("/register", function(req, res){
  var email = req.body.email;
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
    var db = database.db("whiteshoeswednesday");
    var query = {"username": username};
    db.collection("users").find(query).toArray(function(err, user){
      if(user.length) {
        // check if username is taken
        console.log("Username is taken!");
        res.send(false);
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
});

// post feeling
app.post("/feeling", verifyToken, function(req, res){
  var username = req.body.username;
  var feeling = req.body.feeling;
  var dateTime = req.body.dateTime;
  var object = {dateTime: dateTime, feeling: feeling};
  var query = {"username": username};
  MongoClient.connect(url, function(err, database){
    var db = database.db("whiteshoeswednesday");
    console.log("Connected successfully to mongodb: Post feeling. ");
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
    console.log("Database connection is closed: Post feeling for " + username);
  });
});

// save feeling
function record(username, object) {
  MongoClient.connect(url, function(err, database) {
    var db = database.db("whiteshoeswednesday");
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
    var db = database.db("whiteshoeswednesday");
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
    var db = database.db("whiteshoeswednesday");
    console.log("Connected successfully to mongodb: Login: " + username);
    db.collection("users").find(query).toArray(function(err, user){
      if(!user.length) {
        console.log("user not found");
        res.send("user not found");
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
          console.log("incorrect password");
        }
      }
    });
    console.log("Database connection is closed: Login: " + username)
  });
});

// current feeling of the day
app.get('/:username/today', verifyToken, function (req, res) {
  var username = req.params.username;
  var query = {"username": username};
  MongoClient.connect(url, function(err, database){
    var db = database.db("whiteshoeswednesday");
    console.log("Connected successfully to mongodb: get user " + username);
    db.collection("users").find(query).toArray(function(err, user){
      // check if allowed to access that user's information
      if(req.token == user[0].token) {
        // user has permission to access this user
        console.log("user has permission to access this user");
        res.send(feelingToday(user));
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

function feelingToday(user){
  // if empty log
  if(!user[0].log) {
    return false;
  }
  // get the latest feeling
  var logLength = user[0].log.length;
  var feeling = user[0].log[logLength-1];
  // check if that feeling is today
  let today = new Date();
  var test = new Date(feeling.dateTime);
  if(test.getMonth() === today.getMonth() && test.getDate() === today.getDate() && test.getFullYear() === today.getFullYear()) {
    return feeling;
  } else {
    return false;
  }
}

// update the user's feeling
app.put('/feeling', verifyToken, function (req, res) {
  var username = req.body.username;
  var feeling = req.body.feeling;
  var dateTime = req.body.dateTime;
  var numToken = Number(req.token);
  var query = {
    "username": username,
    "log.dateTime": req.body.dateTime,
    "token": numToken
  }
  MongoClient.connect(url, function(err, database){
    var db = database.db("whiteshoeswednesday");
    console.log("Connected successfully to mongodb: PUT user log:" + username);
    db.collection("users").update(query,{$set:{"log.$.feeling":feeling}}, function(err, user){
      res.send(true);
    });
    database.close();
    console.log("Database connection is closed: PUT user log: " + username)
  });
});

app.get('/photos', function(req,res) {
  var params = {
    Bucket: myBucket,
    MaxKeys: 100
  };
  s3.listObjects(params, function(err, data) {
    if(err) console.log(err, err.stack); // an error occured
    else {
      console.log(data); // successful response
      // filenames only
      var filenames = [];
      for(let i = 0; i < data.Contents.length; ++i) {
        filenames.push(data.Contents[i].Key);
      }
      res.send(filenames);
    }
  })
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
