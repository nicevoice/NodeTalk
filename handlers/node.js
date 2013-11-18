var db = require("../db");
var utils = require('../utils');

module.exports = {
  index: function(req, res) {
    db.nodes.find({}, function(err, cursor) {
      cursor.toArray(function(err, result) {
        utils.render(req, res, 'nodeIndex', {nodes: result});
      });
    });
  }
};
