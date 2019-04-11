var TodoApp = angular.module('TodoApp', ['ngMaterial','ngMessages']);

//function InscriptionController($scope, $http){
TodoApp.controller('InscriptionController', function ($scope, $http) {

  if (isConnect($http) == true) {
    document.location.href = "./index.html";
  }

  $scope.formData = {};

  existEmailNickname = 0;

  if ($scope.idUser!=null) document.location.href="./index.html";

  $scope.sinscrire = function(form){

    checkFormAndCreateUser(form);
  };

  checkForm = function(form){
    result = true;

    //pseudo
    if ($scope.formData.nickname == null || $scope.formData.nickname.length<3){
      form.nickname.$setValidity('minlength',false);
      result = false;
    }
    else{
      form.nickname.$setValidity('minlength', true);

      //on regarde si le pseudo existe en base de donnée.
      //console.log(existNickname(form));
      //result = existNickname(form);
    }
    
    var regex = new RegExp('^.+@.+\..+$')
    if ($scope.formData.email==null || $scope.formData.email.length<3){
      form.email.$setValidity('required',false);
      result = false;
    }else{
      form.email.$setValidity('required',true);
      if(regex.test($scope.formData.email)){
        form.email.$setValidity('pattern',true);

        //on regarde si l'adresse email existe en base de donnée.
        //console.log(existEmail(form));
        //result = existEmail(form);
      }else{
        form.email.$setValidity('pattern',false);
        result = false;
      }
    }

    //password
    if ($scope.formData.pass==null || $scope.formData.pass.length<8){
      form.pass.$setValidity('minlength',false);
      result = false;
    }else{
      form.pass.$setValidity('minlength',true);
    }
    
    //confirm password
    if($scope.formData.passconf == null){
      form.passconf.$setValidity('required',false);
      result = false;
    }else{
      form.passconf.$setValidity('required',true);
      if ($scope.formData.pass != $scope.formData.passconf){
        form.pass.$setValidity('notsimilar',false);
        form.passconf.$setValidity('notsimilar',false);
        result = false;
      }else{
        form.pass.$setValidity('notsimilar', true);
        form.passconf.$setValidity('notsimilar', true);
      }
    }

    return result;
  };

  checkFormAndCreateUser = function (form) {
    result = checkForm(form);
    existEmail(form, result);
  }

  existEmail = function (form , result) {
    $http.get('/existemail/' + $scope.formData.email)
      .then(function (data) {
        console.log('existEmail');
        if (data.data == true) {
          form.email.$setValidity('exist', false);
          result= false;
        } else {
          form.email.$setValidity('exist', true);
        }
      })
      .catch(function (data) {
        console.log('Error: ' + data);
        result = false;
      })
      .finally(function () {
        // do something when all requests are done
        // even if some of them have failed
        console.log('finally');
        //lemail est valide, on regarde le pseudo:
        existNickname(form, result);
        return result;
      });
  };

  existNickname = function (form, result) {
    result;
    $http.get('/existnickname/' + $scope.formData.nickname)
      .then(function (data) {
        console.log('existNickname');
        if (data.data == true) {
          form.nickname.$setValidity('exist', false);
          result = false;
        } else {
          form.nickname.$setValidity('exist', true);
        }
      })
      .catch(function (data) {
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
      .then(function (data) {
        //$scope.formData = {};
        console.log(data);
        document.location.href = "./connection.html";
      })
      .catch(function (data) {
        console.log("Error:" + data);
      });
  };

});