var express = require('express');
var mongoClient = require('mongodb').MongoClient;
var autoIncrement = require('mongodb-autoincrement');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var URI = 'mongodb://rest:restapi@ds113608.mlab.com:13608/nodeapitest';

app.get('/', function(req, res) {
   res.send("Please use api/endpoints to access"); 
});

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


var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});