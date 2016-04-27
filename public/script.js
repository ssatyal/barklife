var app = angular.module("barkr", [
  'ngRoute'
]);

app.config(function($routeProvider, $locationProvider){
  $routeProvider
  .when("/", {
    templateUrl: 'home.html',
    controller: 'HomeCtrl'
  })
  .when("/signup", {
    templateUrl: 'signup.html',
    controller: 'SignUpCtrl'
  })
})

app.controller("HomeCtrl",function($scope, $http){
  $http.get("/barks").then(function(response){
    $scope.barks = response.data;
  });
  $scope.submit = function(){
    $http.post('/barks', {newBark: $scope.newBark}).then(function(){
      getBarks();
      $scope.newBark = '';
    });
  };
  $scope.removeBark = function(bark){
    $http.put('/barks/remove', {bark: bark}).then(function(){
      getBarks();
    });
  };

  $scope.signin = function(){
    console.log("clicked");
    $http.put('/users/signin', {username: $scope.username, password: $scope.password})
    .then(function(){
      console.log("successfully signed in");
    }, function(err) {
      console.log("bad login");
    });
  };

  function getBarks(){
    $http.get("/barks").then(function(response){
      $scope.barks = response.data;
    });
  };
  getBarks();
});

app.controller("SignUpCtrl",function($scope, $http){
  console.log("sign up page");
  $scope.signup = function(){
    var newUser = {
      username: $scope.username,
      password: $scope.password
    }
    $http.post('/users', newUser).then(function(){
      console.log("worked");
    })
  };

  });
