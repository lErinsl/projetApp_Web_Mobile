angular.module('TodoApp', ['ionic'])
  .controller('InscriptionController', function ($scope, $http) {

    $scope.form_nickname_error = "";
    $scope.form_email_error = "";
    $scope.form_pass_error = "";
    $scope.form_passconf_error = "";

    if (isConnect($http) == true) {
      document.location.href = "./index.html";
    }

    $scope.formData = {};

    existEmailNickname = 0;

    if ($scope.idUser != null) document.location.href = "./index.html";

    $scope.sinscrire = function () {

      checkFormAndCreateUser();
    };

    $scope.liensConnection = function () {
      document.location.href = "./connection.html";
    };

    checkForm = function () {
      result = true;

      //pseudo
      if ($scope.formData.nickname == null) {
        $scope.form_nickname_error = "required";
        result = false;
      } else {
        if ($scope.formData.nickname.length < 3) {
          $scope.form_nickname_error = "minlength";
          result = false;
        } else {
          $scope.form_nickname_error = "";
        }
      }

      var regex = new RegExp('^.+@.+\..+$')
      if ($scope.formData.email == null || $scope.formData.email.length < 3) {
        $scope.form_email_error = "required";
        result = false;
      } else {
        $scope.form_email_error = "";
        if (regex.test($scope.formData.email)) {
          $scope.form_email_error = "";
        } else {
          $scope.form_email_error = "pattern";
          result = false;
        }
      }

      //password
      if ($scope.formData.pass == null || $scope.formData.pass.length < 8) {
        $scope.form_pass_error = "minlength";
        result = false;
      } else {
        $scope.form_pass_error = "";
      }

      //confirm password
      if ($scope.formData.passconf == null) {
        $scope.form_passconf_error = "";
        result = false;
      } else {
        $scope.form_passconf_error = "required";
        if ($scope.formData.pass != $scope.formData.passconf) {
          $scope.form_pass_error = "notsimilar";
          $scope.form_passconf_error = "notsimilar";
          result = false;
        } else {
          $scope.form_pass_error = "";
          $scope.form_passconf_error = "";
        }
      }

      return result;
    };

    checkFormAndCreateUser = function () {
      result = checkForm();
      existEmail(result);
    }

    existEmail = function (result) {
      if ($scope.formData.email) {
        $scope.form_email_error = "required";
      }
      $http.get('/existemail/' + $scope.formData.email)
        .success(function (data) {
          console.log('existEmail');
          if (data.data == true) {
            $scope.form_email_error = "";
            result = false;
          } else {
            if ($scope.form_email_error != "required") {
              $scope.form_email_error = "exist";
            }
          }
        })
        .error(function (data) {
          //console.log('Error: ' + data);
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
      $http.get('/existnickname/' + $scope.formData.nickname)
        .success(function (data) {
          console.log('existNickname');
          if (data.data == true) {
            $scope.form_nickname_error = "exist";
            result = false;
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
          if (result == true) {
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