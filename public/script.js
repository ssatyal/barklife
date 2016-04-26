var app = angular.module("barkr", []);
app.controller("barkrCtrl",function($scope, $http){
  $http.get("/barks").then(function(response){
    $scope.barks = response.data;
  });
});
