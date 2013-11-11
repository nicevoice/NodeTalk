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
app.use(app.router);
app.use(express.static(path.join(__dirname, 'static')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

(function() {
  var view = require('./handlers/view');
  var account = require('./handlers/account');

  require("./db");

  app.get('/', view.index);
  app.get('/account/signup/', view.signup);
  app.post('/account/signup/', account.signup);
  app.get('/account/login/', view.login);
  app.post('/account/login/', account.login);
})();

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


