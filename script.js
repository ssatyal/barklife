var app = angular.module("barkr", []);
app.controller("barkrCtrl",function($scope){
  $scope.barks = ["Hi, please throw ball?",
  "did someone say walk?",
  "PEANUT BUTTER IS THE BEST!!!!!",
  "outside smells good :)"];
});
