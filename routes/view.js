exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.signup = function(req, res){
  res.render('signup', {title: req.t("word.signup")});
};