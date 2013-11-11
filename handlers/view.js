var db = require("../db");

var render = function(req, res, name, param) {
  if(!req.cookies.token) {
    return res.render(name, param);
  }

  db.accounts.findOne({'tokens.token': req.cookies.token}, function(err, result) {
    if(!err) {
      if(!param)
        param = {};
      param.account = result;
      res.render(name, param);
    }
  });
}

exports.index = function(req, res) {
  render(req, res, 'index');
};

exports.signup = function(req, res){
  render(req, res, 'signup');
};

exports.login = function(req, res){
  render(req, res, 'login');
};
