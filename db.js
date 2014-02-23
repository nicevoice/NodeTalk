var MongoClient = require('mongodb').MongoClient;

var config = require('./config');

exports.connect = function(callback) {
  MongoClient.connect(config.mongodb, {}, function(err, db) {
    if(err)
      throw err;

    ['accounts', 'nodes', 'topics'].forEach(function(item) {
      exports[item] = db.collection(item);
    });
  });
};
