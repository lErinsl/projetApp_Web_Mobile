const taskCollect = "Tasks"
//insert task
exports.routesConfigs = function (app, dataLayer){
    
    app.post("/addTask", function (req, res) {

        if (req.body && typeof req.body.name != 'undefined' && typeof req.body.done) {

            console.log(req.body);

            var task = {
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
    });

    //get task
    app.post("/getTaskSet/:taskGroupID", function (req, res) {

        var filter = {
            "taskGroup": req.params.taskGroupID
        }
        dataLayer.get(taskCollect, filter, function (dtSet) {
            res.send(dtSet);
        });
    });

    //update task
    app.post("/updateTaskSet/:elem_id", function (req, res) {

        if (req.params.elem_id && req.body && typeof req.body.name != 'undefined' && typeof req.body.done) {

            console.log(req.body);

            var ID = req.params.elem_id;

            var task = {
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
    });

    //delete task
    app.delete("/deleteTaskSet/:elem_id", function (req, res) {

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
    });
};