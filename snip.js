//from server.js

//creating a new user:
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

//comparing user at sign in against the db:
app.put('/users/signin', function(req, res, next){
  db.collection('users', function(err, usersCollection){
    usersCollection.findOne({username: req.body.username}, function(err, user){
      bcrypt.compare(req.body.password, user.password, function(err, result){
        if(result){
          var token = jwt.encode(user, JWT_SECRET);
          var img_url='';
          var thisUser = usersCollection.findOne({username: req.body.username}).then(function(){
            return img_url = thisUser.img_url;
          });
          console.log(img_url);
          return res.json({img_url: img_url, token: token});
        } else {
          return res.status(400).send();
        }
      })
    });
  });
});
