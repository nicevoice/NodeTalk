var db = require("../db");
var utils = require('../utils');
var auth = require('../auth');

exports.signup = function(req, res){
  var username = req.body['username'];

  function error(msg)
  {
    res.render('signup', {
      'errorMsg': req.t(msg),
      'username': username,
      'email': req.body['email']
    });
  }

  function validateEmail(email) {
    if (email.length == 0)
      return false;
    var re = /^[A-Za-z0-9_\-\.\+]+@[A-Za-z0-9_\-\.]+$/;
    return re.test(email);
  }

  if(req.body['passwd'] != req.body['passwd2'] || req.body['passwd'].length == 0)
    error('handler.signup.passwdNotEqual');

  if(!/^[A-Za-z][A-Za-z0-9\.\-_]+$/.test(username))
    error('handler.signup.invalidUsername');

  if(!validateEmail(req.body['email']))
    error('handler.signup.invalidEmail');

  db.accounts.findOne({"username": username}, function(err, result) {
    if(!err && !result)
    {
      db.accounts.insert({
        "username": username,
        "passwd": utils.sha256(utils.sha256(username) + utils.sha256(req.body['passwd'])),
        "email": req.body['email'],
        "created_at": utils.timestamp()
      }, function() {
        db.accounts.findOne({"username": username}, function(err, result) {
          auth.createToken(result, function(token) {
            res.cookie('token', token, {expires: new Date(Date.now() + 30 * 24 * 3600000)});
            res.redirect('/');
          })
        });
      });
    }
    else
    {
      error('handler.signup.usernameExist');
    }
  });
};
