angular.module('TodoApp', ['ionic'])
.controller('InscriptionController', function ($scope, $http) {

  form_nickname_error = "";
  form_email_error = "";
  form_pass_error = "";
  form_passconf_error = "";

  if (isConnect($http) == true) {
    document.location.href = "./index.html";
  }

  $scope.formData = {};

  existEmailNickname = 0;

  if ($scope.idUser!=null) document.location.href="./index.html";

  $scope.sinscrire = function(){

    checkFormAndCreateUser();
  };

  checkForm = function(){
    result = true;

    //pseudo
    if ($scope.formData.nickname == null || $scope.formData.nickname.length<3){
      form_nickname_error = "minlength";
      result = false;
    }
    else{
      form_nickname_error = "";
    }
    
    var regex = new RegExp('^.+@.+\..+$')
    if ($scope.formData.email==null || $scope.formData.email.length<3){
      form_email_error = "required";
      result = false;
    }else{
      form_email_error = "";
      if(regex.test($scope.formData.email)){
        form_email_error = "";
      }else{
        form_email_error = "pattern";
        result = false;
      }
    }

    //password
    if ($scope.formData.pass==null || $scope.formData.pass.length<8){
      form_pass_error = "minlength";
      result = false;
    }else{
      form_pass_error = "";
    }
    
    //confirm password
    if($scope.formData.passconf == null){
      form_passconf_error = "required";
      result = false;
    }else{
      form_passconf_error = "";
      if ($scope.formData.pass != $scope.formData.passconf){
        form_pass_error = "notsimilar";
        form_passconf_error = "notsimilar";
        result = false;
      }else{
        form_pass_error = "";
        form_passconf_error = "";
      }
    }

    return result;
  };

  checkFormAndCreateUser = function () {
    result = checkForm();
    existEmail(result);
  }

  existEmail = function (result) {
    $http.get('/existemail/' + $scope.formData.email)
      .success(function (data) {
        console.log('existEmail');
        if (data.data == true) {
          form_email_error = "exist";
          result= false;
        } else {
          form_email_error = "";
        }
      })
      .error(function (data) {
        console.log('Error: ' + data);
        result = false;
      })
      .finally(function () {
        // do something when all requests are done
        // even if some of them have failed
        console.log('finally');
        //lemail est valide, on regarde le pseudo:
        existNickname(result);
        return result;
      });
  };

  existNickname = function (result) {
    result;
    $http.get('/existnickname/' + $scope.formData.nickname)
      .success(function (data) {
        console.log('existNickname');
        if (data.data == true) {
          form_nickname_error = "exist";
          result = false;
        } else {
          form_nickname_error = "";
        }
      })
      .error(function (data) {
        result = false;
        console.log('Error: ' + data);
      })
      .finally(function () {
        // do something when all requests are done
        // even if some of them have failed
        console.log('finally');
        //lemail est valide, on regarde le pseudo:
        // le pseudo et l'email sont valide, on inscrit l'user:
        if( result == true){
          addUser();
        }
        return result;
      })
      ;
  };

  addUser = function () {
    console.log("adduser");
    $http.post('/adduser', $scope.formData)
      .success(function (data) {
        //$scope.formData = {};
        console.log(data);
        document.location.href = "./connection.html";
      })
      .error(function (data) {
        console.log("Error:" + data);
      });
  };

});