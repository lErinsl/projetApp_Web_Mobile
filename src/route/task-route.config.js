const taskCollect = "Tasks"
//insert task
exports.routesConfigs = function (app, dataLayer, jwt){
    
    app.post("/addTask", verifyToken, (req, res) => {

        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                //res.sendStatus(200);

                //console.log(authData.users._id)

                if (req.body && typeof req.body.name != 'undefined' && typeof req.body.done) {

                    console.log(req.body);

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

                    console.log(req.body);

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

                    res.send({
                        success: false,
                        errorCode: "PARAM_MISSING"
                    });

                }

            }
        });
    });

    //delete task
    app.delete("/deleteTaskSet/:elem_id", verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                //res.sendStatus(200);
                //console.log(authData.users._id)
                if (req.params.elem_id) {
                    console.log(req.body);
                    var task = {
                        _id: req.params.elem_id
                    };

                    dataLayer.delete(taskCollect, task, function () {
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