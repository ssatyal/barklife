var app = angular.module("barkr", [
  'ngRoute',
  'ngCookies'
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
});

//if browser refresh, get the current user and token if signed in
app.run(function($rootScope, $cookies){
  if($cookies.get('token') && $cookies.get('currentUser')){
    $rootScope.token = $cookies.get('token');
    $rootScope.currentUser = $cookies.get('currentUser');
    $rootScope.img_url = $cookies.get('img_url');
  }
});

app.controller("HomeCtrl",function($rootScope, $scope, $http, $cookies){
  $http.get("/barks").then(function(response){
    $scope.barks = response.data;
  });
  $scope.submit = function(){
    $http.post('/barks', {newBark: $scope.newBark},
    {headers: { //optional argument
      'authorization': $rootScope.token
    }}).then(function(){
      getBarks();
      $scope.newBark = '';
    });
  };
  $scope.removeBark = function(bark){
    $http.put('/barks/remove', {bark: bark},
    {headers: { //optional argument
      'authorization': $rootScope.token
    }}).then(function(){
      getBarks();
    });
  };

  $scope.signin = function(){
    console.log("clicked");
    $http.put('/users/signin', {username: $scope.username, password: $scope.password})
    .then(function(res){
      console.log("res:",res);
      $cookies.put('token', res.data.token);
      $cookies.put('currentUser', $scope.username);
      $rootScope.token = res.data.token; //rootScope to access in diff controller
      $rootScope.currentUser = $scope.username; //access user in diff controller
      $rootScope.img_url = checkImg($rootScope.currentUser);
      // $cookies.put('img_url', $scope.img_url);
      console.log("Scope: ", $scope);
      console.log("barks: ", $scope.barks)
      console.log("rootScope: ",$rootScope);
    }, function(err) {
      alert("bad login");
    });
  };
  var checkImg = function(userToCheck){
    for (var i=0; i<$scope.barks.length; i++){
      if(userToCheck==$scope.barks[i].username){
        console.log("match!");
        return $scope.barks[i].img_url;
        break;
      }else{
        return null
      }
    }
  };
  $scope.signout = function() {
    $cookies.remove('token');
    $cookies.remove('currentUser');
    $cookies.remove('img_url');
    $rootScope.token = null;
    $rootScope.currentUser = null;
    $rootScope.img_url = null;
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
      password: $scope.password,
      img_url: $scope.img_url
    }
    $http.post('/users', newUser).then(function(){
      console.log("worked");
    })
  };

  });
