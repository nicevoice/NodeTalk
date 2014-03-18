var crypto = require('crypto');
var db = require('./db');

exports.sha256 = function(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
};

exports.md5 = function(data) {
  return crypto.createHash('md5').update(data).digest('hex');
};

exports.timestamp = function() {
  return Math.round(Date.now() / 1000);
};

exports.authenticate = function(req, callback) {
  if (!req.cookies.token) {
    callback(true, {});
  }

  db.accounts.findOne({'tokens.token': req.cookies.token},
    function(err, result) {
      callback((err || !result), result);
  });
};

exports.createToken = function(account, callback) {
  var token = exports.sha256(crypto.randomBytes(256));
  db.accounts.findOne({'tokens.token': token}, function() {
    db.accounts.update({_id: account._id}, {
      $push: {tokens:{
        'created_at': timestamp(),
        'token': token
      }}
    }, function() {});

    callback(token);
  });
};

exports.isAdmin = function(req, account) {
  if (!account) {
    exports.authenticate(req, function(err, account) {
      if (!err && account) {
        this.account = account;
      } else {
        return false;
      }
    });
  }
  db.accounts.findOne({"username": account}, function(err, result) {
    if (err || !result) {
      return false;
    } else {
      return result.role <= 1;
    }
  });
};

exports.render = function(req, res, name, param) {
  exports.authenticate(req, function(err, account) {
    if (!param)
      param = {};
    param.account = err ? undefined : account;
    param.isAdmin = err ? false : exports.isAdmin(req, account)
    res.render(name, param);
  });
};
