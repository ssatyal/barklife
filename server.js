var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(express.static('public'));
app.use(bodyParser.json());

var barks = ["Hi, please throw ball?",
"did someone say walk?",
"PEANUT BUTTER IS THE BEST!!!!!",
"outside smells good :)"];

app.get("/barks", function(req, res){
  res.send(barks)
})

app.post('/barks', function(req, res){
  barks.push(req.body.newBark);
  res.send();
});

app.listen(3000, function(){
  console.log("help, I'm alive... port 3000")
});
