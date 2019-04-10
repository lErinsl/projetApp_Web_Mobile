var ListeaFaire = angular.module('ListeaFaire', ['ngMaterial']);

// function mainController($scope, $http) {
ListeaFaire.controller('mainController', function ($scope, $http, $mdSidenav){

    //isConnect :
    token = localStorageGET('token',false)
    if (token == false) {
        document.location.href = "./connection.html";
    }

    const httpOptions = {
        headers: {
            'Authorization': token
        }
    };
    
    $scope.logout = function() {
        localStorageREMOVE('token');
        document.location.href = "./connection.html";
    }

    $scope.TasksGroupSelect = {};
    $scope.formTaskGroup = {};
    $scope.formData = {};
    $scope.formDataModif = {};

    $scope.myvar = {};

    /*$http.post('/getTaskSet/' + null).then(function (data) {
            $scope.laliste = data.data;
            console.log(data.data);
    }).catch(function (response) {
        console.error('Error', response);
    });*/

    $scope.toggleLeft = buildToggler('left');
    function buildToggler(componentId) {
        return function () {
            $mdSidenav(componentId).toggle();
        };
    }

    var refreshGlobal = function () {
        $http.post('/getTasksGroup/',{},httpOptions).then(function (data) {
            $scope.projectliste = data.data;
            console.log(data.data);

            //On met un projet par default si il existe pas:
            console.log($scope.projectliste.length);
            if ($scope.projectliste.length == 0) {
                $scope.newProject();
                $scope.TasksGroupSelect = $scope.projectliste[0];
            } else {
                // si il y a 1 projet ou plus, on le selectionne directement.
                $scope.TasksGroupSelect = $scope.projectliste[0];
                refreshTask($scope.TasksGroupSelect);
            }
        }).catch(function (response) {
            console.error('Error', response);
        });
    }

    refreshGlobal();

    //--------------------------------------------------------------------------
//Project:
    refreshProject = function () {
        $http.post('/getTasksGroup',{},httpOptions).then(function (data) {
            $scope.projectliste = data.data;
        }).catch(function (response) {
            console.error('Error', response);
        });
    }

    $scope.selectProject = function (project) {
        $scope.TasksGroupSelect = project;
        refreshTask(project);
        $scope.toggleLeft();
    }

    $scope.newProject = function () {
        console.log($scope.formTaskGroup);
        $scope.formTaskGroup.name = "Project "+$scope.projectliste.length;

        $http.post('/addTasksGroup', $scope.formTaskGroup,httpOptions)
            .then(function (data) {
                $scope.formTaskGroup = {};
                console.log(data);

                //on réactualise les données
                refreshProject();
            })
            .catch(function (data) {
                console.log("Error:" + data);
            });
    }

    $scope.deleteProject = function (id) {
        $http.delete('/deleteTasksGroup/' + id,httpOptions)
            .then(function (data) {
                console.log(data);

                //on réactualise les données
                if (id == $scope.TasksGroupSelect._id){
                    refreshGlobal();
                }else{
                    refreshProject();
                }
            })
            .catch(function (data) {
                console.log("Error:" + data);
            });
    };


    //------------------------------------------------------------------------------------
//TASK
    refreshTask = function (taskGroup) {
        $http.post('/getTaskSet/' + taskGroup._id,{},httpOptions).then(function (data) {
            $scope.laliste = data.data;
        }).catch(function (response) {
            console.error('Error', response);
        });
    }

    $scope.createTodo = function (taskGroup) {
        console.log($scope.formData);
        $scope.formData.date = Date.now();
        $scope.formData.dateCheck = Date.now();
        $scope.formData.taskGroup = taskGroup._id;
        $scope.formData.done = false;

        $http.post('/addTask', $scope.formData,httpOptions)
        .then(function (data) {
            //console.log($scope.formData);
            $scope.formData = {};
            //$scope.laliste = data.data;
            console.log(data);

            //on réactualise les données
            refreshTask(taskGroup);
        })
        .catch(function (data) {
            console.log("Error:" + data);
        });
    };

    $scope.deleteTodo = function (id, taskGroup) {
        $http.delete('/deleteTaskSet/' + id,httpOptions)
            .then(function (data) {
                //$scope.laliste = data.data;
                console.log(data);

                //on réactualise les données
                refreshTask(taskGroup);
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

    $scope.modifTodo = function (id, taskGroup) {
        $scope.formDataModif.date = Date.now();
        $scope.formDataModif.dateCheck = Date.now();
        $scope.formDataModif.taskGroup = taskGroup._id;
        console.log($scope.formDataModif);

        $http.post('/updateTaskSet/' + id, $scope.formDataModif,httpOptions)
            .then(function (data) {
                $scope.formDataModif = {};
                $scope.myvar = {};
                //$scope.laliste = data.data;
                console.log(data);

                //on réactualise les données
                refreshTask(taskGroup);
            })
            .catch(function (data) {
                console.log("Error:" + data);
            });
    };

    $scope.changeCheck = function (task) {
        task.done = !task.done;
        task.dateCheck = Date.now();
        $http.post('/updateTaskSet/' + task._id, task,httpOptions)
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