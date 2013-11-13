var async = require("async");
var db = require("../db");
var utils = require('../utils');

exports.topicIndex = function(req, res) {
  db.topics.find().sort({'reply_at': -1}, function(err, cursor) {
    cursor.toArray(function(err, result) {
      async.map(result, function(topic, callback) {
        db.accounts.findOne({_id: topic.author}, function(err, account) {
          topic.author = account;
          callback(null, topic);
        });
      }, function(err, result) {
        utils.render(req, res, 'topicIndex', {topics: result});
      });
    });
  });
};

exports.signup = function(req, res){
  utils.render(req, res, 'signup');
};

exports.login = function(req, res){
  utils.render(req, res, 'login');
};

exports.topic = {
  create: function(req, res) {
    db.nodes.find({}, function(err, cursor) {
      cursor.toArray(function(err, result) {
        utils.render(req, res, 'createTopic', {nodes: result});
      });
    });
  }
};

exports.node = {
  index: function(req, res) {
    db.nodes.find({}, function(err, cursor) {
      cursor.toArray(function(err, result) {
        utils.render(req, res, 'nodeIndex', {nodes: result});
      });
    });
  }
};
