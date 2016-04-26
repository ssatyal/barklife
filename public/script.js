var app = angular.module("barkr", []);
app.controller("barkrCtrl",function($scope, $http){
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
  function getBarks(){
    $http.get("/barks").then(function(response){
      $scope.barks = response.data;
    });
  }
  getBarks();
});
