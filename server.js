var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var app = express();
var bodyParser = require("body-parser");
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

app.listen(3000, function(){
  console.log("help, I'm alive")
});
