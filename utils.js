var crypto = require('crypto');
var db = require('./db');

sha256 = function(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
};
exports.sha256 = sha256;

md5 = function(data) {
  return crypto.createHash('md5').update(data).digest('hex');
};
exports.md5 = md5;

timestamp = function() {
  return Math.round(Date.now() / 1000);
};
exports.timestamp = timestamp;

authenticate = function(req, callback) {
  if (!req.cookies.token) {
    return callback(true, {});
  }

  db.accounts.findOne({'tokens.token': req.cookies.token},
    function(err, result) {
      callback((err || !result), result);
  });
};
exports.authenticate = authenticate;

createToken = function(account, callback) {
  var token = sha256(crypto.randomBytes(256));
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
exports.createToken = createToken;

isAdmin = function(req, account) {
  if (!account) {
    authenticate(req, function(err, account) {
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
exports.isAdmin = isAdmin;

render = function(req, res, name, param) {
  authenticate(req, function(err, account) {
    if (!param)
      param = {};
    param.account = err ? undefined : account;
    param.isAdmin = err ? false : isAdmin(req, account)
    res.render(name, param);
  });
};
exports.render = render;
