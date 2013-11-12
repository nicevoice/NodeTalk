var crypto = require('crypto');
var auth = require('./auth');

exports.sha256 = function(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
};

exports.timestamp = function() {
 return Math.round(Date.now() / 1000);
};

exports.render = function(req, res, name, param) {
  auth.authenticate(req, function(err, account) {
    if(!param)
      param = {};
    param.account = err ? undefined : account;
    res.render(name, param);
  });
};
