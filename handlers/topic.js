var async = require("async");
var markdown = require("markdown").markdown;
var BSON = require('mongodb').BSONPure;
var db = require("../db");
var auth = require("../auth");
var utils = require("../utils");

module.exports = {
  index: function(req, res) {
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
  },

  create: function(req, res) {
    db.nodes.find({}, function(err, cursor) {
      cursor.toArray(function(err, result) {
        utils.render(req, res, 'createTopic', {nodes: result});
      });
    });
  },

  view: function(req, res) {
    db.topics.findOne({_id: BSON.ObjectID(req.params.id)}, function(err, topic) {
      if(!topic.reply)
        topic.reply = [];
      async.map(topic.reply, function(reply, callback) {
        db.accounts.findOne({_id: reply.author}, function(err, account) {
          reply.author = account;
          callback(null, reply);
        });
      }, function(err, result) {
        topic.reply = result;
        utils.render(req, res, 'topic', {topic: topic});
      });
    });
  },

  doCreate: function(req, res) {
    var error = function(msg) {
      db.nodes.find().sort({'reply_at': -1}, function(err, cursor) {
        cursor.toArray(function(err, result) {
          utils.render(req, res, 'createTopic', {
            'errorMsg': req.t(msg),
            'nodevalue': req.body['node'],
            'title': req.body['title'],
            'content': req.body['content'],
            nodes: result
          });
        });
      });
    };

    auth.authenticate(req, function(err, account) {
      if(err)
        error('handler.notLogin');

      if(!req.body['title'] || req.body['title'].length > 100)
        error('handler.createTopic.invalidTitle');

      if(!req.body['content'] || req.body['content'].length > 20000)
        error('handler.createTopic.invalidContent');

      var data = {
        author: account._id,
        title: req.body['title'],
        content: req.body['content']
      };

      db.topics.findOne(data, function(err, result) {
        if(!err && result) {
          res.redirect('/topic/' + result._id + '/');
          res.send();
        }
        else {
          db.nodes.findOne({name: req.body['node']}, function(err, result) {
            if(!err && result) {
              db.topics.insert({
                'title': req.body['title'],
                'content': req.body['content'],
                'content_html': markdown.toHTML(req.body['content']),
                'author': account._id,
                'node': result._id,
                'replys': 0,
                'created_at': utils.timestamp(),
                'modified_at': utils.timestamp(),
                'reply_at': utils.timestamp(),
                'reply': []
              }, function() {
                db.topics.findOne(data, function(err, result) {
                  res.redirect('/topic/' + result._id + '/');
                });
              });
            }
            else {
              error('handler.createTopic.invalidNode');
            }
          });
        }
      });
    });
  },

  doReply: function(req, res) {
    var error = function(msg) {
      db.topics.findOne({_id: BSON.ObjectID(req.params.id)}, function(err, result) {
        utils.render(req, res, 'topic', {
          topic: result,
          content: req.body['content'],
          'errorMsg': req.t(msg),
        });
      });
    };

    db.topics.findOne({_id: BSON.ObjectID(req.params.id)}, function(err, topic) {
      if(!err && !topic) {
        utils.render(req, res, 'topicIndex', {
          'errorMsg': req.t('handler.topic.invalidTopic')
        });
      }
      else {
        db.topics.update({_id: topic._id}, {
          $inc: {'replys': 1},
          $push: {'reply': {
            'author': topic.author,
            'content': req.body['content'],
            'content_html': markdown.toHTML(req.body['content']),
            'created_at': utils.timestamp()
          }}
        }, function(err) {
          db.topics.update({_id: topic._id}, {'reply_at': utils.timestamp()}, function(err) {
            db.topics.findOne({_id: topic._id}, function(err, topic) {
              utils.render(req, res, 'topic', {
                topic: topic
              });
            });
          });
        });
      }
    });
  }
};
