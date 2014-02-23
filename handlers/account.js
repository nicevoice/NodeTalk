var db = require("../db");
var utils = require('../utils');

exports.signup = function(req, res) {
  utils.render(req, res, 'signup');
};

exports.login = function(req, res) {
  utils.render(req, res, 'login');
};

exports.doSignup = function(req, res) {
  var username = req.body['username'];
  var passwd = utils.sha256(
    utils.sha256(username) + utils.sha256(req.body['passwd']));

  var error = function(msg) {
    utils.render(req, res, 'signup', {
      'errorMsg': req.t(msg),
      'username': username,
      'email': req.body['email']
    });
  }

  var validateEmail = function(email) {
    if (email.length == 0)
      return false;
    var re = /^[A-Za-z0-9_\-\.\+]+@[A-Za-z0-9_\-\.]+$/;
    return re.test(email);
  }

  if (req.body['passwd'] != req.body['passwd2'] ||
    req.body['passwd'].length == 0)
      error('handler.signup.passwdNotEqual');

  if (!/^[A-Za-z][A-Za-z0-9\.\-_]+$/.test(username))
    error('handler.signup.invalidUsername');

  if (!validateEmail(req.body['email']))
    error('handler.signup.invalidEmail');

  db.accounts.findOne({'username': username}, function(err, result) {
    if (!err && !result) {
      avatar_prefix = 'http://www.gravatar.com/avatar/'
      db.accounts.insert({
        'username': username,
        'passwd': passwd,
        'email': req.body['email'],
        'avatar': avatar_prefix + utils.md5(req.body['email']),
        'created_at': utils.timestamp(),
        'role': 10
      }, function() {
        db.accounts.findOne({'username': username}, function(err, result) {
          utils.createToken(result, function(token) {
            res.cookie('token', token, {expires: new Date(Date.now() + 30 * 24 * 3600000)});
            res.redirect('/');
          });
        });
      });
    } else {
      error('handler.signup.usernameExist');
    }
  });
};

exports.doLogin = function(req, res) {
  var username = req.body['username'];
  var passwd = utils.sha256(
    utils.sha256(username) + utils.sha256(req.body['passwd']));

  function error(msg) {
    utils.render(req, res, 'login', {
      'errorMsg': req.t(msg),
      'username': username,
      'email': req.body['email']
    });
  }

  db.accounts.findOne({'username': username, 'passwd': passwd},
    function(err, result) {
      if (!err && result) {
        utils.createToken(result, function(token) {
          res.cookie('token', token,
            {expires: new Date(Date.now() + 30 * 24 * 3600000)});
          res.redirect('/');
        });
      } else {
        error('handler.login.passwdNotMatch');
      }
  });
};

exports.logout = function (req, res) {
  db.accounts.update({'tokens.token': req.cookies.token}, {
    $pull: {'tokens': {'token': req.cookies.token}}
  }, function(err) {
    if (!err) {
      res.clearCookie('token');
      res.redirect('/');
    }
  });
};
