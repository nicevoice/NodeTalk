var config = require('./config');

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(config.dbname, {}, function(err, db) {
  if(err) {
    console.log('Cannot connect to MongoDB.');
    process.exit(1);
  }

  /*
  module.exports = {
    accounts: db.collection('accounts'),
    nodes: db.collection('nodes'),
    topics: db.collection('topics')
  };
  */

  exports.accounts = db.collection('accounts');
  exports.nodes = db.collection('nodes');
  exports.topics = db.collection('topics');
});
