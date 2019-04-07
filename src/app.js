
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
app.post("/getTaskSet", function (req, res) {

    dataLayer.getTaskSet(function (dtSet) {
        res.send(dtSet);
    });
});

//update task
app.post("/updateTaskSet/:elem_id", function (req, res) {

    if (req.params.elem_id && req.body && typeof req.body.name != 'undefined' && typeof req.body.done) {

        console.log(req.body);

        var task = {
            _id: req.params.elem_id,
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