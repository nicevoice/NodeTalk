var db = require("../db");
var auth = require("../auth");
var utils = require("../utils");
var markdown = require("markdown").markdown;

exports.create = function(req, res) {
  function error(msg) {
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
  }

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
      if(!err && result)
        res.redirect('/topic/' + result._id + '/');
    });

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
          'reply_at': utils.timestamp()
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
  });
};
