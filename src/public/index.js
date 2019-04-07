var ListeaFaire = angular.module('ListeaFaire', ['ngMaterial']);

// function mainController($scope, $http) {
ListeaFaire.controller('mainController', function ($scope, $http, $mdDialog){

    $scope.formData = {};
    $scope.formDataModif = {};

    $scope.myvar = {};

    $http.post('/getTaskSet').then(function (data) {
            $scope.laliste = data.data;
            console.log(data.data);
    }).catch(function (response) {
        console.error('Error', response);
    });
    
    $scope.createTodo = function () {
        console.log($scope.formData);
        $scope.formData.date = Date.now();
        $scope.formData.dateCheck = Date.now();
        $scope.formData.done = false;

        $http.post('/addTask', $scope.formData)
        .then(function (data) {
            //console.log($scope.formData);
            $scope.formData = {};
            //$scope.laliste = data.data;
            console.log(data);

            //on réactualise les données
            $http.post('/getTaskSet').then(function (data) {
                $scope.laliste = data.data;                
            }).catch(function (response){
                console.error('Error', response);
            });
        })
        .catch(function (data) {
            console.log("Error:" + data);
        });
    };

    $scope.deleteTodo = function (id) {
        $http.delete('/deleteTaskSet/' + id)
            .then(function (data) {
                //$scope.laliste = data.data;
                console.log(data);

                //on réactualise les données
                $http.post('/getTaskSet').then(function (data) {
                    $scope.laliste = data.data;
                }).catch(function (response) {
                    console.error('Error', response);
                });
            })
            .catch(function (data) {
                console.log("Error:" + data);
            });
    };

    $scope.modifier = function (elem) {
        $scope.formDataModif.name = elem.name;
        $scope.formDataModif.done = elem.done;
        $scope.myvar = elem._id;
    }

    $scope.annulerModification = function () {
        $scope.formDataModif = {};
        $scope.myvar = {};
    }

    $scope.modifTodo = function (id) {
        $scope.formDataModif.date = Date.now();
        $scope.formDataModif.dateCheck = Date.now();
        console.log($scope.formDataModif);

        $http.post('/updateTaskSet/' + id, $scope.formDataModif)
            .then(function (data) {
                $scope.formDataModif = {};
                $scope.myvar = {};
                //$scope.laliste = data.data;
                console.log(data);

                //on réactualise les données
                $http.post('/getTaskSet').then(function (data) {
                    $scope.laliste = data.data;
                }).catch(function (response) {
                    console.error('Error', response);
                });
            })
            .catch(function (data) {
                console.log("Error:" + data);
            });
    };

    $scope.changeCheck = function (task) {
        task.done = !task.done;
        task.dateCheck = Date.now();
        $http.post('/updateTaskSet/' + task._id, task)
            .then(function (data) {
                console.log(data);

                // Pas besoin de réactualiser les données ici, on modifie l'objet directement
                // et on signal la modification au serveur.
            })
            .catch(function (data) {
                console.log("Error:" + data);
            });
    };

});