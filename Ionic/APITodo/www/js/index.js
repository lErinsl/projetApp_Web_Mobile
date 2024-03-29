angular.module('starter', ['ionic'])

    .factory('Projects', function () {
        return {
            all: function () {
                var projectString = window.localStorage['projects'];
                if (projectString) {
                    return angular.fromJson(projectString);
                }
                return [];
            },
            save: function (projects) {
                window.localStorage['projects'] = angular.toJson(projects);
            },
            newProject: function (projectTitle) {
                // Add a new project
                return {
                    title: projectTitle,
                    tasks: []
                };
            },
            getLastActiveIndex: function () {
                return parseInt(window.localStorage['lastActiveProject']) || 0;
            },
            setLastActiveIndex: function (index) {
                window.localStorage['lastActiveProject'] = index;
            }
        }
    }).controller('mainController', function ($scope, $http, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate){
    //isConnect :
    token = localStorageGET('token', false)
    if (token == false) {
        document.location.href = "./connection.html";
    }
    const httpOptions = {
        headers: {
            'Authorization': token
        }
    };

    //on récupère les informations personnel (nickname/email)
    $scope.myself = {};
    $http.post('/getMyself', {}, httpOptions).then(function (data) {
        console.log("getmyself");
        console.log(data);
        $scope.myself = data.data;
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
    
    $scope.logout = function() {
        localStorageREMOVE('token');
        document.location.href = "./connection.html";
    }

    $scope.TasksGroupSelect = {};
    $scope.formTaskGroup = {};
    $scope.formTaskGroupModif = {};
    $scope.formData = {};
    $scope.formDataModif = {};

    $scope.projectPartageliste = {};
    $scope.projectliste = {};

    $scope.myvar = {};
    $scope.myvarGroup = {};


    $scope.toggleProjects = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    //$scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];
    
    // $scope.toggleLeft = buildToggler('left');
    // function buildToggler(componentId) {
    //     return function () {
    //         console.log($mdSidenav(componentId).toggle());
    //         refreshProjectPartage();
    //     };
    // }

    $scope.cancelError = function () {
        $scope.createError = 0;
        $scope.partageError = 0;
    }

    var refreshGlobal = function () {
        console.log("data Refresh");
        $scope.createError = 0;
        $scope.partageError = 0;
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
                // on regarde si le projet selectionnée existe encore:
                if ($scope.TasksGroupSelect != null){
                    exist = false;
                    for (let i = 0; i < $scope.projectliste.length; i++) {
                        if ($scope.TasksGroupSelect == $scope.projectliste[i]){
                            exist = true;
                            $scope.TasksGroupSelect = $scope.projectliste[i];
                            i = $scope.projectliste.length;
                        }
                    }
                    if(exist == false){
                        // on regarde dans les projet partagées:
                        for (let i = 0; i < $scope.projectPartageliste.length; i++) {
                            if ($scope.TasksGroupSelect == $scope.projectPartageliste[i]) {
                                exist = true;
                                $scope.TasksGroupSelect = $scope.projectPartageliste[i];
                                i = $scope.projectPartageliste.length;
                            }
                        }
                        if(exist == false){
                            $scope.TasksGroupSelect = $scope.projectliste[0];
                        }
                    }
                }else{
                    $scope.TasksGroupSelect = $scope.projectliste[0];
                }
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

        $http.post('/getTasksGroup/partage', {}, httpOptions).then(function (data) {
            console.log(data);
            $scope.projectPartageliste = data.data;
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
    //on refresh les données toutes les 5s;
    //setInterval(refreshGlobal, 10000);

    //--------------------------------------------------------------------------
//Project:

    refreshProjectAll = function () {
        refreshProject();

        refreshProjectPartage();
    }

    refreshProject = function () {
        $http.post('/getTasksGroup',{},httpOptions).then(function (data) {
            $scope.projectliste = data.data;
            
            if($scope.TasksGroupSelect == null || $scope.TasksGroupSelect.length<=0){
                $scope.TasksGroupSelect = $scope.projectliste[0];
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

    refreshProjectPartage = function () {
        $http.post('/getTasksGroup/partage', {}, httpOptions).then(function (data) {
            console.log(data);
            $scope.projectPartageliste = data.data;
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
        if ($scope.formTaskGroup.name == null || $scope.formTaskGroup.name.length <=0){
            $scope.formTaskGroup.name = "Project "+$scope.projectliste.length;
        }

        if($scope.formTaskGroup.name.length > 16){
            $scope.formTaskGroup.name = $scope.formTaskGroup.name.substr(0,16);
        }

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
                    refreshProjectAll();
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

    $scope.modifierProjet = function (elem) {
        $scope.formTaskGroupModif.nicknameCreateur = elem.nicknameCreateur;
        $scope.formTaskGroupModif.name = elem.name;
        $scope.formTaskGroupModif.listviewer = elem.listviewer;
        $scope.myvarGroup = elem._id;
    }

    $scope.annulerModificationProjet = function () {
        $scope.formTaskGroupModif = {};
        $scope.myvarGroup = {};
    }

    $scope.modifProjet = function (id) {
        console.log($scope.formTaskGroupModif);

        if ($scope.formTaskGroupModif.name.length > 16) {
            $scope.formTaskGroupModif.name = $scope.formTaskGroupModif.name.substr(0,16);
        }

        $http.post('/updateProject/' + id, $scope.formTaskGroupModif, httpOptions)
            .then(function (data) {
                $scope.formTaskGroupModif = {};
                $scope.myvarGroup = {};
                //$scope.laliste = data.data;
                console.log(data);

                //on réactualise les données
                refreshGlobal();
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
        $scope.createError = 0;
        $scope.partageError = 0;
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

    $scope.partageProjectRemoveUser = function (nickname, project) {
        $scope.createError = 0;
        $scope.partageError = 0;
        $http.post('/partageProjet/remove/' + nickname, project, httpOptions) // retourne la liste des viewvers de ce projet apres l'avoir partagée
            .then(function (data) {
                console.log(data);

                //on ajoute les données manquantesles données
                console.log(data.data.listviewer);
                if (data.status == 200) {
                    project.listviewer = data.data.listviewer;
                    console.log(project);
                }

                if (project == $scope.TasksGroupSelect){
                    $scope.TasksGroupSelect = {};
                }
                refreshGlobal();
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
                        $scope.msgPartageError = "Le pseudo ou l'email entré n'existe pas.";
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
        $scope.createError = 0;
        $scope.partageError = 0;
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

        if ($scope.formData.name.length > 45) {
            $scope.formData.name = $scope.formData.name.substr(0, 45);
        }

        $http.post('/addTask', $scope.formData,httpOptions)
        .then(function (data) {
            //console.log($scope.formData);
            $scope.formData = {};
            console.log(data);

            //on réactualise les données
            refreshTask(taskGroup);
        })
        .catch(function (data) {
            console.log("Error:" + data);
            console.log(data);
            switch (data.status) {
                case 403:
                    $scope.logout();
                    break;
                case 401:
                    $scope.createError = 401;
                    $scope.msgCreateError = "Il vous est actuellement impossible de créer une tâche"
                    break;

                default:
                    break;
            }
        });
    };

    $scope.deleteTodo = function (id, taskGroup) {
        $http.delete('/deleteTaskSet/' + id +'/'+taskGroup._id,httpOptions)
            .then(function (data) {
                //$scope.laliste = data.data;
                console.log(data);

                //on réactualise les données
                refreshTask(taskGroup);
            })
            .catch(function (data) {
                console.log("Error:" + data);
                console.log(data);
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
        $scope.formDataModif.date = elem.date;
        $scope.formDataModif.name = elem.name;
        $scope.formDataModif.done = elem.done;
        $scope.myvar = elem._id;
    }

    $scope.annulerModification = function () {
        $scope.formDataModif = {};
        $scope.myvar = {};
    }

    $scope.modifTodo = function (id, taskGroup) {
        $scope.formDataModif.dateCheck = Date.now();
        $scope.formDataModif.taskGroup = taskGroup._id;
        console.log($scope.formDataModif);

        if ($scope.formDataModif.name.length > 45) {
            $scope.formDataModif.name = $scope.formDataModif.name.substr(0, 45);
        }

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