const listCollect = "TasksGroup"

exports.routesConfigs = function (app, dataLayer) {

    //insert project
    app.post("/addTasksGroup", function (req, res) {

        if (req.body && typeof req.body.name != 'undefined') {

            console.log(req.body);

            var taskgroup = {
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
    });

    //get project
    app.post("/getTasksGroup", function (req, res) {

        var filter = {

        };
        dataLayer.get(listCollect, filter, function (dtSet) {
            res.send(dtSet);
        });
    });

    //delete project
    app.delete("/deleteTasksGroup/:elem_id", function (req, res) {

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
    });
};