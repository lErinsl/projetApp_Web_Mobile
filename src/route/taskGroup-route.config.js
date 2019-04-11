const listCollect = "TasksGroup"
const taskCollect = "Tasks"
const usersCollect = "Users"

exports.routesConfigs = function (app, dataLayer, jwt) {

    //insert project
    app.post("/addTasksGroup", verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                //res.sendStatus(200);
                /*res.json({
                    message: 'Post Success...',
                    authData
                });*/

                if (req.body && typeof req.body.name != 'undefined') {

                    console.log(req.body);

                    list = [];

                    var taskgroup = {
                        nicknameCreateur: authData.users.nickname,
                        name: req.body.name,
                        listviewer : list
                    };

                    dataLayer.insert(listCollect, taskgroup, function () {
                        res.send({ success: true });
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

    //get project
    app.post("/getTasksGroup",verifyToken, (req, res) => {

        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                //res.sendStatus(200);
                /*res.json({
                    message: 'Post Success...',
                    authData
                });*/

                var filter = {
                    nicknameCreateur : authData.users.nickname
                };
                dataLayer.get(listCollect, filter, function (dtSet) {
                    res.send(dtSet);
                });

            }
        });
    });

    //get project
    app.post("/getTasksGroup/partage", verifyToken, (req, res) => {

        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {

                var filter = {
                    listviewer: authData.users.nickname
                };
                dataLayer.get(listCollect, filter, function (dtSet) {
                    res.send(dtSet);
                });

            }
        });
    });

    //delete project
    app.delete("/deleteTasksGroup/:elem_id",verifyToken, (req, res) => {

        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                //res.sendStatus(200);
                /*res.json({
                    message: 'Post Success...',
                    authData
                });*/

                if (req.params.elem_id) {

                    console.log(req.body);

                    var task = {
                        _id: req.params.elem_id
                    };

                    dataLayer.delete(listCollect, task, function () {
                        res.send({ success: true });
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

    //partager Project
    app.post("/partageProjet/:elem_id", verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                //res.sendStatus(200);
                // un utilisateur ne peu pas se partager une tache a lui même.
                if (req.body.nicknameCreateur != req.body.nicknameOrEmail){
                    if (req.params.elem_id && req.body) {

                        console.log("partage :");
                        console.log(req.body);

                        var stop = false;
                        var ID = req.params.elem_id;

                        var array = req.body.listviewer;

                        var filternickname = {
                            "nickname": req.body.nicknameOrEmail
                        };
                        var filteremail = {
                            "email": req.body.nicknameOrEmail
                        };

                        dataLayer.get(usersCollect, filternickname, function (dtSet) {
                            if (dtSet == null || dtSet.length <= 0) {
                                //si on ne trouve pas, on cherche avec l'adresse email + pass dans la base de donnée
                                dataLayer.get(usersCollect, filteremail, function (dtSet2) {
                                    if(dtSet2 == null || dtSet2.length <=0){
                                        res.sendStatus(400);
                                    }else{
                                        console.log(dtSet2);
                                        for (let i = 0; i < array.length; i++) {
                                            if(array[i] == dtSet2[0].nickname){
                                                res.sendStatus(304);
                                                stop = true;
                                            }
                                        }
                                        if(stop == false){
                                            array[array.length] = dtSet2[0].nickname;
                                            var task = {
                                                listviewer: array
                                            };
                                            console.log(array);
                                            dataLayer.update(listCollect, ID, task, function () {
                                                res.send({listviewer : array});
                                            });
                                        }
                                    }
                                });
                            }else{
                                for (let i = 0; i < array.length; i++) {
                                    if (array[i] == dtSet[0].nickname) {
                                        res.sendStatus(304);
                                        stop = true;
                                    }
                                }
                                if(stop == false){
                                    array[array.length] = dtSet[0].nickname;
                                    var task = {
                                        listviewer: array
                                    };
                                    console.log(array);
                                    dataLayer.update(listCollect, ID, task, function () {
                                        res.send({ listviewer: array });
                                    });
                                }
                            }
                        });

                    } else {
                        res.send({
                            success: false,
                            errorCode: "PARAM_MISSING"
                        });
                    }
                } else {
                    res.sendStatus(401);
                }

            }
        });
    });

    //partager Project Remove User
    app.post("/partageProjet/remove/:nickname", verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                //res.sendStatus(200);

                //console.log(authData.users._id)

                var paramsNickname = req.params.nickname;

                if((req.body.nicknameCreateur == authData.users.nickname || authData.users.nickname == paramsNickname) && req.body){
                    if (req.body) {

                        console.log("partage remove member :");
                        console.log(req.body);

                        var array = req.body.listviewer;

                        for (let i = 0; i < array.length; i++) {
                            if(array[i] == paramsNickname){
                                array.splice(i,1);
                                i = array.length;
                            }
                        }

                        var task = {
                            listviewer: array
                        };
                        dataLayer.update(listCollect, req.body._id, task, function () {
                            res.send({ listviewer: array });
                        });

                    } else {

                        res.send({
                            success: false,
                            errorCode: "PARAM_MISSING"
                        });

                    }
                } else {
                    res.sendStatus(401);
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

    }
};