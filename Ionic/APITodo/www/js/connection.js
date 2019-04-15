angular.module('TodoApp', ['ionic'])
  .controller('ConnectionController', function ($scope, $http, $ionicModal) {
  $scope.formData = {};
  $scope.formData_nickpass_error = '';

  //console.log(isConnect($http));
  if(isConnect($http) == true){
    document.location.href = "./index.html";
  }

  $scope.connect = function(){
    console.log("connect");

    $http.post('/login', $scope.formData)
        .success(function(data){
          console.log(data);
          console.log(data.token);
          if(data.token.length > 10){
            localStorageSET('token','token '+data.token);
            document.location.href = "./index.html";

            $scope.formData_nickpass_error = '';
          }else{
            $scope.formData_nickpass_error = "errone";
          }
        })
        .error(function(data){
          console.log('Error: ' + data);
          $scope.formData_nickpass_error = "errone";
          console.log($scope.formData_nickpass_error);
        });
  };
  });