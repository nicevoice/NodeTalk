var express = require('express');
var http = require('http');
var path = require('path');
var i18next = require('i18next');

var app = express();

i18next.init();
i18next.registerAppHelper(app);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(i18next.handle);
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'static')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

(function() {
  var node = require('./handlers/node');
  var account = require('./handlers/account');
  var topic = require('./handlers/topic');

  require("./db");

  app.get('/', topic.index);

  app.get('/account/signup/', account.signup);
  app.get('/account/login/', account.login);
  app.get('/account/logout/', account.logout);
  app.post('/account/signup/', account.doSignup);
  app.post('/account/login/', account.doLogin);

  app.get('/topic/create/', topic.create);
  app.get('/topic/', topic.index);
  app.get('/topic/:id/', topic.view);
  app.post('/topic/create/', topic.doCreate);

  app.get('/node/', node.index);
})();

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


