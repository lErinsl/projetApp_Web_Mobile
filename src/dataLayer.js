var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
const uri = "mongodb+srv://Mongo:Mongodb@cluster0-1vtfl.mongodb.net/test?retryWrites=true";
var client = new MongoClient(uri, {useNewUrlParser: true});
var db;

var dataLayer = {

    init : function (cb) {
        //Initialize connection once
        client.connect(function (err) {
            if(err) throw err;

            db = client.db("Poly");
            cb();
        });
    },

    getTaskSet : function (cb) {
        db.collection("Tasks").find({}).toArray(function (err, docs) {
            cb(docs);
        });
    },

    insertTask : function (task, cb) {
        db.collection("Tasks").insertOne(task, function (err, result) {
            cb();
        });
    },

    updateTask: function (task, cb) {
        var query = { _id: new mongodb.ObjectID(task._id) };
        var data = {
            $set:{
                name: task.name,
                date: task.date,
                dateCheck: task.dateCheck,
                done: task.done
            }
        };
        db.collection("Tasks").updateOne(query, data, function (err, result) {
            cb();
        });
    },

    deleteTask: function (task, cb) {
        var query = { _id: new mongodb.ObjectID(task._id) };
        db.collection("Tasks").deleteOne(query, function (err, result) {
            cb();
        });
    }
}

module.exports = dataLayer;