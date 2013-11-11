var config = require('./config');

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(config.dbname, {}, function(err, db) {
  if(err) {
    console.error('Cannot connect to MongoDB.');
    process.exit(1);
  }

  exports.accounts = db.collection('accounts');
});
