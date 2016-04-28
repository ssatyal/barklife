var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var app = express();
var bodyParser = require("body-parser");
var ObjectId = require('mongodb').ObjectId;
var bcrypt = require("bcryptjs");
var jwt = require('jwt-simple');

var JWT_SECRET = 'dogbark';
var db = null;

MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/barkr", function(err, dbconn){
  if(!err){
    console.log("db connected");
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
  var token = req.headers.authorization; //adds user's token to post
  var user = jwt.decode(token, JWT_SECRET); //decodes user's token
  db.collection("barks", function(err, barksCollection){
    var newBark = {
      text: req.body.newBark,
      user: user._id,
      username: user.username,
      img_url: user.img_url,
      created_at: Date.now()};
    barksCollection.insert(newBark, {w:1}, function(err){
      res.send();
    })
  });
});

app.put('/barks/remove', function(req, res){
  var token = req.headers.authorization; //adds user's token to post
  var user = jwt.decode(token, JWT_SECRET); //decodes user's token
  db.collection("barks", function(err, barksCollection){
    var barkId = req.body.bark._id;
    barksCollection.remove({_id: ObjectId(barkId), user: user._id}, {w:1}, function(err){
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
          password: hash,
          img_url: req.body.img_url
        };
        console.log(newUser);
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
      bcrypt.compare(req.body.password, user.password, function(err, result){
        if(result){
          var token = jwt.encode(user, JWT_SECRET);
          return res.json({token: token});
        } else {
          return res.status(400).send();
        }
      })
    });
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("help, I'm alive")
});
