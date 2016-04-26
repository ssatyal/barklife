var express = require("express");
var app = express();

app.use(express.static('public'));

app.get("/barks", function(req, res){
  var barks = ["Hi, please throw ball?",
  "did someone say walk?",
  "PEANUT BUTTER IS THE BEST!!!!!",
  "outside smells good :)"];
  res.send(barks)
})

app.listen(3000, function(){
  console.log("help, I'm alive... port 3000")
});
