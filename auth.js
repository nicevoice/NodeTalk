var db = require('./db');
var utils = require('./utils');

exports.createToken = function(account, callback) {
  var token = utils.sha256(require('crypto').randomBytes(256));
  db.accounts.findOne({'tokens.token': token}, function() {
    db.accounts.update({_id: account._id}, {
      $push: {tokens:{
        'created_at': utils.timestamp(),
        'token': token
      }}
    }, function() {});

    callback(token);
  });
}
