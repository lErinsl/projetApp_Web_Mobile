
//dataLayer
var dataLayer = require('./dataLayer.js');

//server web
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('public')) //accede à /public.index.html par default quand on fait un '/'

//init parser
app.use( bodyParser.json() ); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));

// page web :

// Start the application after the database connection is ready
dataLayer.init(function () {
    
    console.log('init');
    app.listen(3000);
    console.log("Listening on port 3000");

});

//insert task
app.post("/addTask", function (req, res) {
    
    if(req.body && typeof req.body.name != 'undefined' && typeof req.body.done){

        console.log(req.body);

        var task = {
            taskGroup : req.body.taskGroup,
            name : req.body.name,
            date : req.body.date,
            dateCheck : req.body.dateCheck,
            done : req.body.done
        };

        dataLayer.insertTask(task, function () {
            res.send({success : true});
        });

    }else{

        res.send({
            success : false,
            errorCode : "PARAM_MISSING"
        });

    }
});

//get task
app.post("/getTaskSet/:taskGroupID", function (req, res) {

    dataLayer.getTaskSet(req.params.taskGroupID,function (dtSet) {
        res.send(dtSet);
    });
});

//update task
app.post("/updateTaskSet/:elem_id", function (req, res) {

    if (req.params.elem_id && req.body && typeof req.body.name != 'undefined' && typeof req.body.done) {

        console.log(req.body);

        var task = {
            _id: req.params.elem_id,
            taskGroup: req.body.taskGroup,
            name: req.body.name,
            date: req.body.date,
            dateCheck: req.body.dateCheck,
            done: req.body.done
        };

        dataLayer.updateTask(task, function () {
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

        dataLayer.deleteTask(task, function () {
            res.send({ success: true });
        });

    } else {

        res.send({
            success: false,
            errorCode: "PARAM_MISSING"
        });

    }
});



//----------------------------------------------------------------------------
//Project:
//insert project
app.post("/addTasksGroup", function (req, res) {

    if (req.body && typeof req.body.name != 'undefined') {

        console.log(req.body);

        var taskgroup = {
            name: req.body.name
        };

        dataLayer.insertTasksGroup(taskgroup, function () {
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

    dataLayer.getTasksGroup(function (dtSet) {
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

        dataLayer.deleteTasksGroup(task, function () {
            res.send({ success: true });
        });

    } else {

        res.send({
            success: false,
            errorCode: "PARAM_MISSING"
        });

    }
});