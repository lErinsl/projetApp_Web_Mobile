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

    get: function (collection, filter,cb) {
        console.log(filter);
        if(filter._id != null){
            filter = {
                _id: new mongodb.ObjectID(filter._id)
            }
        }
        db.collection(collection).find(filter).toArray(function (err, docs) {
            cb(docs);
        });
    },

    insert: function (collection,data, cb) {
        db.collection(collection).insertOne(data, function (err, result) {
            cb();
        });
    },

    update: function (collection,ID,task, cb) {
        var query = { _id: new mongodb.ObjectID(ID) };

        var data = {
            $set : task
        };
        
        db.collection(collection).updateOne(query,data, function (err, result) {
            cb();
        });
    },

    delete: function (collection,data, cb) {
        var query = { _id: new mongodb.ObjectID(data._id) };
        db.collection(collection).deleteOne(query, function (err, result) {
            cb();
        });
    },
}

module.exports = dataLayer;