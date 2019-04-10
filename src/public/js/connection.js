var TodoApp = angular.module('TodoApp', ['ngMaterial', 'ngMessages']);

// function ConnectionController($scope, $http){
TodoApp.controller('ConnectionController', function ($scope, $http) {
  $scope.formData = {};

  //console.log(isConnect($http));
  if(isConnect($http) == true){
    document.location.href = "./index.html";
  }

  $scope.connect = function(form){
    
    $http.post('/login', $scope.formData)
        .then(function(data){
          console.log(data);
          console.log(data.data.token);
          if(data.data.token.length > 10){
            localStorageSET('token','token '+data.data.token);
            document.location.href = "./index.html";
            form.nickpass.$setValidity('errone', true);
          }else{
            form.nickpass.$setValidity('errone', false);
          }
        })
        .catch(function(data){
          console.log('Error: ' + data);
          form.nickpass.$setValidity('errone', false);
        });
  };
});