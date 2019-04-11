const taskCollect = "Tasks"
const listCollect = "TasksGroup"

//insert task
exports.routesConfigs = function (app, dataLayer, jwt){
    
    app.post("/addTask", verifyToken, (req, res) => {

        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                //res.sendStatus(200);
                if (req.body && typeof req.body.name != 'undefined' && typeof req.body.done) {

                    console.log("insert Task")
                    console.log(req.body);
                    
                    var filter = {
                        _id: req.body.taskGroup
                    }
                    dataLayer.get(listCollect, filter, function (dtSet) {
                        console.log(dtSet);
                        if (dtSet != null && dtSet.length > 0) {
                            console.log("auto");
                            viewer = false;
                            if (dtSet[0].listviewer != null) {
                                for (let i = 0; i < dtSet[0].listviewer.length; i++) {
                                    if (dtSet[0].listviewer[i] == authData.users.nickname) {
                                        i = dtSet[0].listviewer.length;
                                        viewer = true
                                    }
                                }
                            }

                            if (dtSet[0].nicknameCreateur == authData.users.nickname || viewer == true) {
                                //console.log("oui");
                                var task = {
                                    nicknameCreateur: authData.users.nickname,
                                    taskGroup: req.body.taskGroup,
                                    name: req.body.name,
                                    date: req.body.date,
                                    dateCheck: req.body.dateCheck,
                                    done: req.body.done
                                };

                                dataLayer.insert(taskCollect, task, function () {
                                    res.send({ success: true });
                                });
                            }else{
                                res.sendStatus(401);
                            }
                        }else{
                            res.sendStatus(401);
                        }
                    });

                } else {

                    res.send({
                        success: false,
                        errorCode: "PARAM_MISSING"
                    });

                }

            }
        });
    });

    //get task
    app.post("/getTaskSet/:taskGroupID", verifyToken, (req, res) => {

        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                //res.sendStatus(200);

                //console.log(authData.users._id)

                var filter = {
                    "taskGroup": req.params.taskGroupID
                }
                dataLayer.get(taskCollect, filter, function (dtSet) {
                    res.send(dtSet);
                });

            }
        });
    });

    //update task
    app.post("/updateTaskSet/:elem_id", verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                //res.sendStatus(200);

                //console.log(authData.users._id)

                if (req.params.elem_id && req.body && typeof req.body.name != 'undefined' && typeof req.body.done) {

                    var filter = {
                        _id: req.body.taskGroup
                    }
                    dataLayer.get(listCollect, filter, function (dtSet) {
                        console.log(dtSet);
                        if (dtSet != null && dtSet.length > 0) {
                            console.log("auto");
                            viewer = false;
                            if (dtSet[0].listviewer != null) {
                                for (let i = 0; i < dtSet[0].listviewer.length; i++) {
                                    if (dtSet[0].listviewer[i] == authData.users.nickname) {
                                        i = dtSet[0].listviewer.length;
                                        viewer = true
                                    }
                                }
                            }

                            if (dtSet[0].nicknameCreateur == authData.users.nickname || viewer == true) {
                                console.log("update task");
                                var ID = req.params.elem_id;

                                var task = {
                                    nicknameCreateur: authData.users.nickname,
                                    taskGroup: req.body.taskGroup,
                                    name: req.body.name,
                                    date: req.body.date,
                                    dateCheck: req.body.dateCheck,
                                    done: req.body.done
                                };

                                dataLayer.update(taskCollect, ID, task, function () {
                                    res.send({ success: true });
                                });
                            } else {
                                res.sendStatus(401);
                            }
                        } else {
                            res.sendStatus(401);
                        }
                    });
                    
                } else {

                    res.send({
                        success: false,
                        errorCode: "PARAM_MISSING"
                    });

                }

            }
        });
    });

    //delete task
    app.delete("/deleteTaskSet/:elem_id/:taskGroup", verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                //res.sendStatus(200);
                //console.log(authData.users._id)
                if (req.params.elem_id && req.params.taskGroup) {

                    console.log(req.body);
                    var filter = {
                        _id: req.params.taskGroup
                    }
                    dataLayer.get(listCollect, filter, function (dtSet) {
                        console.log(dtSet);
                        if (dtSet != null && dtSet.length > 0) {
                            console.log("auto");
                            viewer = false;
                            if (dtSet[0].listviewer != null) {
                                for (let i = 0; i < dtSet[0].listviewer.length; i++) {
                                    if (dtSet[0].listviewer[i] == authData.users.nickname) {
                                        i = dtSet[0].listviewer.length;
                                        viewer = true
                                    }
                                }
                            }

                            if (dtSet[0].nicknameCreateur == authData.users.nickname || viewer == true) {
                                console.log("delete task");
                                console.log(req.body);
                                var task = {
                                    _id: req.params.elem_id
                                };

                                dataLayer.delete(taskCollect, task, function () {
                                    res.send({ success: true });
                                });
                            } else {
                                res.sendStatus(401);
                            }
                        } else {
                            res.sendStatus(401);
                        }
                    });
                } else {
                    res.send({
                        success: false,
                        errorCode: "PARAM_MISSING"
                    });
                }
            }
        });
    });


    // FORMAT OF TOKEN
    // Authorization: Token <access_token>

    // Verify Token
    function verifyToken(req, res, next) {
        // Get auth header value
        const bearerHeader = req.headers['authorization'];
        // Check if bearer is undefined
        if (typeof bearerHeader !== 'undefined') {
            // Split at the space
            const bearer = bearerHeader.split(' ');
            // Get token from array
            const bearerToken = bearer[1];
            // Set the token
            req.token = bearerToken;
            // Next middleware
            next();
        } else {
            // Forbidden
            res.sendStatus(403);
        }

    };

    function autorisation(req,dataLayer,authData) {
        
        console.log("autorisation");
        //console.log(req);
        var filter = {
            _id: req.body.taskGroup
        }
        dataLayer.get(listCollect, filter, function (dtSet) {
            console.log(dtSet);
            if(dtSet != null && dtSet.length > 0){
                console.log("auto");
                viewer = false;
                if(dtSet[0].listviewer != null){
                    for (let i = 0; i < dtSet[0].listviewer.length; i++) {
                        if (dtSet[0].listviewer[i] == authData.users.nickname) {
                            i = dtSet[0].listviewer.length;
                            viewer = true
                        }
                    }
                }

                if (dtSet[0].nicknameCreateur == authData.users.nickname || viewer == true){
                    console.log("oui");
                    return true
                }
            }
            console.log("non");
            return false;
        });
    };

};