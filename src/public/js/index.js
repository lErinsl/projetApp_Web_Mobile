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
            switch (response.status) {
                case 403:
                    $scope.logout();
                    break;

                default:
                    break;
            }
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
            switch (response.status) {
                case 403:
                    $scope.logout();
                    break;

                default:
                    break;
            }
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
                switch (data.status) {
                    case 403:
                        $scope.logout();
                        break;

                    default:
                        break;
                }
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
                switch (data.status) {
                    case 403:
                        $scope.logout();
                        break;

                    default:
                        break;
                }
            });
    };

//PARTAGE---------------------------------------------------------------------
    $scope.partageProject = function () {
        $http.post('/partageProjet/' + $scope.TasksGroupSelect._id, $scope.TasksGroupSelect, httpOptions) // retourne la liste des viewvers de ce projet apres l'avoir partagée
            .then(function (data) {
                console.log(data);

                //on ajoute les données manquantesles données
                console.log(data.data.listviewer);
                if(data.status == 200){
                    $scope.TasksGroupSelect.listviewer = data.data.listviewer;
                    console.log($scope.TasksGroupSelect);
                }
            })
            .catch(function (data) {
                console.log("Error:" + data);
                console.log(data);
                switch (data.status) {
                    case 403:
                        $scope.logout();
                        break;
                    case 400:
                        $scope.partageError = 400;
                        $scope.msgPartageError = "Le pseudo ou l'email entrée n'existe pas.";
                        break;
                    case 304:
                        $scope.partageError = 304;
                        $scope.msgPartageError = "La Todo liste est déjà partagé avec cette utilisateur.";
                        break;
                    case 401:
                        $scope.partageError = 401;
                        $scope.msgPartageError = "Vous n'etes pas autoriser à vous rajouter vous-même !!!";
                        break;
                    default:
                        break;
                }
            });
    };

    $scope.partageProjectRemoveUser = function (nickname) {
        $http.post('/partageProjet/remove/' + nickname, $scope.TasksGroupSelect, httpOptions) // retourne la liste des viewvers de ce projet apres l'avoir partagée
            .then(function (data) {
                console.log(data);

                //on ajoute les données manquantesles données
                console.log(data.data.listviewer);
                if (data.status == 200) {
                    $scope.TasksGroupSelect.listviewer = data.data.listviewer;
                    console.log($scope.TasksGroupSelect);
                }
            })
            .catch(function (data) {
                console.log("Error:" + data);
                console.log(data);
                switch (data.status) {
                    case 403:
                        $scope.logout();
                        break;
                    case 400:
                        $scope.partageError = 400;
                        $scope.msgPartageError = "Le pseudo ou l'email entrée n'existe pas.";
                        break;
                    case 304:
                        $scope.partageError = 304;
                        $scope.msgPartageError = "La Todo liste est déjà partagé avec cette utilisateur.";
                        break;
                    case 401:
                        $scope.partageError = 401;
                        $scope.msgPartageError = "Seul le createur de la liste peut retirer un membre de la liste.";
                        break;
                    default:
                        break;
                }
            });
    };

    //------------------------------------------------------------------------------------
//TASK
    refreshTask = function (taskGroup) {
        $http.post('/getTaskSet/' + taskGroup._id,{},httpOptions).then(function (data) {
            $scope.laliste = data.data;
        }).catch(function (response) {
            console.error('Error', response);
            switch (response.status) {
                case 403:
                    $scope.logout();
                    break;

                default:
                    break;
            }
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
            switch (data.status) {
                case 403:
                    $scope.logout();
                    break;

                default:
                    break;
            }
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
                switch (data.status) {
                    case 403:
                        $scope.logout();
                        break;

                    default:
                        break;
                }
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
                switch (data.status) {
                    case 403:
                        $scope.logout();
                        break;

                    default:
                        break;
                }
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
                switch (data.status) {
                    case 403:
                        $scope.logout();
                        break;

                    default:
                        break;
                }
            });
    };
});