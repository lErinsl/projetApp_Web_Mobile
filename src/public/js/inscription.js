var TodoApp = angular.module('TodoApp', []);

function InscriptionController($scope, $http){
  $scope.formData = {};
  $scope.errorNom = false;
  $scope.errorPrenom = false;
  $scope.errorEmail = 1;
  $scope.errorPseudo = 1;
  $scope.errorMdp = false;
  $scope.errorMdpConf = false;
  $scope.idUser = GetCookie("idUser");

  if ($scope.idUser!=null) document.location.href="./index.html";

  $scope.sinscrire = function(){
    $scope.formData.page = "inscription";

    $scope.verificationInput();

    if (!$scope.errorNom && !$scope.errorPrenom && $scope.errorEmail==1
    && $scope.errorPseudo==1 && !$scope.errorMdp && !$scope.errorMdpConf){
        $scope.verificationPseudo();
    }    
  }

  $scope.verificationInput = function(){
    if ($scope.formData.nomUser==null || $scope.formData.nomUser.length<1) $scope.errorNom = true;
    else $scope.errorNom = false;

    if ($scope.formData.prenomUser==null || $scope.formData.prenomUser.length<1) $scope.errorPrenom = true;
    else $scope.errorPrenom = false;
    
    if ($scope.formData.emailUser==null || $scope.formData.emailUser.length<1) $scope.errorEmail = 0;
    else $scope.errorEmail = 1;
    
    if ($scope.formData.pseudoUser==null || $scope.formData.pseudoUser.length<5) $scope.errorPseudo = 0;
    else $scope.errorPseudo = 1;
    
    if ($scope.formData.mdpUser==null || $scope.formData.mdpUser.length<8) $scope.errorMdp = true;
    else $scope.errorMdp = false;
    
    if ($scope.errorMdp==false && $scope.formData.mdpUser != $scope.formData.mdpconfUser) $scope.errorMdpConf = true;
    else $scope.errorMdpConf = false;    
  }

  $scope.verificationPseudo = function(){
    $scope.formData.page = "inscription";
    $scope.formData.inputInscription = "pseudo";
    
    $http.post('/getusers', $scope.formData)
        .success(function(data){
            if (data.length>0){
                $scope.errorPseudo = -1;
            }
            else{
                $scope.errorPseudo = 1;
            }
            $scope.verificationEmail();
        })
        .error(function(data){
          console.log('Error: ' + data);
        });    
  }

  $scope.verificationEmail = function(){
    $scope.formData.page = "inscription";
    $scope.formData.inputInscription = "email";
    
    $http.post('/getusers', $scope.formData)
        .success(function(data){
            if (data.length>0){
                $scope.errorEmail = -1;
            }
            else{
                $scope.errorEmail = 1;
        
                if ($scope.errorPseudo==1){
                  $scope.ajouterUser();
                }
            }            
        })
        .error(function(data){
          console.log('Error: ' + data);
        });    
  }

  $scope.recupererUser = function(){  
    $scope.formData.page = "connection";
    
    $http.post('/getusers', $scope.formData)
        .success(function(data){
          if (data.length>0){
            $scope.formData = {};
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

  $scope.ajouterUser = function(){    
    $http.put('/createusers', $scope.formData)
        .success(function(data){
          $scope.recupererUser();
        })
        .error(function(data){
          console.log('Error: ' + data);
        });   
  }
}