var db = require("../db");

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

  function sha256(data) {
    return require('crypto').createHash('md5').update(data).digest('hex');
  }

  function timestamp() {
    return Math.round(Date.now() / 1000);
  }

  if(req.body['passwd'] != req.body['passwd2'] || req.body['passwd'].length == 0)
    error('handler.signup.passwdNotEqual');

  if(!/^[A-Za-z][A-Za-z0-9\.\-_]+$/.test(username))
    error('handler.signup.invalidUsername');

  if(!validateEmail(req.body['email']))
    error('handler.signup.invalidEmail');

  db.users.findOne({"username": username}, function(err, result) {
    if(!err && !result)
    {
      db.users.insert({
        "username": username,
        "passwd": sha256(sha256(username) + sha256(req.body['passwd'])),
        "email": req.body['email'],
        "created_at": timestamp()
      }, {w: 0});
    }
    else
    {
      error('handler.signup.usernameExist');
    }
  });

  res.redirect('/');
};
