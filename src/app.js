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


// Start the application after the database connection is ready
dataLayer.init(function () {
    
    console.log('init');
    app.listen(3000);
    console.log("Listening on port 3000");
    
});

// page web :
//Task
const TasksRouter = require('./task-route.config.js');
TasksRouter.routesConfigs(app,dataLayer);

//----------------------------------------------------------------------------
//Project:
const TaskGroupRouter = require('./taskGroup-route.config.js');
TaskGroupRouter.routesConfigs(app,dataLayer);