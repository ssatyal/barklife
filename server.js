var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var app = express();
var bodyParser = require("body-parser");
var ObjectId = require('mongodb').ObjectId;
var bcrypt = require("bcryptjs");

var db = null;


MongoClient.connect("mongodb://localhost:27017/barkr", function(err, dbconn){
  if(!err){
    console.log("connected");
    db = dbconn;
  }
});

app.use(express.static('public'));
app.use(bodyParser.json());

app.get("/barks", function(req, res){
  db.collection("barks", function(err, barksCollection){
    barksCollection.find().toArray(function(err, barks){
      res.json(barks);
    })
  });
})

app.post('/barks', function(req, res){
  db.collection("barks", function(err, barksCollection){
    var newBark = {text: req.body.newBark};
    barksCollection.insert(newBark, {w:1}, function(err){
      res.send();
    })
  });
});

app.put('/barks/remove', function(req, res){
  db.collection("barks", function(err, barksCollection){
    var barkId = req.body.bark._id;
    barksCollection.remove({_id: ObjectId(barkId)}, {w:1}, function(err){
      res.send();
    })
  });
});

app.post('/users', function(req, res){
  db.collection("users", function(err, usersCollection){
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(req.body.password, salt, function(err, hash){
        var newUser = {
          username: req.body.username,
          password: hash
        };
        usersCollection.insert(newUser, {w:1}, function(err){
          res.send();
        })
      })
    })
  });
});

app.put('/users/signin', function(req, res, next){
  db.collection('users', function(err, usersCollection){
    usersCollection.findOne({username: req.body.username}, function(err, user){
      console.log(req.body.password);
      console.log(user.password);
      bcrypt.compare(req.body.password, user.password, function(err, result){
        if(result){
          return res.send();
        } else {
          return res.status(400).send();
        }
      })
    });
  });
});

app.listen(3000, function(){
  console.log("help, I'm alive")
});
