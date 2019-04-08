var TodoApp = angular.module('TodoApp', []);

function MonCompteController($scope, $http){
  $scope.formData = {};
  $scope.idUser = GetCookie("idUser");
  $scope.userInfos = null;
  $scope.enmodification = -1;
  
  $scope.errorNom = false;
  $scope.errorPrenom = false;
  $scope.errorEmail = 1;
  $scope.errorPseudo = 1;
  $scope.errorAncienMdp = false; 
  $scope.errorMdp = false;
  $scope.errorMdpConf = false;

  if ($scope.idUser==null) document.location.href="./index.html";

  //ok
  $scope.recuperermesinfos = function(){
      $scope.formData.page = "affichenom"; 
      $scope.formData.idUser = $scope.idUser;

      $http.post('/getusers', $scope.formData)
        .success(function(data){
            $scope.userInfos = data[0];            
        })
        .error(function(data){
          console.log('Error: ' + data);
        });
  };
  $scope.recuperermesinfos();
  
  //ok
  $scope.modifierChamp = function(index){  
    $scope.errorNom = false;
    $scope.errorPrenom = false;
    $scope.errorEmail = 1;
    $scope.errorPseudo = 1;
    $scope.errorAncienMdp = false; 
    $scope.errorMdp = false;
    $scope.errorMdpConf = false;
    $scope.recuperermesinfos();
    $scope.enmodification = index;
  };
  
  //ok
  $scope.annulermodification = function(){
    $scope.enmodification = -1;
    $scope.errorNom = false;
    $scope.errorPrenom = false;
    $scope.errorEmail = 1;
    $scope.errorPseudo = 1;
    $scope.errorAncienMdp = false; 
    $scope.errorMdp = false;
    $scope.errorMdpConf = false;
    $scope.recuperermesinfos();
  };

  //ok
  $scope.nouveauNom = function(){
    if (!$scope.errorNom){
        $scope.formData.idUser = $scope.idUser;
        $scope.formData.nomUser = $scope.userInfos.nomUser;
    
        $http.post('/updateusers', $scope.formData)
            .success(function(data){
                $scope.enmodification = -1;
                $scope.formData = {};
            })
            .error(function(data){
              console.log('Error: ' + data);
            });
    }
  }
  //ok
  $scope.modifierNom = function(){
    console.log("nom");
    if ($scope.userInfos.nomUser==null || $scope.userInfos.nomUser.length<1) $scope.errorNom = true;
    else $scope.errorNom = false;

    if (!$scope.errorNom) $scope.nouveauNom();
  };

  //ok
  $scope.nouveauPrenom = function(){
    if (!$scope.errorPrenom){
        $scope.formData.idUser = $scope.idUser;
        $scope.formData.prenomUser = $scope.userInfos.prenomUser;
    
        $http.post('/updateusers', $scope.formData)
            .success(function(data){
                $scope.enmodification = -1;
                $scope.formData = {};
            })
            .error(function(data){
              console.log('Error: ' + data);
            });
    }
  }
  //ok
  $scope.modifierPrenom = function(){
      console.log("prenom");
      if ($scope.userInfos.prenomUser==null || $scope.userInfos.prenomUser.length<1) $scope.errorPrenom = true;
      else $scope.errorPrenom = false;

      if (!$scope.errorPrenom) $scope.nouveauPrenom();
  };
  
  //ok
  $scope.nouveauEmail = function(){
    if ($scope.errorEmail==1){
        $scope.formData.idUser = $scope.idUser;
        $scope.formData.emailUser = $scope.userInfos.emailUser;
    
        $http.post('/updateusers', $scope.formData)
            .success(function(data){
                $scope.enmodification = -1;
                $scope.formData = {};             
            })
            .error(function(data){
              console.log('Error: ' + data);
            });
    }
  }  
  //ok
  $scope.verifierEmail = function(){
    $scope.formData.page = "inscription";
    $scope.formData.inputInscription = "email";
    $scope.formData.emailUser = $scope.userInfos.emailUser;
    
    $http.post('/getusers', $scope.formData)
        .success(function(data){
            if (data.length>0 && data[0]._id != $scope.idUser){
                $scope.errorEmail = -1;
            }
            else{
                $scope.errorEmail = 1;
            }
            $scope.nouveauEmail();
        })
        .error(function(data){
          console.log('Error: ' + data);
        });
  };
  //ok
  $scope.modifierEmail = function(){
    console.log("email");
    if ($scope.userInfos.emailUser==null || $scope.userInfos.emailUser.length<1) $scope.errorEmail = 0;
    else $scope.errorEmail = 1;

    if ($scope.errorEmail==1) $scope.verifierEmail();
  };

  //ok
  $scope.nouveauPseudo = function(){
    if ($scope.errorPseudo==1){
        $scope.formData.idUser = $scope.idUser;
        $scope.formData.pseudoUser = $scope.userInfos.pseudoUser;
    
        $http.post('/updateusers', $scope.formData)
            .success(function(data){
                $scope.enmodification = -1;
                $scope.formData = {};
            })
            .error(function(data){
              console.log('Error: ' + data);
            });
    }
  }
  
  //ok
  $scope.verifierPseudo = function(){
    $scope.formData.page = "inscription";
    $scope.formData.inputInscription = "pseudo";
    $scope.formData.pseudoUser = $scope.userInfos.pseudoUser;
    
    $http.post('/getusers', $scope.formData)
        .success(function(data){
            if (data.length>0 && data[0]._id != $scope.idUser){
                $scope.errorPseudo = -1;
            }
            else{
                $scope.errorPseudo = 1;
            }
            $scope.nouveauPseudo();
        })
        .error(function(data){
          console.log('Error: ' + data);
        });
  };
  //ok
  $scope.modifierPseudo = function(){    
    if ($scope.userInfos.pseudoUser==null || $scope.userInfos.pseudoUser.length<5) $scope.errorPseudo = 0;
    else $scope.errorPseudo = 1;

    if ($scope.errorPseudo==1) $scope.verifierPseudo();
  };
  //ok
  $scope.nouveauMdp = function(){
    if (!$scope.errorAncienMdp && !$scope.errorMdp && !$scope.errorMdpConf){
        $scope.formData.idUser = $scope.idUser;
    
        $http.post('/updateusers', $scope.formData)
            .success(function(data){
                $scope.enmodification = -1;
                $scope.formData = {};
            })
            .error(function(data){
              console.log('Error: ' + data);
            });
    }
  }
  //ok
  $scope.modifierMdp = function(){    
    if ($scope.formData.AmdpUser==null || $scope.formData.AmdpUser!=$scope.userInfos.mdpUser) $scope.errorAncienMdp = true;
    else $scope.errorAncienMdp = false;
    
    if ($scope.formData.mdpUser==null || $scope.formData.mdpUser.length<8) $scope.errorMdp = true;
    else $scope.errorMdp = false;
    
    if ($scope.errorMdp==false && $scope.formData.mdpUser != $scope.formData.NmdpUserConf) $scope.errorMdpConf = true;
    else $scope.errorMdpConf = false;  


    if (!$scope.errorAncienMdp && !$scope.errorMdp && !$scope.errorMdpConf) $scope.nouveauMdp();
  };
}