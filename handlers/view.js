var db = require("../db");
var utils = require('../utils');

exports.index = function(req, res) {
  utils.render(req, res, 'index');
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
