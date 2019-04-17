//dataLayer
var dataLayer = require('./dataLayer.js');

//server web
var express = require('express');
var jwt = require('jsonwebtoken');
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
    // app.listen(3000);
    app.listen(process.env.PORT);
    console.log("Listening on port"+process.env.PORT);
    
});

// page web :
//----------------------------------------------------------------------------
//Authentification:
const AuthRouter = require('./route/authentification-route.config.js');
AuthRouter.authentificationConfigs(app, dataLayer,jwt);

//----------------------------------------------------------------------------
//Task
const TasksRouter = require('./route/task-route.config.js');
TasksRouter.routesConfigs(app,dataLayer,jwt);

//----------------------------------------------------------------------------
//Project:
const TaskGroupRouter = require('./route/taskGroup-route.config.js');
TaskGroupRouter.routesConfigs(app,dataLayer,jwt);

//----------------------------------------------------------------------------
//Users:
const UsersRouter = require('./route/users-route.config.js');
UsersRouter.usersConfigs(app,dataLayer);