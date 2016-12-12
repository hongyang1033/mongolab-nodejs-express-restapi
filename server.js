var express = require('express');
var mongoClient = require('mongodb').MongoClient;
var autoIncrement = require('mongodb-autoincrement');
var faker = require('faker');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var URI = 'mongodb://rest:restapi@ds113608.mlab.com:13608/nodeapitest';

app.get('/api/posts', function(req, res) {
  mongoClient.connect(URI, function(err, db) {
    if(err)
      throw err;
    db.collection('posts').find().toArray(function(err, docs){
      if(err)
        throw err;
      res.json(docs);
    });
  });
});

app.get('/api/posts/:id', function(req, res) {
  var request = req.params.id;
  var id = parseInt(request);
  mongoClient.connect(URI, function(err, db) {
    if(err)
      throw err;
    db.collection('posts').findOne({"_id": id}, function(err, docs){
      if(err)
        throw err;
      if(docs===null){
        res.send("No document found");
      } else {
        res.json(docs);
      }
    });
  });
});

app.post('/api/posts', function(req, res) {
  var request = req.body;
  mongoClient.connect(URI, function(err, db) {
    if (err)
      throw err;
    autoIncrement.getNextSequence(db, 'posts', function(err, autoIndex) {
      if (err)
        throw err;
      db.collection('posts').insert({
        _id: autoIndex,
        title: request.title,
        body: request.body
      }, function(err, result){
        if (err)
          throw err;
        res.send({"message": "successfully created"});
      });
    });
  });
});


app.listen(3000);