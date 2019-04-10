const listCollect = "TasksGroup"

exports.routesConfigs = function (app, dataLayer,jwt) {

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

                    var taskgroup = {
                        idcreateur: authData.users._id,
                        name: req.body.name
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

                console.log(authData.users._id)

                var filter = {
                    idcreateur : authData.users._id
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