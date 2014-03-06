var db = require("../db");
var utils = require('../utils');

module.exports = {
  get: {
    '': function(req, res) {
      db.nodes.find({}, function(err, cursor) {
        cursor.toArray(function(err, result) {
          utils.render(req, res, 'nodeIndex', {nodes: result});
        });
      });
    },
    'create': function(req, res) {
      utils.authenticate(req, function(err, account) {
        if (err)
          res.redirect('/login');

        utils.render(req, res, 'nodeCreate');
      });
    }
  },

  post: {
    'create': function(req, res) {
      if (!req.body['nodename'])
        utils.render(
          req, res, 'nodeCreate', {errorMsg: req.t('handler.missingValues')});

      db.nodes.find({name: req.body['nodename']}, function(err, cursor) {
        cursor.toArray(function(err, result) {
          console.log(result);
          if (!result.length == 0) {
            utils.render(
              req, res, 'nodeCreate', {errorMsg: req.t('handler.nodeExisted')});
          } else {
            db.nodes.insert({
              name: req.body['nodename'],
              title: req.body['nodetitle'] || req.body['nodename'],
              description: req.body['nodedescription'] || ''
            }, function(err) {
              if (!err)
                res.redirect('/node/');
            });
          }
        });
      });
    }
  }
};
