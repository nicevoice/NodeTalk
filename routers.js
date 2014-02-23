exports.setRouters = function(app) {
  var node = require('./handlers/node');
  var account = require('./handlers/account');
  var topic = require('./handlers/topic');

  app.get( '/', topic.index);

  app.get( '/account/signup', account.signup);
  app.get( '/account/login', account.login);
  app.get( '/account/logout', account.logout);
  app.post('/account/signup', account.doSignup);
  app.post('/account/login', account.doLogin);

  app.get( '/topic/create', topic.create);
  app.post('/topic/create', topic.doCreate);
  app.get( '/topic/', topic.index);
  app.get( '/topic/:id', topic.view);
  app.post('/topic/:id', topic.doReply);

  app.get( '/node/', node.index);
};
