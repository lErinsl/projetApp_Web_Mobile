var TodoApp = angular.module('TodoApp', []);

function ConnectionController($scope, $http){
  $scope.formData = {};
  $scope.errorId = false;
  $scope.idUser = GetCookie("idUser");

  if ($scope.idUser!=null) document.location.href="./index.html";

  $scope.seconnecter = function(){
    $scope.formData.page = "connection";
    
    $http.post('/getusers', $scope.formData)
        .success(function(data){
          if (data.length>0){
            $scope.formData = {};
            $scope.errorId = false;
            // cookie pour l'id
            document.cookie = "idUser="+data[0]._id;
            document.location.href="./meslistes.html";
          } 
          else{
            $scope.errorId = true;
          }
        })
        .error(function(data){
          console.log('Error: ' + data);
        });
  }
}